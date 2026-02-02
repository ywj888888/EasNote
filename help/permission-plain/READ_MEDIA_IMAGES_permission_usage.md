# READ_MEDIA_IMAGES 权限使用说明

## 权限用途
EasNote 应用使用 `READ_MEDIA_IMAGES` 权限来从用户设备的相册中选择图片并添加到笔记中。

## 具体使用场景
1. **图片选择功能**：当用户在笔记编辑页面点击"添加图片"按钮时，应用会请求此权限以访问设备相册
2. **图片预览功能**：用户可以在笔记中查看已添加的图片
3. **图片管理功能**：用户可以删除笔记中的图片或导出图片到设备相册

## 权限使用范围
- 仅用于访问用户明确选择的图片文件
- 不会自动扫描或访问设备上的所有图片
- 不会上传或分享用户的图片数据（除非用户明确选择分享包含图片的笔记）

## 权限获取方式
- 应用在用户首次尝试选择图片时动态请求此权限
- 用户可以在设备设置中随时查看或撤销此权限

## 数据处理
- 选择的图片会被保存到应用的专用存储空间中
- 图片文件仅与创建它们的笔记关联
- 用户可以随时删除笔记及其关联的图片文件

## 权限替代方案
- 应用提供了使用相机直接拍摄图片的替代方案，该功能使用 `CAMERA` 权限而非 `READ_MEDIA_IMAGES` 权限

# READ_MEDIA_IMAGES Permission Usage

## Permission Purpose
EasNote app uses the `READ_MEDIA_IMAGES` permission to select images from the user's device gallery and add them to notes.

## Specific Usage Scenarios
1. **Image Selection**：When users click the "Add Image" button in the note editing page, the app requests this permission to access the device gallery
2. **Image Preview**：Users can view images already added to their notes
3. **Image Management**：Users can delete images from notes or export images to the device gallery

## Permission Scope
- Only used to access images explicitly selected by the user
- Does not automatically scan or access all images on the device
- Does not upload or share user's image data (unless the user explicitly chooses to share a note containing images)

## Permission Acquisition
- The app dynamically requests this permission when the user first attempts to select images
- Users can view or revoke this permission at any time in device settings

## Data Processing
- Selected images are saved to the app's private storage space
- Image files are only associated with the notes that create them
- Users can delete notes and their associated image files at any time

## Permission Alternatives
- The app provides an alternative to take pictures directly using the camera, which uses the `CAMERA` permission instead of the `READ_MEDIA_IMAGES` permission