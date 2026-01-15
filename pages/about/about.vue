<template>
  <view class="container">
    <view class="about-content">
      <!-- App Logo and Name -->
      <view class="app-info">
        <image src="/static/logo.png" class="app-logo"></image>
        <text class="app-name">EasNote</text>
        <text class="app-version">Version 1.0.0</text>
      </view>
      
      <!-- Features Introduction -->
      <view class="feature-section">
        <text class="section-title">Features</text>
        <text class="feature-desc">EasNote is a lightweight note-taking application that helps you record beautiful moments and important ideas in your life.</text>
      </view>
      
      <!-- Contact Information -->
      <view class="contact-section">
        <text class="section-title">Contact Us</text>
        <view class="contact-item">
          <text class="contact-label">Email:</text>
          <text class="contact-value">953617338@qq.com</text>
        </view>
      </view>
      
      <!-- Copyright Information -->
      <view class="copyright">
        <text class="copyright-text">© 2025 EasNote. All rights reserved.</text>
      </view>
    </view>
    
    <!-- Bottom Navigation Area -->
    <view class="bottom-nav">
      <button class="nav-btn" @click="goBack">
        <image src="/static/home-white.svg" class="nav-icon"></image>
        <text class="nav-text">Back to Home</text>
      </button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // Page data
      }
    },
    onLoad() {
      // Page loading
    },
    methods: {
      // Return to homepage
      goBack() {
        uni.navigateTo({
          url: '/pages/index/index'
        });
      }
    }
  }
</script>

<style>
  .container {
    background-color: #f5f5f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .about-content {
    flex: 1;
    padding: 40rpx 20rpx 120rpx; /* Reserve space for bottom navigation */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .app-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;
    margin-top: 60rpx;
    background-color: white;
    padding: 40rpx 30rpx;
    border-radius: 20rpx;
    width: 100%;
    max-width: 500rpx;
    box-sizing: border-box;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
  
  .app-logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
	border-radius: 20rpx;
  }
  
  .app-name {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .app-version {
    font-size: 28rpx;
    color: #228822;
  }
  
  .feature-section,
  .contact-section {
    width: 90%;
    background-color: white;
    padding: 40rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .feature-desc {
    font-size: 28rpx;
    color: #666;
    line-height: 44rpx;
    word-wrap: break-word;
  }
  
  .contact-item {
    margin-bottom: 8rpx;
    display: flex;
    align-items: center;
  }
  
  .contact-label {
    font-size: 28rpx;
    color: #666;
    min-width: 80rpx;
  }
  
  .contact-value {
    font-size: 28rpx;
    color: #228822;
    font-weight: 500;
    word-wrap: break-word;
  }
  
  .copyright {
    margin-top: 40rpx;
    text-align: center;
  }
  
  .copyright-text {
    font-size: 24rpx;
    color: #999;
  }
  
  /* Bottom navigation area style - similar to bottom-nav in index.vue */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #66aa66;
    padding: 20rpx 0;
    border-top: 1px solid #333;
    z-index: 999;
  }
  
  .nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    min-width: 120rpx;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
  }
  
  .nav-btn:focus,
  .nav-btn:focus-visible,
  .nav-btn:focus-within {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    appearance: none;
  }
  
  .nav-btn:active,
  .nav-btn:active:focus,
  .nav-btn:active:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    appearance: none;
  }
  
  .nav-btn:hover {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .nav-btn::before,
  .nav-btn::after {
    border: none !important;
    outline: none !important;
  }
  
  .nav-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 8rpx;
  }
  
  .nav-text {
    font-size: 24rpx;
    color: #fff;
    font-weight: 500;
  }
</style>