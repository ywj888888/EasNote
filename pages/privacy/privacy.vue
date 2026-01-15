<template>
  <view class="container">
    <view class="privacy-content">
      <view class="privacy-notice rounded-section">
        <text class="notice-title">Data Storage Instructions</text>
        <text class="notice-content">1. All note data of this application is saved only locally on your device and will not be uploaded to any server.</text>
        <text class="notice-content">2. We do not collect, store, or share any of your personal information.</text>
        <text class="notice-content">3. You have complete control over the note content, and you can view, edit, or delete it at any time.</text>
        <text class="notice-content">4. Please keep your device safe to ensure data security.</text>
        <text class="notice-content">5. When uninstalling the application, all local data will be cleared.</text>
      </view>
      
      <view class="usage-guide rounded-section">
        <text class="notice-title">Application Usage Instructions</text>
        <text class="notice-content">1. Create a note: Click the add button at the bottom center of the home page, enter the note content, and then click save.</text>
        <text class="notice-content">2. View notes: Click any note in the home page list to view its complete content.</text>
        <text class="notice-content">3. Edit notes: After viewing the note details, click the note card to modify the content, and then click save. Or delete the content directly.</text>
        <text class="notice-content">4. Restore notes: Click the note card on the recycle bin page, and select the restore button to move the note back to the home page, or permanently delete the note.</text>
      </view>
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
    }
  }
</script>

<style>
  .container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20rpx;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  
  .privacy-content {
    background-color: white;
    border-radius: 12rpx;
    padding: 30rpx;
    max-width: 100%;
    box-sizing: border-box;
    width: 100%;
  }
  
  .rounded-section {
    background-color: #f8f8f8;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    box-sizing: border-box;
    width: 100%;
  }
  
  .rounded-section:last-child {
    margin-bottom: 0;
  }
  
  .privacy-notice,
  .usage-guide {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  
  .notice-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .notice-content {
    font-size: 32rpx;
    color: #666;
    line-height: 50rpx;
    word-wrap: break-word;
  }
</style>