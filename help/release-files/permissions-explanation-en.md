# EasNote Permission Usage Explanation

This document details the permissions requested by the EasNote application and their purposes, ensuring users understand how the application uses these permissions to provide services.

## Retained Necessary Permissions

### 1. Media Access Permissions (Android 13+)
- **Permission Names**:
  - `READ_MEDIA_IMAGES` (Read Media Images)
  - `READ_MEDIA_VIDEO` (Read Media Video)
- **Purposes**:
  - Select images from device gallery to add to notes
  - Future version support for selecting videos from device gallery to add to notes
  - Only access media files explicitly selected by the user
- **Necessity**:
  - Important feature to enhance user experience and enrich note content
  - Recommended granular media permissions for Android 13+

### 2. Camera Permissions
- **Permission Names**:
  - `CAMERA` (Camera)
  - `android.hardware.camera` (Camera hardware support)
  - `android.hardware.camera.autofocus` (Camera autofocus)
- **Purposes**:
  - Allow users to directly take photos and insert them into notes
  - Provide photo autofocus functionality to ensure clear images
- **Necessity**:
  - Important feature to enhance user experience and enrich note content
  - Only accessed when users actively use the camera function

### 3. Flashlight Permission
- **Permission Name**:
  - `FLASHLIGHT` (Flashlight)
- **Purpose**:
  - Provide lighting in low-light environments when using the camera
  - Ensure captured images are clearly visible in dark environments
- **Necessity**:
  - Auxiliary permission for camera functionality to improve shooting experience
  - Only activated when users use the camera and turn on the flashlight

### 4. Network Status Permissions
- **Permission Names**:
  - `ACCESS_NETWORK_STATE` (Access network state)
  - `ACCESS_WIFI_STATE` (Access WiFi state)
- **Purposes**:
  - Detect device network connection status
  - Provide data support for network monitoring functionality
  - Optimize application performance based on network status
- **Necessity**:
  - Used for network monitoring functionality to help users understand device network conditions
  - Not used for sending or receiving user data, only for status detection

## Removed Unnecessary Permissions

The following permissions have been removed from the application as they are not related to EasNote's core functionality:

- `CHANGE_NETWORK_STATE` (Modify network state)
- `MOUNT_UNMOUNT_FILESYSTEMS` (Mount/unmount filesystems)
- `VIBRATE` (Vibration)
- `READ_LOGS` (Read system logs)
- `GET_ACCOUNTS` (Get account information)
- `READ_PHONE_STATE` (Read phone state)
- `CHANGE_WIFI_STATE` (Modify WiFi state)
- `WAKE_LOCK` (Wake lock)
- `WRITE_SETTINGS` (Modify system settings)

## Permission Usage Principles

EasNote follows the following permission usage principles:

1. **Minimum Permission Principle**: Only request permissions necessary to implement core functionality
2. **Transparent Usage**: Clearly inform users of the specific purpose of each permission
3. **User Control**: Allow users to manage and revoke permissions in system settings
4. **Secure Usage**: Not using permissions for non-declared purposes or sharing with third parties

## Update Notes

This permission explanation document will be adjusted in a timely manner as the application's functionality is updated. If the application adds new features that require additional permissions, we will clearly inform users of the purpose of the new permissions during the update.

---

EasNote Team © 2026 All Rights Reserved