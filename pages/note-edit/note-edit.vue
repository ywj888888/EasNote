<template>
  <view class="container">
        <!-- Buttons Container -->
    <view class="buttons-container">
      <button class="icon-button" @click="importImageFromAlbum">
        <image src="/static/add-icon-white.svg" class="button-icon"></image>
      </button>
     <button class="icon-button delete-icon-button" @click="deleteNote" v-if="noteId">
        <image src="/static/delete-white.svg" class="button-icon"></image>
      </button>
      <button class="icon-button save-icon-button" @click="saveNote">
        <image src="/static/save-white.svg" class="button-icon"></image>
      </button>
    </view>
    <view class="edit-container">

      <!-- Content Input (no separate title input box anymore) -->
      <textarea class="content-textarea" placeholder="Please enter note content" v-model="noteContent" maxlength="10000" show-confirm-bar="false" auto-height="true" />
      
      <!-- Image Preview Area -->
      <view class="image-preview-container" v-if="selectedImages.length > 0">
        <!-- Image Count Counter -->
        <view class="image-count">
          <text>{{ selectedImages.length }}/30 images</text>
        </view>
        <view class="image-item" v-for="(image, index) in selectedImages" :key="index" @click="showImageActionMenu(index, $event)">
          <image class="preview-image" :src="image" mode="aspectFill" lazy-load></image>
        </view>
      </view>
    </view>
    
    <!-- Image Operation Floating Menu -->
    <view class="popup-menu" v-if="showImageMenu" :style="imageMenuStyle">
      <view class="menu-backdrop" @click="hideImageActionMenu"></view>
      <view class="menu-content">
        <button class="menu-item" @click="handleDeleteImage">
          <image src="/static/delete.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Delete Image</text>
        </button>
        <button class="menu-item" @click="handleExportImage">
          <image src="/static/save-icon.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Export Image</text>
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
  .container {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  
  .edit-container {
    flex: 1;
    padding: 0 20rpx;
    padding-bottom: 100rpx; /* Reserve space for bottom buttons */
    margin: 0 auto; /* Center horizontally */
    width: 100%; /* Ensure container uses full width */
    max-width: none; /* Remove maximum width limit */
  }
  
  .content-textarea {
    width: 100% !important; /* Use !important to ensure full width */
    box-sizing: border-box !important; /* Ensure padding doesn't increase width */
    min-height: 333rpx; /* Height reduced by 1/3 (from 500rpx to about 333rpx) */
    max-height: 600rpx; /* Set maximum height */
    overflow-y: auto; /* Allow vertical scrolling */
    background-color: #f0f0f0; /* Background changed to gray */
    border: none;
    outline: none;
    font-size: 32rpx;
    line-height: 1.6;
    margin-bottom: 20rpx;
    margin-top: 0; /* Ensure at container top */
    /* Ensure textarea style has high priority */
    position: relative;
    z-index: 1;
  }
  
  .buttons-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20rpx;
    background-color: #66aa66;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
    z-index: 100;
    height: 80rpx;
  }
  
  .icon-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
    margin-right: 80rpx;
    border: none;
    box-shadow: none;
    background-color: #66aa66;
    /* Ensure button style has high priority */
    position: relative;
    z-index: 1;
    /* Add the following properties to remove uni-app button default border */
    border-style: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  /* Additional style reset for uni-app buttons */
  .icon-button::after {
    border: none;
    border-style: none;
  }
  
  .icon-button:last-child {
    margin-right: 0;
  }
  
  .button-icon {
    width: 50rpx;
    height: 50rpx;
  }
  
  .save-icon-button {
    /* background-color: #228822; */
  }
  
  .delete-icon-button {
    /* background-color: #228822; */
  }
  
  .image-preview-container {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: #000000 !important; /* Black background, use !important to ensure priority */
  }
  
  .image-count {
    color: #ffffff;
    font-size: 28rpx;
    padding: 10rpx 20rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20rpx;
    margin-bottom: 10rpx;
    align-self: flex-start;
  }
  
  .image-item {
    position: relative;
    width: 100%;
    height: 400rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    background-color: #000000 !important; /* Black background, use !important to ensure priority */
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Changed to contain, so image doesn't fully cover background */
    background-color: transparent; /* Ensure image background is transparent */
    /* Ensure images load and display correctly */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* Add image loading transition effect */
    transition: opacity 0.3s ease-in-out;
  }
  /* Placeholder effect before image loads */
  .preview-image[src]:not([src=""]) {
    opacity: 1;
  }
  /* Fix possible path issues */
  .image-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000; /* Black background */
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .image-item img {
    z-index: 1;
  }
  
  .image-remove {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 60rpx;
    height: 60rpx;
    background-color: #ff4d4f;
    color: #ffffff;
    border-radius: 50%;
    text-align: center;
    line-height: 60rpx;
    font-size: 48rpx;
  }
  

</style>

<script>
  import { getNoteById, saveNote as saveNoteData, deleteNote as deleteNoteById } from '@/utils/note-service.js';
  import { requestPermissions } from '@/utils/permission-service.js';
  import { checkNetworkStatus, executeWithNetworkCheck } from '@/utils/network-monitor.js';
  
  export default {
      data() {
        return {
          noteId: null,
          noteContent: '',
          selectedImages: [],
        // Image operation menu related data
        showImageMenu: false,
        currentImageIndex: null,
        imageMenuX: 0,
        imageMenuY: 0,
        imageMenuStyle: {} // Image operation menu related data
      }
    },
    onLoad(options) {
      // Get note ID from URL parameters, if exists then in edit mode
      if (options && options.id) {
        this.noteId = options.id;
        this.loadNote(this.noteId);
      }
      
      // Set navigation bar title
      uni.setNavigationBarTitle({
        title: this.noteId ? 'Edit Note' : 'New Note'
      });
    },
    methods: {
      // Load note content
      loadNote(id) {
        try {
          const note = getNoteById(id);
          if (note) {
            this.noteContent = note.content || '';
            // If there are images in the note, load them
            if (note.images && Array.isArray(note.images)) {
              this.selectedImages = [...note.images];
            }
          } else {
            uni.showToast({
              title: 'Note does not exist',
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('Failed to load note:', error);
          uni.showToast({
            title: 'Failed to load note',
            icon: 'none'
          });
        }
      },
      
      // Save note
      saveNote() {
        // Check if the number of images exceeds the limit
        const MAX_IMAGES = 30;
        if (this.selectedImages.length > MAX_IMAGES) {
          uni.showToast({
            title: 'Each note can contain a maximum of 30 images. Please delete excess images before saving.',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        
        // Generate title
        let noteTitle = '';
        if (this.noteContent.trim()) {
          // Generate title from content when there is text content
          noteTitle = this.noteContent.trim().substring(0, 8);
        } else if (this.selectedImages.length > 0) {
          // Use "pic"+time as title when there are only images and no text
          const now = new Date();
          const timeStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          noteTitle = `pic${timeStr}`;
        } else {
          uni.showToast({
            title: 'Note content cannot be empty',
            icon: 'none'
          });
          return;
        }
        
        const noteData = {
          id: this.noteId,
          title: noteTitle,
          content: this.noteContent.trim(),
          images: this.selectedImages // Add selected images
        };
        
        const success = saveNoteData(noteData);
        
        if (success) {
          uni.showToast({
            title: this.noteId ? 'Update successful' : 'Save successful',
            icon: 'success'
          });
          // Delay return to let user see success message
            setTimeout(() => {
            uni.navigateBack();
          }, 500);
        } else {
          uni.showToast({
            title: 'Save failed',
            icon: 'none'
          });
        }
      },
      
      // Import image from album
      async importImageFromAlbum() {
        try {
          // Check if current image count has reached the upper limit
          const MAX_IMAGES = 30;
          const currentCount = this.selectedImages.length;
          
          if (currentCount >= MAX_IMAGES) {
            uni.showToast({
              title: 'Each note can contain a maximum of 30 images',
              icon: 'none'
            });
            return;
          }
          
          // Check network status first
          const isConnected = await checkNetworkStatus(true);
          if (!isConnected) {
            return; // Return directly when network is abnormal
          }
          
          // Request album permissions
          const permissionResult = await requestPermissions(['album']);
          
          if (!permissionResult.album) {
            uni.showToast({
              title: 'Album permission is required to select images',
              icon: 'none'
            });
            return;
          }
          
          // Calculate remaining selectable images
          const remainingCount = MAX_IMAGES - currentCount;
          const selectCount = Math.min(9, remainingCount); // Maximum 9 images, but not exceeding remaining available
          
          // Use uni-app API to select images
          uni.chooseImage({
            count: selectCount, // Dynamically set the number of selectable images
            sizeType: ['original', 'compressed'], // Can choose original or compressed images
            sourceType: ['album'], // Only select from album
            success: async (res) => {
              // Show loading prompt
              uni.showLoading({
                title: 'Saving images...'
              });
              
              // Save each image to permanent storage
              const savedPaths = [];
              for (const tempPath of res.tempFilePaths) {
                try {
                  // Use uni.saveFile to save to permanent storage
                  const saveResult = await new Promise((resolve, reject) => {
                    uni.saveFile({
                      tempFilePath: tempPath,
                      success: resolve,
                      fail: reject
                    });
                  });
                  
                  // Save successful, add permanent path
                  savedPaths.push(saveResult.savedFilePath);
                } catch (error) {
                  console.error('Failed to save image:', error);
                  // If save fails, use temporary path as alternative
                  savedPaths.push(tempPath);
                }
              }
              
              // Add saved image paths to array
              this.selectedImages = [...this.selectedImages, ...savedPaths];
              
              // Hide loading prompt
              uni.hideLoading();
              
              // Show success message
               uni.showToast({
                 title: `${savedPaths.length} images selected and saved`,
                 icon: 'success'
               });
            },
            fail: (error) => {
              console.error('Failed to select images:', error);
              uni.showToast({
                 title: 'Failed to select images',
                 icon: 'none'
               });
            }
          });
        } catch (error) {
    console.error('Failed to import images:', error);
    uni.showToast({
       title: 'Failed to import images',
       icon: 'none'
     });
  }
      },
      
      // Remove image
      removeImage(index) {
        // Get the path of the image to be deleted
        const imagePath = this.selectedImages[index];
        
        // Remove from array
        this.selectedImages.splice(index, 1);
        
        // Try to delete the persistently saved file
        // Usually, paths saved by uni.saveFile contain specific directories, we can judge by path features
        if (imagePath && typeof imagePath === 'string') {
          // Check if it might be a persistently saved file path
          if (imagePath.includes('/uniapp_save/') || imagePath.includes('internal://')) {
            uni.removeSavedFile({
              filePath: imagePath,
              fail: (error) => {
                // Delete failure doesn't affect user experience, just log it
                console.log('Failed to delete image file:', error);
              }
            });
          }
        }
      },
      
      // Delete note
      deleteNote() {
        uni.showModal({
          title: 'Confirm Delete',
          content: 'Are you sure you want to delete this note? It can be found in the recycle bin after deletion.',
          success: (res) => {
            if (res.confirm) {
              const success = deleteNoteById(this.noteId);
              if (success) {
                uni.showToast({
                  title: 'Moved to recycle bin',
                  icon: 'success'
                });
                // Delay return to let user see success message
            setTimeout(() => {
                  uni.navigateBack();
                }, 500);
              } else {
                uni.showToast({
                  title: 'Delete failed',
                  icon: 'none'
                });
              }
            }
          }
        });
      },
      
      // Show image operation menu
      showImageActionMenu(index, event) {
        this.currentImageIndex = index;
        
        // Get click position
        const systemInfo = uni.getSystemInfoSync();
        const pageX = event.detail.x || event.touches[0].pageX;
        const pageY = event.detail.y || event.touches[0].pageY;
        // Calculate menu position to avoid going out of screen
        const menuWidth = 140; // Menu width (approximate)
        const menuHeight = 160; // Menu height (approximate)
        
        let menuX = pageX;
        let menuY = pageY;
        
        // If menu may exceed right boundary, shift left
        if (pageX + menuWidth > systemInfo.windowWidth) {
          menuX = pageX - menuWidth;
        }
        
        // If menu may exceed bottom boundary, shift up
        if (pageY + menuHeight > systemInfo.windowHeight) {
          menuY = pageY - menuHeight;
        }
        
        this.imageMenuStyle = {
          left: menuX + 'px',
          top: menuY + 'px',
          position: 'fixed',
          zIndex: 999
        };
        
        this.showImageMenu = true;
      },
      
      // Hide image operation menu
      hideImageActionMenu() {
        this.showImageMenu = false;
        this.currentImageIndex = null;
      },
      
      // Handle delete image
      handleDeleteImage() {
        if (this.currentImageIndex !== null) {
          // Confirm deletion
        uni.showModal({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this image?',
            success: (res) => {
              if (res.confirm) {
                this.removeImage(this.currentImageIndex);
                uni.showToast({
                  title: 'Image deleted',
                  icon: 'success'
                });
              }
            }
          });
        }
        this.hideImageActionMenu();
      },
      
      // Handle export image
      handleExportImage() {
        if (this.currentImageIndex !== null) {
          const imagePath = this.selectedImages[this.currentImageIndex];
          
          // Show loading prompt
        uni.showLoading({
          title: 'Saving...'
        });
        
        // Save image to album
        uni.saveImageToPhotosAlbum({
            filePath: imagePath,
            success: () => {
              uni.hideLoading();
              uni.showToast({
                title: 'Image saved to album',
                icon: 'success'
              });
            },
            fail: (error) => {
              uni.hideLoading();
              console.error('Failed to save image to album:', error);
              
              // If it's a permission issue, prompt user
              if (error.errMsg && error.errMsg.includes('auth denied')) {
                uni.showModal({
                  title: 'Insufficient permissions',
                  content: 'Album permission is required to save images. Please enable it in settings.',
                  confirmText: 'Go to settings',
                  success: (res) => {
                    if (res.confirm) {
                      // Open application settings
                      uni.openSetting();
                    }
                  }
                });
              } else {
                uni.showToast({
                  title: 'Save failed',
                  icon: 'none'
                });
              }
            }
          });
        }
        this.hideImageActionMenu();
      }
    }
  }
</script>

<style>
  /* Remove global styles that conflict with scoped styles */
  
  /* Image operation floating menu style */
  .popup-menu {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  
  .menu-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  
  .menu-content {
    background-color: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    padding: 16rpx 0;
    min-width: 140px;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
  }
  
  .menu-item:active {
    background-color: #f5f5f5;
  }
  
  .menu-item-icon {
    width: 24px;
    height: 24px;
    margin-right: 16rpx;
  }
  
  .menu-item-text {
    font-size: 16px;
    line-height: 1;
  }
  
  /* Image item style optimization */
  .image-item {
    position: relative;
    margin-bottom: 16rpx;
    cursor: pointer;
  }
  
  .image-item:active {
    opacity: 0.8;
  }
</style>