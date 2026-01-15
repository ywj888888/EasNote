<template>
  <view class="container">
    <!-- Header Operation Area -->
    <view class="header" :style="{'padding-top': (20 + statusBarHeight * 2) + 'rpx'}">
      <view class="header-content">
        <text class="header-title">Current Date: {{ currentDate }}</text>
        <text class="note-count">Notes Count: {{ notes.length }}</text>
      </view>
      <button class="menu-btn" @tap="toggleMenu">
        <image src="/static/menu.svg" class="menu-icon"></image>
      </button>
    </view>
    
    
    <!-- Popup Menu -->
    <view class="popup-menu" v-if="showMenu">
      <view class="menu-backdrop" @tap="toggleMenu"></view>
      <view class="menu-content">
        <button class="menu-item" @tap="goToPermission">
          <image src="/static/device-icon.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Permission Declaration</text>
        </button>
        <button class="menu-item" @tap="goToPrivacy">
          <image src="/static/network-icon.svg" class="menu-item-icon"></image>
          <text class="menu-item-text">Privacy Declaration</text>
        </button>
      </view>
    </view>
    
    <!-- Middle Content Area -->
    <view class="contain">  
      <!-- Notes List -->
      <view class="notes-list" v-if="notes.length > 0">
        <view class="note-item" v-for="note in notes" :key="note.id">
          <image :src="note.images && note.images.length > 0 ? '/static/logo.png' : '/static/logo-white.png'" class="note-icon"></image>
          <view class="note-content">
            <view class="note-header" @tap="editNote(note.id)">
              <text class="note-title">{{ note.title || 'Untitled Note' }}</text>
            </view>
            <view class="note-preview" @tap="editNote(note.id)">
              <text>{{ note.content?.substring(0, 50) }}...</text>
            </view>
            <view class="note-date-actions">
              <text class="note-date">{{ formatDate(note.createTime) }}</text>

            </view>
          </view>
        </view>
      </view>
      
      <!-- Empty State Prompt (with gray translucent overlay) -->
      <view class="empty-state-container" v-else>
        <view class="empty-state-overlay"></view>
        <view class="empty-state">
          <image src="/static/empty.png" class="empty-logo"></image>
          <text class="empty-text">No notes yet, click the button below to add</text>
        </view>
      </view>
    </view>
    
    <!-- Add Button -->
    <button class="add-btn" @tap="addNote">
      <text class="add-icon-text">+</text>
    </button>
    
    <!-- Bottom Navigation Area -->
    <view class="bottom-nav">
      <button class="nav-btn" @tap="goToRecycleBin">
        <image src="/static/delete-white.svg" class="nav-icon"></image>
        <text class="nav-text">Recycle Bin</text>
      </button>
      <button class="nav-btn" @tap="goToAbout">
        <image src="/static/about-white.svg" class="nav-icon"></image>
        <text class="nav-text">About</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getAllNotes } from '@/utils/note-service.js';
import { requestPermissions } from '@/utils/permission-service.js';
import { monitorNetworkChange } from '@/utils/network-monitor.js';

export default {
  data() {
    return {
      notes: [], // Notes list data
      showMenu: false, // Popup menu display status
      currentDate: '', // Current date
      statusBarHeight: 0 // Status bar height
    }
  },
  onLoad() {
    // Get status bar height
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    
    // Set current date
    this.updateCurrentDate();
    // Load notes list when page loads
    this.loadNotes();
    
    // Monitor network status changes
    this.setupNetworkMonitoring();
  },
  // Reload notes list when page shows (handle edit or add scenarios)
  onShow() {
    // Update current date
    this.updateCurrentDate();
    this.loadNotes();
    // Reset popup menu state to ensure menu is closed when returning from other pages
    this.showMenu = false;
  },
  methods: {
    // Load notes list
    loadNotes() {
      try {
        this.notes = getAllNotes();
        // Sort by update time descending
        this.notes.sort((a, b) => b.updateTime - a.updateTime);
      } catch (error) {
        console.error('Failed to load notes:', error);
        uni.showToast({
          title: 'Failed to load notes',
          icon: 'none'
        });
      }
    },
    
    // Format date (for UI display)
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    
    // Page navigation methods
    addNote() {
      uni.navigateTo({ url: '/pages/note-edit/note-edit' });
    },
    
    editNote(id) {
      uni.navigateTo({ url: `/pages/note-edit/note-edit?id=${id}` });
    },
    

    
    // Bottom navigation bar navigation
    goToIndex() {
      // Already on homepage, no action needed
    },
    
    goToPermission() {
      uni.navigateTo({ url: '/pages/permission/permission' });
    },
    
    goToPrivacy() {
      uni.navigateTo({ url: '/pages/privacy/privacy' });
    },
    
    goToAbout() {
      uni.navigateTo({ url: '/pages/about/about' });
    },
    
    goToRecycleBin() {
      uni.navigateTo({ url: '/pages/recycle-bin/recycle-bin' });
    },
    
    // Toggle menu display status
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    
    // Update current date
    updateCurrentDate() {
      this.currentDate = this.formatDate(new Date().getTime());
    },
    
    // Set up network status monitoring
    setupNetworkMonitoring() {
      monitorNetworkChange((res) => {
        if (!res.isConnected) {
          uni.showToast({
            title: 'Network disconnected, offline mode',
            icon: 'none',
            duration: 3000
          });
        } else {
          let networkType = '';
          switch (res.networkType) {
            case 'wifi':
              networkType = 'WiFi';
              break;
            case '4g':
              networkType = '4G';
              break;
            case '3g':
              networkType = '3G';
              break;
            case '2g':
              networkType = '2G';
              break;
            default:
              networkType = res.networkType;
          }
          
          uni.showToast({
            title: `Network connected (${networkType})`,
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  }
}
</script>

<style>
.container {
  background-color: #333333; /* Consistent with tabBar background color */
  height: 100vh; /* Fixed height as viewport height */
  overflow: hidden; /* Prevent scrolling for the entire container */
  display: flex;
  flex-direction: column;
}

.contain {
  background-color: #000;
  border-radius: 30rpx; /* Add rounded rectangle effect */
  padding: 0;
  margin: 0;
  margin-top: calc(180rpx + var(--status-bar-height, 0rpx)) !important; /* Reserve space for fixed header and status bar */
  margin-bottom: 120rpx; /* Reserve space for bottom navigation bar */
  margin-left: auto; /* Center horizontally */
  margin-right: auto;
  flex: 1;
  overflow-y: auto;
  width: 95%; /* Adjust width to 95% */
  height: calc(100vh - 180rpx - var(--status-bar-height, 0rpx) - 120rpx); /* Update height calculation, subtract bottom navigation bar height */
  box-sizing: border-box;
  position: relative; /* Add relative positioning to ensure z-index works */
  z-index: 10;
}

/* Notes List Styles */
.notes-list {
  padding: 8rpx;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.note-item {
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 12rpx;
  padding: 21rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  height: 200rpx;
}

.note-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.note-icon {
  width: 133rpx; /* 2/3 of 200rpx */
  height: 133rpx; /* 2/3 of 200rpx */
  margin-right: 10rpx;
  border-radius: 20rpx; /* Rounded rectangle effect */
}

.note-content {
  flex: 1;
  background-color: white;
  padding: 25rpx;
  border-radius: 12rpx;
  margin-left: 15rpx;
  height: 158rpx;
  overflow: hidden;
}

.note-date-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.note-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-preview {
  font-size: 28rpx;
  color: #666;
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
}

.note-actions {
  display: flex;
  gap: 20rpx;
}

/* Empty State Styles */
.empty-state-container {
  position: relative;
  margin-top: 70rpx;
  margin-right: 40rpx;
  margin-bottom: 40rpx;
  margin-left: 40rpx;
  padding: 0;
  width: calc(100% - 80rpx);
  height: fit-content;
}

/* Gray Semi-transparent Overlay */
.empty-state-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(212, 212, 212, 0.5);
  border-radius: 20rpx;
  z-index: 1;
}

/* Empty State Styles */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  margin: 0;
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.empty-state > * {
  position: relative;
  z-index: 1;
}

.empty-logo {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
}

/* Bottom Navigation Bar */
.tab-item {
  flex: 1;
  text-align: center;
  padding: 10rpx 0;
  color: #333;
}

.tab-item.active {
  color: #228822;
}

.tab-text {
  font-size: 28rpx;
}

.add-btn {
  position: fixed;
  left: 50%;
  bottom: 200rpx;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #2222ee;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  border: none;
  z-index: 998;
}

.add-icon-text {
  font-size: 80rpx;
  color: #fff;
  font-weight: bold;
  line-height: 120rpx;
}

/* Header Styles - Fixed at the top */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #333;
  background-color: #66aa66;
  z-index: 100;
}

/* Header Content Container - Vertically arranged */
.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #eeeeee;
  background-color: #66aa66;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
}

.note-count {
  font-size: 32rpx;
  color: #eeeeee;
  background-color: #66aa66;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  margin-top: 8rpx;
}

.menu-btn {
  background-color: transparent;
  padding: 10rpx;
  margin: 0;
  margin-left: auto;
  height: 80rpx;
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  color: #228822;
}

/* Popup Menu Styles */
.popup-menu {
  position: fixed;
  top: 0;
  right: 0;
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
  top: 100rpx;
  right: 0;
  width: 55%;
  min-width: 320rpx;
  background-color: white;
  border-radius: 16rpx 0 0 16rpx;
  box-shadow: -4rpx 0 20rpx rgba(0, 0, 0, 0.2);
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

/* Bottom Navigation Area Styles */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
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
