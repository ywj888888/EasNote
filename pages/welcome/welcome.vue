<template>
	<view class="welcome-container">
		<view class="content-section">
			<image class="app-logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">EasNote</text>
			<text class="version-info">Version 1.0.0</text>
		</view>
		
		<view class="loading-section">
				<!-- Jumping Dots Animation Sequence -->
			<view class="dot-container">
				<view class="dot dot1"></view>
				<view class="dot dot2"></view>
				<view class="dot dot3"></view>
			</view>
			<text class="loading-text">Starting...</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
			return {
				loadingTimer: null // Loading completion timer
			}
		},
	onLoad() {
			// When page loads, start the jumping dots animation and navigate to homepage after 3 seconds
			this.startLoadingAnimation();
		},
	onShow() {
			// Logic when page is displayed
		},
	onHide() {
			// Logic when page is hidden
		},
	onUnload() {
			// Clean up timer when page is unloaded
			this.clearLoadingTimer();
		},
	methods: {
			// Start loading animation
			startLoadingAnimation() {
				// Navigate after 2 seconds to let users see the complete jumping dots animation
				this.loadingTimer = setTimeout(() => {
					this.navigateToApp();
				}, 2000);
			},
		
		// Clean up loading timer
			clearLoadingTimer() {
			if (this.loadingTimer) {
				clearTimeout(this.loadingTimer);
				this.loadingTimer = null;
			}
		},
		
		// Navigate to application main page
			navigateToApp() {
			this.clearLoadingTimer();
			
			// Check if it's the first launch
			const isFirstLaunch = !uni.getStorageSync('hasLaunched');
			
			if (isFirstLaunch) {
				// First launch, navigate to permission management page
				uni.navigateTo({
					url: '/pages/permission/permission'
				});
				// Mark as launched
				uni.setStorageSync('hasLaunched', true);
			} else {
				// Non-first launch, directly navigate to homepage
				uni.navigateTo({
					url: '/pages/index/index'
				});
			}
		}
	}
}
</script>

<style scoped>
.welcome-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #eeeeee 0%, #44aa44 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	color: white;
}

.content-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100rpx;
}

.app-logo {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 15rpx 40rpx rgba(0, 0, 0, 0.3);
	animation: logoFloat 3s ease-in-out infinite;
}

.app-name {
	font-size: 52rpx;
	font-weight: bold;
	letter-spacing: 3rpx;
	margin-bottom: 20rpx;
	text-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.3);
	animation: nameGlow 2s ease-in-out infinite alternate;
}

.version-info {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	font-weight: 300;
	letter-spacing: 1rpx;
}

.loading-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: fadeIn 1s ease-out;
}

/* Jumping Dots Animation Styles */
.dot-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 40rpx;
}

.dot {
	width: 16rpx;
	height: 16rpx;
	background-color: white;
	border-radius: 50%;
	margin: 0 8rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 255, 255, 0.4);
}

/* Set different animation delays for each dot to create a wave effect */
.dot1 {
	animation: jump 1.4s infinite ease-in-out;
}

.dot2 {
	animation: jump 1.4s infinite ease-in-out 0.2s;
}

.dot3 {
	animation: jump 1.4s infinite ease-in-out 0.4s;
}

.loading-text {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 300;
}

/* Animation Definitions */
@keyframes logoFloat {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10rpx);
	}
}

@keyframes nameGlow {
	from {
		text-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.3);
	}
	to {
		text-shadow: 0 5rpx 25rpx rgba(255, 255, 255, 0.3);
	}
}



@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Jumping Dots Animation Keyframes */
@keyframes jump {
	0%, 80%, 100% { 
		transform: translateY(0) scale(1); 
		opacity: 0.3; 
		box-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.2);
	}
	40% { 
		transform: translateY(-25rpx) scale(1.3); 
		opacity: 1; 
		box-shadow: 0 6rpx 20rpx rgba(255, 255, 255, 0.6);
	}
}
</style>