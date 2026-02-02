# EasNote Data Collection and Usage Description

## 1. Data Collection Overview

EasNote follows the "minimum collection" principle, collecting only data explicitly provided by users that is necessary for functionality, and conducting no unnecessary data collection.

### 1.1 Actively Provided Data

| Data Type | Collection Method | Storage Method | Purpose |
|---------|----------------|---------------|---------|
| Note content | User input | Local encrypted storage | For displaying and editing notes |
| Note images | User import from gallery | Local file system storage | For displaying images in notes |
| Operation records | User create, edit, delete notes | Local encrypted storage | For maintaining note creation time, update time, and status |

### 1.2 Automatically Collected Data

EasNote **does not automatically collect** any user data, including but not limited to:
- Location information
- Device identifiers
- Network activity
- Usage habits
- Crash logs

## 2. Data Storage and Security

### 2.1 Storage Method

- **Data Storage Location**: All user data is stored locally on the device and is not uploaded to any server
- **Storage Formats**:
  - Text data: Stored using JSON format + XOR encryption algorithm + Base64 encoding
  - Image data: Original image files stored in the device's local file system

### 2.2 Encryption Mechanism

To ensure user data security, the application employs the following encryption measures:

1. **Symmetric encryption algorithm**: Uses XOR bitwise operations combined with a custom key for data encryption
2. **Key management**: Encryption keys are built into the application code to ensure consistency for each encryption/decryption operation
3. **Base64 encoding**: Encrypted text is encoded through Base64 to ensure special characters are stored correctly
4. **Complete coverage**: All stored note data and recycle bin data are processed through encryption

### 2.3 Encryption Implementation Details

```javascript
// Encryption function example
function encrypt(text) {
  let result = '';
  const SECRET_KEY = 'easynote_secure_key_2023';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(unescape(encodeURIComponent(result)));
}

// Decryption function example
function decrypt(encryptedText) {
  try {
    const text = decodeURIComponent(escape(atob(encryptedText)));
    let result = '';
    const SECRET_KEY = 'easynote_secure_key_2023';
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
```

## 3. Data Usage Purpose

User-provided data is used only for the following purposes:

1. **Note function implementation**: Storing and displaying user-created note content
2. **User experience optimization**: Maintaining note creation time, update time, and other metadata
3. **Data management**: Supporting note editing, deletion, recovery, and other operations

## 4. Data Sharing and Disclosure

EasNote **does not share or disclose** any user data:

- No data sharing with third-party services
- No data transmission to developers
- No use for advertising or marketing purposes
- No data analysis or statistics

## 5. User Rights

As an application user, you have the following rights:

1. **Complete control**: You can view, edit, delete, or recover your notes at any time
2. **Data deletion right**: You can permanently delete any note data
3. **Privacy protection**: Your data will never be accessed by application developers or third parties
4. **Data migration**: You can migrate application data by backing up device data

## 6. Data Retention Period

- Normal notes: Retained indefinitely until actively deleted by the user
- Recycle bin notes: Retained indefinitely until actively recovered or permanently deleted by the user
- Permanent deletion: Data will be immediately removed from the device

## 7. Privacy Policy Updates

This data collection and usage description may be updated based on changes to application functions. Updated descriptions will be published within the application and take effect from the publication date.

## 8. Contact Information

If you have any questions or suggestions about the application's data processing, please contact us through the following methods:
- Email: thuy4yr5nuong9vg88f@gmail.com

---

**Effective Date**: January 5, 2026
**Version**: 1.0