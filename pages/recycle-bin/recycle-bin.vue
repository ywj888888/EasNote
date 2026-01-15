<template>
  <view class="container">
    <!-- Page Title -->
    <view class="header">
      <text class="header-title"></text>
    </view>
    
    <!-- Recycle Bin Notes List -->
    <view class="notes-list" v-if="recycleBinNotes.length > 0">
      <view class="note-item" v-for="(note, index) in recycleBinNotes" :key="note.id" @tap="showActionMenu(note.id, $event)">
        <view class="note-content">
          <text class="note-title">{{ note.title || 'Untitled Note' }}</text>
          <text class="note-preview">{{ note.content?.substring(0, 50) }}...</text>
          <view class="note-date">
            <text>Deletion Time: {{ formatDate(note.deleteTime) }}</text>
          </view>
        </view>

      </view>
    </view>
    
    <!-- Empty State Hint (with gray semi-transparent overlay) -->
    <view class="empty-state-container" v-else>
      <view class="empty-state-overlay"></view>
      <view class="empty-state">
        <image src="/static/empty.png" class="empty-logo"></image>
        <text class="empty-text">Recycle Bin is empty</text>
      </view>
    </view>
    
    <!-- Floating Menu Component -->
    <view class="popup-menu" v-if="showMenu" :style="menuStyle">
      <view class="menu-backdrop" @tap="hideActionMenu"></view>
      <view class="menu-content">
        <button class="menu-item" @tap="handleRestore">
          <image src="/static/redo.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Restore Note</text>
        </button>
        <button class="menu-item" @tap="handlePermanentlyDelete">
          <image src="/static/delete.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Permanently Delete</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  import { getRecycleBinNotes, restoreNoteFromRecycleBin, permanentlyDeleteNote } from '../../utils/note-service.js';
  
  export default {
    data() {
      return {
        recycleBinNotes: [], // Recycle bin notes list data
        showMenu: false,
        currentNoteId: null,
        menuX: 0,
        menuY: 0,
        menuStyle: {}
      }
    },
    onLoad() {
      // Load recycle bin notes when page loads
      this.loadRecycleBinNotes();
      // Set navigation bar title
      uni.setNavigationBarTitle({
        title: 'Recycle Bin'
      });
    },
    onShow() {
      // Reload recycle bin notes when page shows
      this.loadRecycleBinNotes();
    },
    methods: {
      // Load recycle bin notes list
      loadRecycleBinNotes() {
        try {
          this.recycleBinNotes = getRecycleBinNotes();
          // Sort by deletion time in descending order (newest deleted first)
          this.recycleBinNotes.sort((a, b) => b.deleteTime - a.deleteTime);
        } catch (error) {
          console.error('Failed to load recycle bin notes:', error);
          uni.showToast({
            title: 'Failed to load recycle bin',
            icon: 'none'
          });
        }
      },
      
      // Format date
      formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      },
      
      // Show floating menu
      showActionMenu(id, e) {
        this.currentNoteId = id;
        
        // Record click position, add defensive checks
        if (e && e.touches && e.touches[0]) {
          this.menuX = e.touches[0].clientX;
          this.menuY = e.touches[0].clientY;
        }
        
        // Get screen width
        const screenWidth = uni.getSystemInfoSync().windowWidth;
        // Menu width (about 55% of screen width according to style definition)
        const menuWidth = screenWidth * 0.55;
        
        // Screen edge detection: if the distance from the click position to the right screen edge is less than the menu width, move the menu to the left
        let adjustedLeft = this.menuX;
        if (screenWidth - this.menuX < menuWidth) {
          adjustedLeft = screenWidth - menuWidth;
        }
        
        // Set menu position
        this.menuStyle = {
          position: 'fixed',
          left: `${adjustedLeft}px`,
          top: `${this.menuY}px`,
          zIndex: 999
        };
        
        this.showMenu = true;
      },
      
      // Hide floating menu
      hideActionMenu() {
        this.showMenu = false;
      },
      
      // Handle note restoration
      handleRestore() {
        this.restoreNote(this.currentNoteId);
        this.hideActionMenu();
      },
      
      // Handle permanent deletion
      handlePermanentlyDelete() {
        this.permanentlyDelete(this.currentNoteId);
        this.hideActionMenu();
      },
      
      // Restore note
      restoreNote(id) {
        uni.showModal({
          title: 'Confirm Restore',
          content: 'Are you sure you want to restore this note?',
          success: (res) => {
            if (res.confirm) {
              const success = restoreNoteFromRecycleBin(id);
              if (success) {
                // Reload list after successful restoration
                this.loadRecycleBinNotes();
                uni.showToast({
                  title: 'Restore successful',
                  icon: 'success'
                });
              } else {
                uni.showToast({
                  title: 'Restore failed',
                  icon: 'none'
                });
              }
            }
          }
        });
      },
      
      // Permanently delete note
      permanentlyDelete(id) {
        uni.showModal({
          title: 'Confirm Permanent Deletion',
          content: 'This operation will permanently delete the note and cannot be recovered!',
          confirmText: 'Permanently Delete',
          confirmColor: '#ff4d4f',
          success: (res) => {
            if (res.confirm) {
              const success = permanentlyDeleteNote(id);
              if (success) {
                // Reload list after successful deletion
                this.loadRecycleBinNotes();
                uni.showToast({
                  title: 'Permanently deleted successfully',
                  icon: 'success'
                });
              } else {
                uni.showToast({
                  title: 'Delete failed',
                  icon: 'none'
                });
              }
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  .container {
    background-color: #000000;
    min-height: 100vh;
    padding-bottom: 20rpx;
  }
  
  .header {
    padding: 20rpx;
    border-bottom: 1px solid #333;
    background-color: #000000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }
  
  /* Notes List Styles */
  .notes-list {
    padding: 20rpx;
  }
  
  .note-item {
    background-color: #778899; /* Recycle bin note background color changed to specified color */
    border: 1px solid #778899;
    border-radius: 12rpx;
    padding: 21rpx;
    margin-bottom: 20rpx;
    opacity: 0.9; /* Slightly reduce opacity to indicate deleted */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66.7%; /* Width remains unchanged */
    height: 200rpx; /* Set fixed height */
    position: relative;
    transition: all 0.3s ease;
  }
  
  /* Left align for odd indices */
  .note-item:nth-child(odd) {
    margin-left: 0;
    margin-right: auto;
  }
  
  /* Right align for even indices */
  .note-item:nth-child(even) {
    margin-left: auto;
    margin-right: 0;
  }
  
  .note-item:active {
    background-color: #667788;
    transform: scale(0.98);
  }
  
  .note-content {
    width: 100%;
    background-color: white;
    padding: 25rpx;
    border-radius: 12rpx;
    height: 158rpx;
    overflow: hidden;
  }
  
  .note-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .note-preview {
    font-size: 28rpx;
    color: #888;
    display: block;
    margin-bottom: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .note-date {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 15rpx;
  }
  

  
  /* Empty State Container Styles */
  .empty-state-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 1;
  }
  
  /* Empty State Styles */
  .empty-state {
    text-align: center;
    background-color: transparent;
    border: 2rpx dashed #666;
    border-radius: 16rpx;
    padding: 60rpx 40rpx;
  }
  
  .empty-logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #666;
    font-weight: 500;
  }
  
  /* Popup Menu Styles - Consistent with index.vue */
  .popup-menu {
    position: fixed;
    z-index: 999;
  }
  
  .menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: transparent;
    z-index: 1;
  }
  
  .menu-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 55%;
    min-width: 320rpx;
    background-color: white;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
    z-index: 2;
    display: block;
  }
  
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 25rpx 30rpx;
    margin: 0;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    text-align: left;
    line-height: 1;
    height: 120rpx;
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
  
  .menu-item-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 20rpx;
  }
  
  .menu-item-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
  }
</style>