/**
 * Note Service Module
 * Responsible for handling note storage, reading, updating and deletion operations
 */
const NOTE_STORAGE_KEY = 'easy_note_data';
const RECYCLE_BIN_KEY = 'easy_note_recycle_bin';

/**
 * Data Encryption and Decryption Tools
 * Uses simple symmetric encryption algorithm to protect user data
 */
const SECRET_KEY = 'easynote_secure_key_2023'; // Encryption key

/**
 * Simple symmetric encryption function
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text
 */
function encrypt(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(charCode);
  }
  // Convert to Base64 to ensure proper storage of special characters
  return btoa(unescape(encodeURIComponent(result)));
}

/**
 * Simple symmetric decryption function
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} Decrypted text
 */
function decrypt(encryptedText) {
  try {
    // Convert from Base64 back to original encrypted text
    const text = decodeURIComponent(escape(atob(encryptedText)));
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Get all notes in recycle bin
 * @returns {Array} List of notes in recycle bin
 */
export function getRecycleBinNotes() {
  try {
    const encryptedNotesStr = uni.getStorageSync(RECYCLE_BIN_KEY);
    if (!encryptedNotesStr) return [];
    
    const notesStr = decrypt(encryptedNotesStr);
    return notesStr ? JSON.parse(notesStr) : [];
  } catch (error) {
    console.error('Failed to get recycle bin notes:', error);
    return [];
  }
}

/**
 * Get all notes
 * @returns {Array} List of notes
 */
export function getAllNotes() {
  try {
    const encryptedNotesStr = uni.getStorageSync(NOTE_STORAGE_KEY);
    if (!encryptedNotesStr) return [];
    
    const notesStr = decrypt(encryptedNotesStr);
    return notesStr ? JSON.parse(notesStr) : [];
  } catch (error) {
    console.error('Failed to get notes list:', error);
    return [];
  }
}

/**
 * Get note by ID
 * @param {string} id - Note ID
 * @returns {Object|null} Note object or null
 */
export function getNoteById(id) {
  try {
    const notes = getAllNotes();
    return notes.find(note => note.id === id) || null;
  } catch (error) {
    console.error('Failed to get note by ID:', error);
    return null;
  }
}

/**
 * Save note
 * @param {Object} note - Note object
 * @returns {boolean} Whether save was successful
 */
export function saveNote(note) {
  try {
    const notes = getAllNotes();
    
    // Image count safety check and limit
    const MAX_IMAGES = 30;
    if (note.images && Array.isArray(note.images)) {
      // If image count exceeds limit, truncate
      if (note.images.length > MAX_IMAGES) {
        console.warn(`Note image count exceeds limit (${MAX_IMAGES} images), automatically truncated`, {
          noteId: note.id,
          originalCount: note.images.length,
          truncatedCount: MAX_IMAGES
        });
        note.images = note.images.slice(0, MAX_IMAGES);
      }
    } else {
      // Ensure images property is an array
      note.images = [];
    }
    
    // Check if this is an update operation
    const existingIndex = notes.findIndex(item => item.id === note.id);
    
    if (existingIndex >= 0) {
      // Update existing note
      notes[existingIndex] = {
        ...notes[existingIndex],
        ...note,
        updateTime: Date.now()
      };
    } else {
      // Add new note
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
      console.error('Failed to save note:', error);
      return false;
    }
}

/**
 * Delete note (move to recycle bin)
 * @param {string} id - Note ID
 * @returns {boolean} Whether deletion was successful
 */
export function deleteNote(id) {
  try {
    // Get all notes
    let notes = getAllNotes();
    // Find the note to delete
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      return false;
    }
    
    // Get the note to delete
    const deletedNote = notes[noteIndex];
    // Add deletion time
    deletedNote.deleteTime = Date.now();
    
    // Remove from notes list
    notes.splice(noteIndex, 1);
    const encryptedNotes = encrypt(JSON.stringify(notes));
    uni.setStorageSync(NOTE_STORAGE_KEY, encryptedNotes);
    
    // Add to recycle bin
    const recycleBinNotes = getRecycleBinNotes();
    recycleBinNotes.push(deletedNote);
    const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
    uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
    return true;
  } catch (error) {
    console.error('Failed to delete note:', error);
    return false;
  }
}

/**
 * Restore note from recycle bin
 * @param {string} id - Note ID
 * @returns {boolean} Whether restoration was successful
 */
export function restoreNoteFromRecycleBin(id) {
  try {
    // Get notes from recycle bin
    let recycleBinNotes = getRecycleBinNotes();
    // Find the note to restore
    const noteIndex = recycleBinNotes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      return false;
    }
    
    // Get the note to restore
    const restoredNote = recycleBinNotes[noteIndex];
    // Remove deletion time mark
    delete restoredNote.deleteTime;
    // Update restore time as update time
    restoredNote.updateTime = Date.now();
    
    // Remove from recycle bin
    recycleBinNotes.splice(noteIndex, 1);
    const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
    uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
    
    // Add back to notes list
    const notes = getAllNotes();
    // Check if note with same ID already exists (to avoid conflicts)
    const existingIndex = notes.findIndex(note => note.id === restoredNote.id);
    if (existingIndex === -1) {
      notes.push(restoredNote);
    } else {
      // If exists, update note
      notes[existingIndex] = restoredNote;
    }
    const encryptedNotes = encrypt(JSON.stringify(notes));
    uni.setStorageSync(NOTE_STORAGE_KEY, encryptedNotes);
    
    return true;
  } catch (error) {
    console.error('Failed to restore note:', error);
    return false;
  }
}

/**
 * Permanently delete note from recycle bin
 * @param {string} id - Note ID
 * @returns {boolean} Whether deletion was successful
 */
export function permanentlyDeleteNote(id) {
  try {
    // Get notes from recycle bin
    let recycleBinNotes = getRecycleBinNotes();
    
    // Find the note to permanently delete to extract image information
    const noteToDelete = recycleBinNotes.find(note => note.id === id);
    
    // If note exists and contains images, try to delete image files
    if (noteToDelete && noteToDelete.images && Array.isArray(noteToDelete.images)) {
      // Delete image files one by one
      noteToDelete.images.forEach(imagePath => {
        if (imagePath && typeof imagePath === 'string') {
          // Check if it might be a persistently saved file path
          if (imagePath.includes('/uniapp_save/') || imagePath.includes('internal://')) {
            uni.removeSavedFile({
              filePath: imagePath,
              fail: (error) => {
                // Deletion failure does not affect overall process, only record error log
                console.error('Failed to delete image file:', error);
              }
            });
          }
        }
      });
    }
    
    // Filter out the note to be permanently deleted
    recycleBinNotes = recycleBinNotes.filter(note => note.id !== id);
    const encryptedRecycleBin = encrypt(JSON.stringify(recycleBinNotes));
    uni.setStorageSync(RECYCLE_BIN_KEY, encryptedRecycleBin);
    
    return true;
  } catch (error) {
    console.error('Failed to permanently delete note:', error);
    return false;
  }
}