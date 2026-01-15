<template>
  <view class="container">
    <view class="permission-content">
      <view class="permission-header">
        <text class="header-title">Application Permission Instructions</text>
        <text class="header-subtitle">All permissions are available by default for this application</text>
      </view>
      
      <view class="permission-item">
        <view class="permission-icon">
          <image src="/static/data.svg" class="icon-img"></image>
        </view>
        <view class="permission-info">
          <text class="permission-title">Storage Permission</text>
          <text class="permission-desc">Used to save and read your note file data locally</text>
        </view>
      </view>
      
     <view class="permission-item">
        <view class="permission-icon">
          <image src="/static/camera.svg" class="icon-img"></image>
        </view>
        <view class="permission-info">
          <text class="permission-title">Camera Permission</text>
          <text class="permission-desc">Used to add images to notes</text>
        </view>
      </view>
      
      <view class="permission-item">
        <view class="permission-icon">
          <image src="/static/device-icon.svg" class="icon-img"></image>
        </view>
        <view class="permission-info">
          <text class="permission-title">Device Information Access Permission</text>
          <text class="permission-desc">Used to provide better user experience and function adaptation</text>
        </view>
      </view>
      
      <view class="continue-btn-container">
        <button class="continue-btn" @click="handleContinue" v-if="isFirstLaunch">Get Started</button>
        <button class="back-btn" @click="goBack" v-else>Back</button>
      </view>
    </view>
  </view>
</template>

<script>
  import { checkPermissions } from '../../utils/permission-service.js';
  
  export default {
    data() {
      return {
        isFirstLaunch: false, // Whether it's the first launch
        permissionsLoaded: false // Whether permission check is completed
      }
    },
    onLoad() {
      // Check if it's the first launch synchronously to avoid rendering flickering
      this.isFirstLaunch = !uni.getStorageSync('hasLaunched');
      
      // Use setTimeout to delay permission check to avoid affecting page loading
      setTimeout(() => {
        this.checkAllPermissions();
      }, 100);
    },
    methods: {
      // Check all permissions
      async checkAllPermissions() {
        try {
          const permissions = await checkPermissions();
          console.log('Permission check result:', permissions);
        } catch (error) {
          console.error('Failed to check permissions:', error);
        }
      },
      
      // Handle continue button logic (for first launch)
      handleContinue() {
        // Mark as launched
        uni.setStorageSync('hasLaunched', true);
        
        // Navigate to homepage
        uni.reLaunch({
          url: '/pages/index/index'
        });
      },
      
      // Handle back button logic (for non-first launch)
      goBack() {
        uni.navigateBack({
          delta: 1
        });
      }
    }
  }
</script>

<style>
  .container {
    background-color: #ffffff;
    min-height: 100vh;
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .permission-content {
    background-color: white;
    border-radius: 12rpx;
    padding: 30rpx;
    max-width: 100%;
    box-sizing: border-box;
    width: 100%;
  }
  
  .permission-header {
    text-align: center;
    margin-bottom: 40rpx;
  }
  
  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .header-subtitle {
    font-size: 28rpx;
    color: #666;
  }
  
  .permission-item {
    padding: 40rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    background-color: #f8f8f8;
    display: flex;
    align-items: flex-start;
    gap: 20rpx;
    box-sizing: border-box;
  }
  
  .permission-item:last-child {
    margin-bottom: 0;
  }
  
  .permission-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  
  .icon-img {
    width: 60rpx;
    height: 60rpx;
  }
  
  .permission-info {
    flex: 1;
  }
  
  .permission-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .permission-desc {
    font-size: 28rpx;
    color: #666;
    line-height: 44rpx;
  }
  
  .continue-btn-container {
    margin-top: 60rpx;
    padding: 0 40rpx;
  }
  
  .continue-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #66aa66 0%, #44aa44 100%);
    color: white;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    letter-spacing: 2rpx;
    box-shadow: 0 8rpx 24rpx rgba(34, 136, 34, 0.3);
    transition: all 0.3s ease;
  }
  
  .continue-btn:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(34, 136, 34, 0.2);
  }
  
  .back-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #66aa66 0%, #44aa44 100%);
    color: white;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    letter-spacing: 2rpx;
    box-shadow: 0 8rpx 24rpx rgba(102, 102, 102, 0.3);
    transition: all 0.3s ease;
  }
  
  .back-btn:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(102, 102, 102, 0.2);
  }
</style>