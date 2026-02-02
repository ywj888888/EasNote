if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0$4 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$7 = {
    data() {
      return {
        loadingTimer: null
        // Loading completion timer
      };
    },
    onLoad() {
      this.startLoadingAnimation();
    },
    onShow() {
    },
    onHide() {
    },
    onUnload() {
      this.clearLoadingTimer();
    },
    methods: {
      // Start loading animation
      startLoadingAnimation() {
        this.loadingTimer = setTimeout(() => {
          this.navigateToApp();
        }, 2e3);
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
        const isFirstLaunch = !uni.getStorageSync("hasLaunched");
        if (isFirstLaunch) {
          uni.navigateTo({
            url: `/pages/permission/permission?isFirstLaunch=${isFirstLaunch}`
          });
        } else {
          uni.navigateTo({
            url: "/pages/index/index"
          });
        }
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "welcome-container" }, [
      vue.createElementVNode("view", { class: "content-section" }, [
        vue.createElementVNode("image", {
          class: "app-logo",
          src: _imports_0$4,
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "app-name" }, "EasNote"),
        vue.createElementVNode("text", { class: "version-info" }, "Version 1.0.0")
      ]),
      vue.createElementVNode("view", { class: "loading-section" }, [
        vue.createElementVNode("view", { class: "dot-container" }, [
          vue.createElementVNode("view", { class: "dot dot1" }),
          vue.createElementVNode("view", { class: "dot dot2" }),
          vue.createElementVNode("view", { class: "dot dot3" })
        ]),
        vue.createElementVNode("text", { class: "loading-text" }, "Starting...")
      ])
    ]);
  }
  const PagesWelcomeWelcome = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-085f0530"], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/welcome/welcome.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const NOTE_STORAGE_KEY = "easy_note_data";
  const RECYCLE_BIN_KEY = "easy_note_recycle_bin";
  const SECRET_KEY = "easynote_secure_key_2023";
  function encrypt(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(unescape(encodeURIComponent(result)));
  }
  function decrypt(encryptedText) {
    try {
      const text = decodeURIComponent(escape(atob(encryptedText)));
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:45", "Decryption failed:", error);
      return "";
    }
  }
  function getRecycleBinNotes() {
    try {
      const encryptedNotesStr = uni.getStorageSync(RECYCLE_BIN_KEY);
      if (!encryptedNotesStr)
        return [];
      const notesStr = decrypt(encryptedNotesStr);
      return notesStr ? JSON.parse(notesStr) : [];
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:62", "Failed to get recycle bin notes:", error);
      return [];
    }
  }
  function getAllNotes() {
    try {
      const encryptedNotesStr = uni.getStorageSync(NOTE_STORAGE_KEY);
      if (!encryptedNotesStr)
        return [];
      const notesStr = decrypt(encryptedNotesStr);
      return notesStr ? JSON.parse(notesStr) : [];
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:79", "Failed to get notes list:", error);
      return [];
    }
  }
  function getNoteById(id) {
    try {
      const notes = getAllNotes();
      return notes.find((note) => note.id === id) || null;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:94", "Failed to get note by ID:", error);
      return null;
    }
  }
  function saveNote(note) {
    try {
      const notes = getAllNotes();
      const MAX_IMAGES = 30;
      if (note.images && Array.isArray(note.images)) {
        if (note.images.length > MAX_IMAGES) {
          formatAppLog("warn", "at utils/note-service.js:113", `Note image count exceeds limit (${MAX_IMAGES} images), automatically truncated`, {
            noteId: note.id,
            originalCount: note.images.length,
            truncatedCount: MAX_IMAGES
          });
          note.images = note.images.slice(0, MAX_IMAGES);
        }
      } else {
        note.images = [];
      }
      const existingIndex = notes.findIndex((item) => item.id === note.id);
      if (existingIndex >= 0) {
        notes[existingIndex] = {
          ...notes[existingIndex],
          ...note,
          updateTime: Date.now()
        };
      } else {
        notes.push({
          ...note,
          id: Date.now().toString(),
          createTime: Date.now(),
          updateTime: Date.now()
        });
      }
      const encryptedNotes = encrypt(JSON.stringify(notes));
      uni.setStorageSync(NOTE_STORAGE_KEY, encryptedNotes);
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:149", "Failed to save note:", error);
      return false;
    }
  }
  function deleteNote(id) {
    try {
      let notes = getAllNotes();
      const noteIndex = notes.findIndex((note) => note.id === id);
      if (noteIndex === -1) {
        return false;
      }
      const deletedNote = notes[noteIndex];
      deletedNote.deleteTime = Date.now();
      notes.splice(noteIndex, 1);
      const encryptedNotes = encrypt(JSON.stringify(notes));
      uni.setStorageSync(NOTE_STORAGE_KEY, encryptedNotes);
      const recycleBinNotes = getRecycleBinNotes();
      recycleBinNotes.push(deletedNote);
      const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
      uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:187", "Failed to delete note:", error);
      return false;
    }
  }
  function restoreNoteFromRecycleBin(id) {
    try {
      let recycleBinNotes = getRecycleBinNotes();
      const noteIndex = recycleBinNotes.findIndex((note) => note.id === id);
      if (noteIndex === -1) {
        return false;
      }
      const restoredNote = recycleBinNotes[noteIndex];
      delete restoredNote.deleteTime;
      restoredNote.updateTime = Date.now();
      recycleBinNotes.splice(noteIndex, 1);
      const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
      uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
      const notes = getAllNotes();
      const existingIndex = notes.findIndex((note) => note.id === restoredNote.id);
      if (existingIndex === -1) {
        notes.push(restoredNote);
      } else {
        notes[existingIndex] = restoredNote;
      }
      const encryptedNotes = encrypt(JSON.stringify(notes));
      uni.setStorageSync(NOTE_STORAGE_KEY, encryptedNotes);
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:235", "Failed to restore note:", error);
      return false;
    }
  }
  function permanentlyDeleteNote(id) {
    try {
      let recycleBinNotes = getRecycleBinNotes();
      const noteToDelete = recycleBinNotes.find((note) => note.id === id);
      if (noteToDelete && noteToDelete.images && Array.isArray(noteToDelete.images)) {
        noteToDelete.images.forEach((imagePath) => {
          if (imagePath && typeof imagePath === "string") {
            if (imagePath.includes("/uniapp_save/") || imagePath.includes("internal://")) {
              uni.removeSavedFile({
                filePath: imagePath,
                fail: (error) => {
                  formatAppLog("error", "at utils/note-service.js:264", "Failed to delete image file:", error);
                }
              });
            }
          }
        });
      }
      recycleBinNotes = recycleBinNotes.filter((note) => note.id !== id);
      const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
      uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/note-service.js:279", "Failed to permanently delete note:", error);
      return false;
    }
  }
  async function checkPermissions() {
    try {
      const storagePermission = await checkStoragePermission();
      const cameraPermission = await checkCameraPermission();
      const networkPermission = await checkNetworkPermission();
      const albumPermission = await checkAlbumPermission();
      return {
        storage: storagePermission,
        camera: cameraPermission,
        network: networkPermission,
        album: albumPermission,
        allGranted: storagePermission && cameraPermission && networkPermission && albumPermission
      };
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:32", "Failed to check permissions:", error);
      return {
        storage: false,
        camera: false,
        network: false,
        album: false,
        allGranted: false
      };
    }
  }
  async function requestPermissions(permissions = ["storage", "camera", "network"]) {
    const results = {};
    try {
      if (permissions.includes("storage")) {
        results.storage = await requestStoragePermission();
      }
      if (permissions.includes("camera")) {
        results.camera = await requestCameraPermission();
      }
      if (permissions.includes("network")) {
        results.network = await requestNetworkPermission();
      }
      if (permissions.includes("album")) {
        results.album = await requestAlbumPermission();
      }
      results.allGranted = permissions.every((perm) => results[perm]);
      return results;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:74", "Failed to request permissions:", error);
      permissions.forEach((perm) => {
        results[perm] = false;
      });
      results.allGranted = false;
      return results;
    }
  }
  async function checkStoragePermission() {
    try {
      const testKey = "permission_test";
      uni.setStorageSync(testKey, "test");
      uni.removeStorageSync(testKey);
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:97", "Storage permission check failed:", error);
      return false;
    }
  }
  async function checkCameraPermission() {
    try {
      if (typeof uni.getSetting !== "function") {
        return true;
      }
      const { authSetting } = await uni.getSetting();
      return authSetting["scope.camera"] === true;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:119", "Camera permission check failed:", error);
      return false;
    }
  }
  async function checkNetworkPermission() {
    try {
      const networkType = await getNetworkType();
      return networkType !== "none";
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:135", "Network permission check failed:", error);
      return false;
    }
  }
  async function requestStoragePermission() {
    try {
      return await checkStoragePermission();
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:151", "Storage permission request failed:", error);
      return false;
    }
  }
  async function requestCameraPermission() {
    try {
      if (typeof uni.getSetting !== "function" || typeof uni.authorize !== "function") {
        return true;
      }
      const { authSetting } = await uni.getSetting();
      if (authSetting["scope.camera"] !== true) {
        const { authSetting: newAuthSetting } = await uni.authorize({
          scope: "scope.camera"
        });
        return newAuthSetting["scope.camera"] === true;
      }
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:182", "Camera permission request failed:", error);
      return false;
    }
  }
  async function requestNetworkPermission() {
    try {
      return await checkNetworkPermission();
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:197", "Network permission request failed:", error);
      return false;
    }
  }
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
  async function checkAlbumPermission() {
    try {
      if (typeof uni.getSetting !== "function") {
        return true;
      }
      const { authSetting } = await uni.getSetting();
      return authSetting["scope.writePhotosAlbum"] === true || authSetting["scope.camera"] === true;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:238", "Album permission check failed:", error);
      return false;
    }
  }
  async function requestAlbumPermission() {
    try {
      if (typeof uni.getSetting !== "function" || typeof uni.authorize !== "function") {
        return true;
      }
      const { authSetting } = await uni.getSetting();
      if (authSetting["scope.writePhotosAlbum"] !== true) {
        try {
          const { authSetting: newAuthSetting } = await uni.authorize({
            scope: "scope.writePhotosAlbum"
          });
          return newAuthSetting["scope.writePhotosAlbum"] === true;
        } catch (error) {
          formatAppLog("log", "at utils/permission-service.js:267", "Write to album permission request failed, trying to check camera permission");
          if (authSetting["scope.camera"] !== true) {
            try {
              const { authSetting: newAuthSetting } = await uni.authorize({
                scope: "scope.camera"
              });
              return newAuthSetting["scope.camera"] === true;
            } catch (error2) {
              formatAppLog("error", "at utils/permission-service.js:276", "Camera permission request also failed:", error2);
              return false;
            }
          }
          return true;
        }
      }
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/permission-service.js:286", "Album permission request failed:", error);
      return false;
    }
  }
  function checkNetworkStatus(showToast = false) {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType === "none") {
            if (showToast) {
              uni.showToast({
                title: "Network connection error, please check network settings",
                icon: "none",
                duration: 3e3
              });
            }
            resolve(false);
          } else {
            resolve(true);
          }
        },
        fail: (error) => {
          formatAppLog("error", "at utils/network-monitor.js:31", "Network status check failed:", error);
          if (showToast) {
            uni.showToast({
              title: "Failed to check network status",
              icon: "none",
              duration: 2e3
            });
          }
          resolve(false);
        }
      });
    });
  }
  function monitorNetworkChange(callback) {
    uni.onNetworkStatusChange((res) => {
      formatAppLog("log", "at utils/network-monitor.js:51", "Network status changed:", res);
      if (callback && typeof callback === "function") {
        callback(res);
      }
      if (!res.isConnected) {
        uni.showToast({
          title: "Network connection disconnected",
          icon: "none",
          duration: 3e3
        });
      } else {
        let networkType = "";
        switch (res.networkType) {
          case "wifi":
            networkType = "WiFi";
            break;
          case "4g":
            networkType = "4G";
            break;
          case "3g":
            networkType = "3G";
            break;
          case "2g":
            networkType = "2G";
            break;
          default:
            networkType = res.networkType;
        }
        uni.showToast({
          title: `Network connected (${networkType})`,
          icon: "success",
          duration: 2e3
        });
      }
    });
  }
  const _imports_0$3 = "/static/menu.svg";
  const _imports_2$3 = "/static/device-icon.svg";
  const _imports_2$2 = "/static/network-icon.svg";
  const _imports_0$2 = "/static/empty.png";
  const _imports_1$3 = "/static/delete-white.svg";
  const _imports_5 = "/static/about-white.svg";
  const _sfc_main$6 = {
    data() {
      return {
        notes: [],
        // Notes list data
        showMenu: false,
        // Popup menu display status
        currentDate: "",
        // Current date
        statusBarHeight: 0
        // Status bar height
      };
    },
    onLoad() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight;
      this.updateCurrentDate();
      this.loadNotes();
      this.setupNetworkMonitoring();
    },
    // Reload notes list when page shows (handle edit or add scenarios)
    onShow() {
      this.updateCurrentDate();
      this.loadNotes();
      this.showMenu = false;
    },
    methods: {
      // Load notes list
      loadNotes() {
        try {
          this.notes = getAllNotes();
          this.notes.sort((a, b) => b.updateTime - a.updateTime);
        } catch (error) {
          formatAppLog("error", "at pages/index/index.vue:123", "Failed to load notes:", error);
          uni.showToast({
            title: "Failed to load notes",
            icon: "none"
          });
        }
      },
      // Format date (for UI display)
      formatDate(timestamp) {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      },
      // Page navigation methods
      addNote() {
        uni.navigateTo({ url: "/pages/note-edit/note-edit" });
      },
      editNote(id) {
        uni.navigateTo({ url: `/pages/note-edit/note-edit?id=${id}` });
      },
      // Bottom navigation bar navigation
      goToIndex() {
      },
      goToPermission() {
        uni.navigateTo({ url: "/pages/permission/permission" });
      },
      goToPrivacy() {
        uni.navigateTo({ url: "/pages/privacy/privacy" });
      },
      goToAbout() {
        uni.navigateTo({ url: "/pages/about/about" });
      },
      goToRecycleBin() {
        uni.navigateTo({ url: "/pages/recycle-bin/recycle-bin" });
      },
      // Toggle menu display status
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      // Update current date
      updateCurrentDate() {
        this.currentDate = this.formatDate((/* @__PURE__ */ new Date()).getTime());
      },
      // Set up network status monitoring
      setupNetworkMonitoring() {
        monitorNetworkChange((res) => {
          if (!res.isConnected) {
            uni.showToast({
              title: "Network disconnected, offline mode",
              icon: "none",
              duration: 3e3
            });
          } else {
            let networkType = "";
            switch (res.networkType) {
              case "wifi":
                networkType = "WiFi";
                break;
              case "4g":
                networkType = "4G";
                break;
              case "3g":
                networkType = "3G";
                break;
              case "2g":
                networkType = "2G";
                break;
              default:
                networkType = res.networkType;
            }
            uni.showToast({
              title: `Network connected (${networkType})`,
              icon: "success",
              duration: 2e3
            });
          }
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "header",
          style: vue.normalizeStyle({ "padding-top": 20 + $data.statusBarHeight * 2 + "rpx" })
        },
        [
          vue.createElementVNode("view", { class: "header-content" }, [
            vue.createElementVNode(
              "text",
              { class: "header-title" },
              "Current Date: " + vue.toDisplayString($data.currentDate),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "note-count" },
              "Notes Count: " + vue.toDisplayString($data.notes.length),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("button", {
            class: "menu-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleMenu && $options.toggleMenu(...args))
          }, [
            vue.createElementVNode("image", {
              src: _imports_0$3,
              class: "menu-icon"
            })
          ])
        ],
        4
        /* STYLE */
      ),
      $data.showMenu ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "popup-menu"
      }, [
        vue.createElementVNode("view", {
          class: "menu-backdrop",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleMenu && $options.toggleMenu(...args))
        }),
        vue.createElementVNode("view", { class: "menu-content" }, [
          vue.createElementVNode("button", {
            class: "menu-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.goToPermission && $options.goToPermission(...args))
          }, [
            vue.createElementVNode("image", {
              src: _imports_2$3,
              class: "menu-item-icon"
            }),
            vue.createElementVNode("text", { class: "menu-item-text" }, "Permission Declaration")
          ]),
          vue.createElementVNode("button", {
            class: "menu-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goToPrivacy && $options.goToPrivacy(...args))
          }, [
            vue.createElementVNode("image", {
              src: _imports_2$2,
              class: "menu-item-icon"
            }),
            vue.createElementVNode("text", { class: "menu-item-text" }, "Privacy Declaration")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "contain" }, [
        $data.notes.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "notes-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.notes, (note) => {
              var _a;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "note-item",
                key: note.id
              }, [
                vue.createElementVNode("image", {
                  src: note.images && note.images.length > 0 ? "/static/logo.png" : "/static/logo-white.png",
                  class: "note-icon"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "note-content" }, [
                  vue.createElementVNode("view", {
                    class: "note-header",
                    onClick: ($event) => $options.editNote(note.id)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "note-title" },
                      vue.toDisplayString(note.title || "Untitled Note"),
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "note-preview",
                    onClick: ($event) => $options.editNote(note.id)
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString((_a = note.content) == null ? void 0 : _a.substring(0, 50)) + "...",
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]),
                  vue.createElementVNode("view", { class: "note-date-actions" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "note-date" },
                      vue.toDisplayString($options.formatDate(note.createTime)),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state-container"
        }, [
          vue.createElementVNode("view", { class: "empty-state-overlay" }),
          vue.createElementVNode("view", { class: "empty-state" }, [
            vue.createElementVNode("image", {
              src: _imports_0$2,
              class: "empty-logo"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "No notes yet, click the button below to add")
          ])
        ]))
      ]),
      vue.createElementVNode("button", {
        class: "add-btn",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.addNote && $options.addNote(...args))
      }, [
        vue.createElementVNode("text", { class: "add-icon-text" }, "+")
      ]),
      vue.createElementVNode("view", { class: "bottom-nav" }, [
        vue.createElementVNode("button", {
          class: "nav-btn",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.goToRecycleBin && $options.goToRecycleBin(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_1$3,
            class: "nav-icon"
          }),
          vue.createElementVNode("text", { class: "nav-text" }, "Recycle Bin")
        ]),
        vue.createElementVNode("button", {
          class: "nav-btn",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.goToAbout && $options.goToAbout(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_5,
            class: "nav-icon"
          }),
          vue.createElementVNode("text", { class: "nav-text" }, "About")
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/index/index.vue"]]);
  const _imports_0$1 = "/static/add-icon-white.svg";
  const _imports_2$1 = "/static/save-white.svg";
  const _imports_2 = "/static/delete.svg";
  const _imports_4 = "/static/save-icon.svg";
  const _sfc_main$5 = {
    data() {
      return {
        noteId: null,
        noteContent: "",
        selectedImages: [],
        // Image operation menu related data
        showImageMenu: false,
        currentImageIndex: null,
        imageMenuX: 0,
        imageMenuY: 0,
        imageMenuStyle: {}
        // Image operation menu related data
      };
    },
    onLoad(options) {
      if (options && options.id) {
        this.noteId = options.id;
        this.loadNote(this.noteId);
      }
      uni.setNavigationBarTitle({
        title: this.noteId ? "Edit Note" : "New Note"
      });
    },
    methods: {
      // Load note content
      loadNote(id) {
        try {
          const note = getNoteById(id);
          if (note) {
            this.noteContent = note.content || "";
            if (note.images && Array.isArray(note.images)) {
              this.selectedImages = [...note.images];
            }
          } else {
            uni.showToast({
              title: "Note does not exist",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/note-edit/note-edit.vue:269", "Failed to load note:", error);
          uni.showToast({
            title: "Failed to load note",
            icon: "none"
          });
        }
      },
      // Save note
      saveNote() {
        const MAX_IMAGES = 30;
        if (this.selectedImages.length > MAX_IMAGES) {
          uni.showToast({
            title: "Each note can contain a maximum of 30 images. Please delete excess images before saving.",
            icon: "none",
            duration: 2e3
          });
          return;
        }
        let noteTitle = "";
        if (this.noteContent.trim()) {
          noteTitle = this.noteContent.trim().substring(0, 8);
        } else if (this.selectedImages.length > 0) {
          const now = /* @__PURE__ */ new Date();
          const timeStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
          noteTitle = `pic${timeStr}`;
        } else {
          uni.showToast({
            title: "Note content cannot be empty",
            icon: "none"
          });
          return;
        }
        const noteData = {
          id: this.noteId,
          title: noteTitle,
          content: this.noteContent.trim(),
          images: this.selectedImages
          // Add selected images
        };
        const success = saveNote(noteData);
        if (success) {
          uni.showToast({
            title: this.noteId ? "Update successful" : "Save successful",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 500);
        } else {
          uni.showToast({
            title: "Save failed",
            icon: "none"
          });
        }
      },
      // Import image from album
      async importImageFromAlbum() {
        try {
          const MAX_IMAGES = 30;
          const currentCount = this.selectedImages.length;
          if (currentCount >= MAX_IMAGES) {
            uni.showToast({
              title: "Each note can contain a maximum of 30 images",
              icon: "none"
            });
            return;
          }
          const isConnected = await checkNetworkStatus(true);
          if (!isConnected) {
            return;
          }
          const permissionResult = await requestPermissions(["album"]);
          if (!permissionResult.album) {
            uni.showToast({
              title: "Album permission is required to select images",
              icon: "none"
            });
            return;
          }
          const remainingCount = MAX_IMAGES - currentCount;
          const selectCount = Math.min(9, remainingCount);
          uni.chooseImage({
            count: selectCount,
            // Dynamically set the number of selectable images
            sizeType: ["original", "compressed"],
            // Can choose original or compressed images
            sourceType: ["album"],
            // Only select from album
            success: async (res) => {
              uni.showLoading({
                title: "Saving images..."
              });
              const savedPaths = [];
              for (const tempPath of res.tempFilePaths) {
                try {
                  const saveResult = await new Promise((resolve, reject) => {
                    uni.saveFile({
                      tempFilePath: tempPath,
                      success: resolve,
                      fail: reject
                    });
                  });
                  savedPaths.push(saveResult.savedFilePath);
                } catch (error) {
                  formatAppLog("error", "at pages/note-edit/note-edit.vue:397", "Failed to save image:", error);
                  savedPaths.push(tempPath);
                }
              }
              this.selectedImages = [...this.selectedImages, ...savedPaths];
              uni.hideLoading();
              uni.showToast({
                title: `${savedPaths.length} images selected and saved`,
                icon: "success"
              });
            },
            fail: (error) => {
              formatAppLog("error", "at pages/note-edit/note-edit.vue:416", "Failed to select images:", error);
              uni.showToast({
                title: "Failed to select images",
                icon: "none"
              });
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/note-edit/note-edit.vue:424", "Failed to import images:", error);
          uni.showToast({
            title: "Failed to import images",
            icon: "none"
          });
        }
      },
      // Remove image
      removeImage(index) {
        const imagePath = this.selectedImages[index];
        this.selectedImages.splice(index, 1);
        if (imagePath && typeof imagePath === "string") {
          if (imagePath.includes("/uniapp_save/") || imagePath.includes("internal://")) {
            uni.removeSavedFile({
              filePath: imagePath,
              fail: (error) => {
                formatAppLog("log", "at pages/note-edit/note-edit.vue:449", "Failed to delete image file:", error);
              }
            });
          }
        }
      },
      // Delete note
      deleteNote() {
        uni.showModal({
          title: "Confirm Delete",
          content: "Are you sure you want to delete this note? It can be found in the recycle bin after deletion.",
          success: (res) => {
            if (res.confirm) {
              const success = deleteNote(this.noteId);
              if (success) {
                uni.showToast({
                  title: "Moved to recycle bin",
                  icon: "success"
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 500);
              } else {
                uni.showToast({
                  title: "Delete failed",
                  icon: "none"
                });
              }
            }
          }
        });
      },
      // Show image operation menu
      showImageActionMenu(index, event) {
        this.currentImageIndex = index;
        const systemInfo = uni.getSystemInfoSync();
        const pageX = event.detail.x || event.touches[0].pageX;
        const pageY = event.detail.y || event.touches[0].pageY;
        const menuWidth = 140;
        const menuHeight = 160;
        let menuX = pageX;
        let menuY = pageY;
        if (pageX + menuWidth > systemInfo.windowWidth) {
          menuX = pageX - menuWidth;
        }
        if (pageY + menuHeight > systemInfo.windowHeight) {
          menuY = pageY - menuHeight;
        }
        this.imageMenuStyle = {
          left: menuX + "px",
          top: menuY + "px",
          position: "fixed",
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
          uni.showModal({
            title: "Confirm Delete",
            content: "Are you sure you want to delete this image?",
            success: (res) => {
              if (res.confirm) {
                this.removeImage(this.currentImageIndex);
                uni.showToast({
                  title: "Image deleted",
                  icon: "success"
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
          uni.showLoading({
            title: "Saving..."
          });
          uni.saveImageToPhotosAlbum({
            filePath: imagePath,
            success: () => {
              uni.hideLoading();
              uni.showToast({
                title: "Image saved to album",
                icon: "success"
              });
            },
            fail: (error) => {
              uni.hideLoading();
              formatAppLog("error", "at pages/note-edit/note-edit.vue:568", "Failed to save image to album:", error);
              if (error.errMsg && error.errMsg.includes("auth denied")) {
                uni.showModal({
                  title: "Insufficient permissions",
                  content: "Album permission is required to save images. Please enable it in settings.",
                  confirmText: "Go to settings",
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  }
                });
              } else {
                uni.showToast({
                  title: "Save failed",
                  icon: "none"
                });
              }
            }
          });
        }
        this.hideImageActionMenu();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "buttons-container" }, [
        vue.createElementVNode("button", {
          class: "icon-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.importImageFromAlbum && $options.importImageFromAlbum(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_0$1,
            class: "button-icon"
          })
        ]),
        $data.noteId ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "icon-button delete-icon-button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.deleteNote && $options.deleteNote(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_1$3,
            class: "button-icon"
          })
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("button", {
          class: "icon-button save-icon-button",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.saveNote && $options.saveNote(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_2$1,
            class: "button-icon"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "edit-container" }, [
        vue.withDirectives(vue.createElementVNode(
          "textarea",
          {
            class: "content-textarea",
            placeholder: "Please enter note content",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.noteContent = $event),
            maxlength: "10000",
            "show-confirm-bar": "false",
            "auto-height": "true"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.noteContent]
        ]),
        $data.selectedImages.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "image-preview-container"
        }, [
          vue.createElementVNode("view", { class: "image-count" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.selectedImages.length) + "/30 images",
              1
              /* TEXT */
            )
          ]),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.selectedImages, (image, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "image-item",
                key: index,
                onClick: ($event) => $options.showImageActionMenu(index, $event)
              }, [
                vue.createElementVNode("image", {
                  class: "preview-image",
                  src: image,
                  mode: "aspectFill",
                  "lazy-load": ""
                }, null, 8, ["src"])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      $data.showImageMenu ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "popup-menu",
          style: vue.normalizeStyle($data.imageMenuStyle)
        },
        [
          vue.createElementVNode("view", {
            class: "menu-backdrop",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.hideImageActionMenu && $options.hideImageActionMenu(...args))
          }),
          vue.createElementVNode("view", { class: "menu-content" }, [
            vue.createElementVNode("button", {
              class: "menu-item",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.handleDeleteImage && $options.handleDeleteImage(...args))
            }, [
              vue.createElementVNode("image", {
                src: _imports_2,
                class: "menu-item-icon"
              }),
              vue.createElementVNode("text", { class: "menu-item-text" }, "Delete Image")
            ]),
            vue.createElementVNode("button", {
              class: "menu-item",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleExportImage && $options.handleExportImage(...args))
            }, [
              vue.createElementVNode("image", {
                src: _imports_4,
                class: "menu-item-icon"
              }),
              vue.createElementVNode("text", { class: "menu-item-text" }, "Export Image")
            ])
          ])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesNoteEditNoteEdit = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-bebaa0fc"], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/note-edit/note-edit.vue"]]);
  const _imports_0 = "/static/data.svg";
  const _imports_1$2 = "/static/camera.svg";
  const _sfc_main$4 = {
    data() {
      return {
        isFirstLaunch: false,
        // Whether it's the first launch
        permissionsLoaded: false
        // Whether permission check is completed
      };
    },
    onLoad(options) {
      if (options.isFirstLaunch !== void 0) {
        this.isFirstLaunch = options.isFirstLaunch === "true";
      } else {
        this.isFirstLaunch = !uni.getStorageSync("hasLaunched");
      }
      setTimeout(() => {
        this.checkAllPermissions();
      }, 100);
    },
    methods: {
      // Check all permissions
      async checkAllPermissions() {
        try {
          const permissions = await checkPermissions();
          formatAppLog("log", "at pages/permission/permission.vue:77", "Permission check result:", permissions);
        } catch (error) {
          formatAppLog("error", "at pages/permission/permission.vue:79", "Failed to check permissions:", error);
        }
      },
      // Handle continue button logic (for first launch)
      handleContinue() {
        uni.setStorageSync("hasLaunched", true);
        uni.reLaunch({
          url: "/pages/index/index"
        });
      },
      // Handle back button logic (for non-first launch)
      goBack() {
        uni.navigateBack({
          delta: 1
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "permission-content" }, [
        vue.createElementVNode("view", { class: "permission-header" }, [
          vue.createElementVNode("text", { class: "header-title" }, "Application Permission Instructions"),
          vue.createElementVNode("text", { class: "header-subtitle" }, "All permissions are available by default for this application")
        ]),
        vue.createElementVNode("view", { class: "permission-item" }, [
          vue.createElementVNode("view", { class: "permission-icon" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              class: "icon-img"
            })
          ]),
          vue.createElementVNode("view", { class: "permission-info" }, [
            vue.createElementVNode("text", { class: "permission-title" }, "Storage Permission"),
            vue.createElementVNode("text", { class: "permission-desc" }, "Used to save and read your note file data locally")
          ])
        ]),
        vue.createElementVNode("view", { class: "permission-item" }, [
          vue.createElementVNode("view", { class: "permission-icon" }, [
            vue.createElementVNode("image", {
              src: _imports_1$2,
              class: "icon-img"
            })
          ]),
          vue.createElementVNode("view", { class: "permission-info" }, [
            vue.createElementVNode("text", { class: "permission-title" }, "Camera Permission"),
            vue.createElementVNode("text", { class: "permission-desc" }, "Used to add images to notes")
          ])
        ]),
        vue.createElementVNode("view", { class: "permission-item" }, [
          vue.createElementVNode("view", { class: "permission-icon" }, [
            vue.createElementVNode("image", {
              src: _imports_2$3,
              class: "icon-img"
            })
          ]),
          vue.createElementVNode("view", { class: "permission-info" }, [
            vue.createElementVNode("text", { class: "permission-title" }, "Device Information Access Permission"),
            vue.createElementVNode("text", { class: "permission-desc" }, "Used to provide better user experience and function adaptation")
          ])
        ]),
        vue.createElementVNode("view", { class: "continue-btn-container" }, [
          $data.isFirstLaunch ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "continue-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleContinue && $options.handleContinue(...args))
          }, "Get Started")) : (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: "back-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goBack && $options.goBack(...args))
          }, "Back"))
        ])
      ])
    ]);
  }
  const PagesPermissionPermission = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/permission/permission.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        // Page data
      };
    },
    onLoad() {
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "privacy-content" }, [
        vue.createElementVNode("view", { class: "privacy-notice rounded-section" }, [
          vue.createElementVNode("text", { class: "notice-title" }, "Data Storage Instructions"),
          vue.createElementVNode("text", { class: "notice-content" }, "1. All note data of this application is saved only locally on your device and will not be uploaded to any server."),
          vue.createElementVNode("text", { class: "notice-content" }, "2. We do not collect, store, or share any of your personal information."),
          vue.createElementVNode("text", { class: "notice-content" }, "3. You have complete control over the note content, and you can view, edit, or delete it at any time."),
          vue.createElementVNode("text", { class: "notice-content" }, "4. Please keep your device safe to ensure data security."),
          vue.createElementVNode("text", { class: "notice-content" }, "5. When uninstalling the application, all local data will be cleared.")
        ]),
        vue.createElementVNode("view", { class: "usage-guide rounded-section" }, [
          vue.createElementVNode("text", { class: "notice-title" }, "Application Usage Instructions"),
          vue.createElementVNode("text", { class: "notice-content" }, "1. Create a note: Click the add button at the bottom center of the home page, enter the note content, and then click save."),
          vue.createElementVNode("text", { class: "notice-content" }, "2. View notes: Click any note in the home page list to view its complete content."),
          vue.createElementVNode("text", { class: "notice-content" }, "3. Edit notes: After viewing the note details, click the note card to modify the content, and then click save. Or delete the content directly."),
          vue.createElementVNode("text", { class: "notice-content" }, "4. Restore notes: Click the note card on the recycle bin page, and select the restore button to move the note back to the home page, or permanently delete the note.")
        ])
      ])
    ]);
  }
  const PagesPrivacyPrivacy = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/privacy/privacy.vue"]]);
  const _imports_1$1 = "/static/home-white.svg";
  const _sfc_main$2 = {
    data() {
      return {
        // Page data
      };
    },
    onLoad() {
    },
    methods: {
      // Return to homepage
      goBack() {
        uni.navigateTo({
          url: "/pages/index/index"
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "about-content" }, [
        vue.createElementVNode("view", { class: "app-info" }, [
          vue.createElementVNode("image", {
            src: _imports_0$4,
            class: "app-logo"
          }),
          vue.createElementVNode("text", { class: "app-name" }, "EasNote"),
          vue.createElementVNode("text", { class: "app-version" }, "Version 1.0.0")
        ]),
        vue.createElementVNode("view", { class: "feature-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "Features"),
          vue.createElementVNode("text", { class: "feature-desc" }, "EasNote is a lightweight note-taking application that helps you record beautiful moments and important ideas in your life.")
        ]),
        vue.createElementVNode("view", { class: "contact-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "Contact Us"),
          vue.createElementVNode("view", { class: "contact-item" }, [
            vue.createElementVNode("text", { class: "contact-label" }, "Email:"),
            vue.createElementVNode("text", { class: "contact-value" }, "953617338@qq.com")
          ])
        ]),
        vue.createElementVNode("view", { class: "copyright" }, [
          vue.createElementVNode("text", { class: "copyright-text" }, "© 2025 EasNote. All rights reserved.")
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-nav" }, [
        vue.createElementVNode("button", {
          class: "nav-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_1$1,
            class: "nav-icon"
          }),
          vue.createElementVNode("text", { class: "nav-text" }, "Back to Home")
        ])
      ])
    ]);
  }
  const PagesAboutAbout = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/about/about.vue"]]);
  const _imports_1 = "/static/redo.svg";
  const _sfc_main$1 = {
    data() {
      return {
        recycleBinNotes: [],
        // Recycle bin notes list data
        showMenu: false,
        currentNoteId: null,
        menuX: 0,
        menuY: 0,
        menuStyle: {}
      };
    },
    onLoad() {
      this.loadRecycleBinNotes();
      uni.setNavigationBarTitle({
        title: "Recycle Bin"
      });
    },
    onShow() {
      this.loadRecycleBinNotes();
    },
    methods: {
      // Load recycle bin notes list
      loadRecycleBinNotes() {
        try {
          this.recycleBinNotes = getRecycleBinNotes();
          this.recycleBinNotes.sort((a, b) => b.deleteTime - a.deleteTime);
        } catch (error) {
          formatAppLog("error", "at pages/recycle-bin/recycle-bin.vue:82", "Failed to load recycle bin notes:", error);
          uni.showToast({
            title: "Failed to load recycle bin",
            icon: "none"
          });
        }
      },
      // Format date
      formatDate(timestamp) {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      },
      // Show floating menu
      showActionMenu(id, e) {
        this.currentNoteId = id;
        if (e && e.touches && e.touches[0]) {
          this.menuX = e.touches[0].clientX;
          this.menuY = e.touches[0].clientY;
        }
        const screenWidth = uni.getSystemInfoSync().windowWidth;
        const menuWidth = screenWidth * 0.55;
        let adjustedLeft = this.menuX;
        if (screenWidth - this.menuX < menuWidth) {
          adjustedLeft = screenWidth - menuWidth;
        }
        this.menuStyle = {
          position: "fixed",
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
          title: "Confirm Restore",
          content: "Are you sure you want to restore this note?",
          success: (res) => {
            if (res.confirm) {
              const success = restoreNoteFromRecycleBin(id);
              if (success) {
                this.loadRecycleBinNotes();
                uni.showToast({
                  title: "Restore successful",
                  icon: "success"
                });
              } else {
                uni.showToast({
                  title: "Restore failed",
                  icon: "none"
                });
              }
            }
          }
        });
      },
      // Permanently delete note
      permanentlyDelete(id) {
        uni.showModal({
          title: "Confirm Permanent Deletion",
          content: "This operation will permanently delete the note and cannot be recovered!",
          confirmText: "Permanently Delete",
          confirmColor: "#ff4d4f",
          success: (res) => {
            if (res.confirm) {
              const success = permanentlyDeleteNote(id);
              if (success) {
                this.loadRecycleBinNotes();
                uni.showToast({
                  title: "Permanently deleted successfully",
                  icon: "success"
                });
              } else {
                uni.showToast({
                  title: "Delete failed",
                  icon: "none"
                });
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "header-title" })
      ]),
      $data.recycleBinNotes.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "notes-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.recycleBinNotes, (note, index) => {
            var _a;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "note-item",
              key: note.id,
              onClick: ($event) => $options.showActionMenu(note.id, $event)
            }, [
              vue.createElementVNode("view", { class: "note-content" }, [
                vue.createElementVNode(
                  "text",
                  { class: "note-title" },
                  vue.toDisplayString(note.title || "Untitled Note"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "note-preview" },
                  vue.toDisplayString((_a = note.content) == null ? void 0 : _a.substring(0, 50)) + "...",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "note-date" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    "Deletion Time: " + vue.toDisplayString($options.formatDate(note.deleteTime)),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state-container"
      }, [
        vue.createElementVNode("view", { class: "empty-state-overlay" }),
        vue.createElementVNode("view", { class: "empty-state" }, [
          vue.createElementVNode("image", {
            src: _imports_0$2,
            class: "empty-logo"
          }),
          vue.createElementVNode("text", { class: "empty-text" }, "Recycle Bin is empty")
        ])
      ])),
      $data.showMenu ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 2,
          class: "popup-menu",
          style: vue.normalizeStyle($data.menuStyle)
        },
        [
          vue.createElementVNode("view", {
            class: "menu-backdrop",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.hideActionMenu && $options.hideActionMenu(...args))
          }),
          vue.createElementVNode("view", { class: "menu-content" }, [
            vue.createElementVNode("button", {
              class: "menu-item",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.handleRestore && $options.handleRestore(...args))
            }, [
              vue.createElementVNode("image", {
                src: _imports_1,
                class: "menu-item-icon"
              }),
              vue.createElementVNode("text", { class: "menu-item-text" }, "Restore Note")
            ]),
            vue.createElementVNode("button", {
              class: "menu-item",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.handlePermanentlyDelete && $options.handlePermanentlyDelete(...args))
            }, [
              vue.createElementVNode("image", {
                src: _imports_2,
                class: "menu-item-icon"
              }),
              vue.createElementVNode("text", { class: "menu-item-text" }, "Permanently Delete")
            ])
          ])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesRecycleBinRecycleBin = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-0eb78ce5"], ["__file", "C:/Users/Administrator/uniapp-pro/EasNote/pages/recycle-bin/recycle-bin.vue"]]);
  __definePage("pages/welcome/welcome", PagesWelcomeWelcome);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/note-edit/note-edit", PagesNoteEditNoteEdit);
  __definePage("pages/permission/permission", PagesPermissionPermission);
  __definePage("pages/privacy/privacy", PagesPrivacyPrivacy);
  __definePage("pages/about/about", PagesAboutAbout);
  __definePage("pages/recycle-bin/recycle-bin", PagesRecycleBinRecycleBin);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/Administrator/uniapp-pro/EasNote/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
