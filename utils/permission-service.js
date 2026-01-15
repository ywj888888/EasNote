/**
 * Permission Service Module
 * Responsible for handling application permission checking and requesting
 */

/**
 * Check permission status
 * @returns {Promise<Object>} Permission status object
 */
export async function checkPermissions() {
  try {
    // Check storage permission
    const storagePermission = await checkStoragePermission();
    
    // Check camera permission
    const cameraPermission = await checkCameraPermission();
    
    // Check network permission
    const networkPermission = await checkNetworkPermission();
    
    // Check album permission
    const albumPermission = await checkAlbumPermission();
    
    return {
      storage: storagePermission,
      camera: cameraPermission,
      network: networkPermission,
      album: albumPermission,
      allGranted: storagePermission && cameraPermission && networkPermission && albumPermission
    };
  } catch (error) {
    console.error('Failed to check permissions:', error);
    return {
      storage: false,
      camera: false,
      network: false,
      album: false,
      allGranted: false
    };
  }
}

/**
 * Request permission
 * @param {Array} permissions - List of permissions to request ['storage', 'camera', 'network', 'album']
 * @returns {Promise<Object>} Request results
 */
export async function requestPermissions(permissions = ['storage', 'camera', 'network']) {
  const results = {};
  
  try {
    // Process based on required permission types
    if (permissions.includes('storage')) {
      results.storage = await requestStoragePermission();
    }
    
    if (permissions.includes('camera')) {
      results.camera = await requestCameraPermission();
    }
    
    if (permissions.includes('network')) {
      results.network = await requestNetworkPermission();
    }
    
    if (permissions.includes('album')) {
      results.album = await requestAlbumPermission();
    }
    
    // Check if all requested permissions are granted
    results.allGranted = permissions.every(perm => results[perm]);
    
    return results;
  } catch (error) {
    console.error('Failed to request permissions:', error);
    permissions.forEach(perm => {
      results[perm] = false;
    });
    results.allGranted = false;
    return results;
  }
}

/**
 * Check storage permission
 * @private
 * @returns {Promise<boolean>} Whether permission is granted
 */
async function checkStoragePermission() {
  try {
    // In uni-app, storage permission is usually granted by default
    // We can verify by attempting to read/write storage
    const testKey = 'permission_test';
    uni.setStorageSync(testKey, 'test');
    uni.removeStorageSync(testKey);
    return true;
  } catch (error) {
    console.error('Storage permission check failed:', error);
    return false;
  }
}

/**
 * Check camera permission
 * @private
 * @returns {Promise<boolean>} Whether permission is granted
 */
async function checkCameraPermission() {
  try {
    // Check if uni.getSetting exists
    if (typeof uni.getSetting !== 'function') {
      // In unsupported environments, return true by default to indicate permission is available
      return true;
    }
    
    // Call uni-app API to check camera permission
    const { authSetting } = await uni.getSetting();
    return authSetting['scope.camera'] === true;
  } catch (error) {
    console.error('Camera permission check failed:', error);
    return false;
  }
}

/**
 * Check network permission
 * @private
 * @returns {Promise<boolean>} Whether permission is granted
 */
async function checkNetworkPermission() {
  try {
    // Check network connection status
    const networkType = await getNetworkType();
    return networkType !== 'none';
  } catch (error) {
    console.error('Network permission check failed:', error);
    return false;
  }
}

/**
 * Request storage permission
 * @private
 * @returns {Promise<boolean>} Whether request succeeded
 */
async function requestStoragePermission() {
  try {
    // Storage permission is usually granted by default
    // We can verify by trying to read/write storage
    return await checkStoragePermission();
  } catch (error) {
    console.error('Storage permission request failed:', error);
    return false;
  }
}

/**
 * Request camera permission
 * @private
 * @returns {Promise<boolean>} Whether request succeeded
 */
async function requestCameraPermission() {
  try {
    // Check if uni.getSetting exists
    if (typeof uni.getSetting !== 'function' || typeof uni.authorize !== 'function') {
      // In unsupported environments, return true by default to indicate permission is available
      return true;
    }
    
    // Call uni-app API to request camera permission
    const { authSetting } = await uni.getSetting();
    
    // If not yet authorized, request permission
    if (authSetting['scope.camera'] !== true) {
      const { authSetting: newAuthSetting } = await uni.authorize({
        scope: 'scope.camera'
      });
      return newAuthSetting['scope.camera'] === true;
    }
    
    return true;
  } catch (error) {
    console.error('Camera permission request failed:', error);
    return false;
  }
}

/**
 * Request network permission
 * @private
 * @returns {Promise<boolean>} Whether request succeeded
 */
async function requestNetworkPermission() {
  try {
    // Check network connection status
    return await checkNetworkPermission();
  } catch (error) {
    console.error('Network permission request failed:', error);
    return false;
  }
}

/**
 * Get network type
 * @private
 * @returns {Promise<string>} Network type
 */
function getNetworkType() {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
      success: (res) => {
        resolve(res.networkType);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Check album permission
 * @private
 * @returns {Promise<boolean>} Whether permission is granted
 */
async function checkAlbumPermission() {
  try {
    // Check if uni.getSetting exists
    if (typeof uni.getSetting !== 'function') {
      // In unsupported environments, return true by default to indicate permission is available
      return true;
    }
    
    // Call uni-app API to check album permission
    const { authSetting } = await uni.getSetting();
    // scope.writePhotosAlbum is for writing to album, scope.camera is usually also used for reading from album
    return authSetting['scope.writePhotosAlbum'] === true || authSetting['scope.camera'] === true;
  } catch (error) {
    console.error('Album permission check failed:', error);
    return false;
  }
}

/**
 * Request album permission
 * @private
 * @returns {Promise<boolean>} Whether request succeeded
 */
async function requestAlbumPermission() {
  try {
    // Check if uni.getSetting exists
    if (typeof uni.getSetting !== 'function' || typeof uni.authorize !== 'function') {
      // In unsupported environments, return true by default to indicate permission is available
      return true;
    }
    
    // Call uni-app API to request album permission
    const { authSetting } = await uni.getSetting();
    
    // If not yet authorized, request permission
    if (authSetting['scope.writePhotosAlbum'] !== true) {
      try {
        const { authSetting: newAuthSetting } = await uni.authorize({
          scope: 'scope.writePhotosAlbum'
        });
        return newAuthSetting['scope.writePhotosAlbum'] === true;
      } catch (error) {
        console.log('Write to album permission request failed, trying to check camera permission');
        // If write permission failed, check camera permission
            if (authSetting['scope.camera'] !== true) {
              try {
                const { authSetting: newAuthSetting } = await uni.authorize({
                  scope: 'scope.camera'
                });
                return newAuthSetting['scope.camera'] === true;
              } catch (error) {
                console.error('Camera permission request also failed:', error);
                return false;
          }
        }
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Album permission request failed:', error);
    return false;
  }
}