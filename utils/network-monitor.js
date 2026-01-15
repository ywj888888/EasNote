/**
 * Network Status Monitoring and Exception Handling Tool
 * @description Used to monitor network status and provide appropriate prompts to users when network anomalies occur
 */

/**
 * Check network status and show notification
 * @param {boolean} showToast - Whether to show toast notification, default false
 * @returns {Promise<boolean>} Whether network is available
 */
export function checkNetworkStatus(showToast = false) {
  return new Promise((resolve) => {
    uni.getNetworkType({
      success: (res) => {
        if (res.networkType === 'none') {
            // Network unavailable
          if (showToast) {
            uni.showToast({
              title: 'Network connection error, please check network settings',
              icon: 'none',
              duration: 3000
            });
          }
          resolve(false);
        } else {
            // Network available
          resolve(true);
        }
      },
      fail: (error) => {
        console.error('Network status check failed:', error);
        if (showToast) {
          uni.showToast({
            title: 'Failed to check network status',
            icon: 'none',
            duration: 2000
          });
        }
        resolve(false);
      }
    });
  });
}

/**
 * Listen for network status changes
 * @param {Function} callback - Network status change callback function
 */
export function monitorNetworkChange(callback) {
  uni.onNetworkStatusChange((res) => {
    console.log('Network status changed:', res);
    
    // Call callback function
    if (callback && typeof callback === 'function') {
      callback(res);
    }
    
    // Show different notifications based on network status
    if (!res.isConnected) {
      uni.showToast({
        title: 'Network connection disconnected',
        icon: 'none',
        duration: 3000
      });
    } else {
      // Show different connection status based on network type
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

/**
 * Check network status before executing network-dependent operations
 * @param {Function} operation - Network-dependent operation function
 * @param {string} operationName - Operation name for error notification
 * @returns {Promise} Operation result
 */
export async function executeWithNetworkCheck(operation, operationName = 'operation') {
  // First check network status
  const isConnected = await checkNetworkStatus(false);
  
  if (!isConnected) {
    uni.showModal({
      title: 'Network Error',
      content: `${operationName} requires network connection, please check your network settings`,
      showCancel: false,
      confirmText: 'Got it'
    });
    return Promise.reject(new Error('Network anomaly'));
  }
  
  try {
    return await operation();
  } catch (error) {
    // If operation fails, check network status again
    const stillConnected = await checkNetworkStatus(false);
    if (!stillConnected) {
      uni.showToast({
        title: 'Network connection error, please check network settings',
        icon: 'none',
        duration: 3000
      });
    }
    throw error;
  }
}