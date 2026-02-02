# READ_MEDIA_VIDEO 权限使用说明

## 权限用途
EasNote 应用声明了 `READ_MEDIA_VIDEO` 权限，用于未来从用户设备的相册中选择视频并添加到笔记中的功能扩展。

## 具体使用场景
目前，EasNote 应用尚未实现视频相关功能，因此 `READ_MEDIA_VIDEO` 权限在当前版本中并未被实际使用。

## 权限使用范围
- 当未来实现视频功能时，此权限仅用于访问用户明确选择的视频文件
- 不会自动扫描或访问设备上的所有视频
- 不会上传或分享用户的视频数据（除非用户明确选择分享包含视频的笔记）

## 权限获取方式
目前，由于应用未实现视频功能，因此不会请求此权限。
当未来实现视频功能时，应用将在用户首次尝试选择视频时动态请求此权限。

## 数据处理
目前，由于应用未实现视频功能，因此不会处理任何视频数据。
当未来实现视频功能时：
- 选择的视频会被保存到应用的专用存储空间中
- 视频文件仅与创建它们的笔记关联
- 用户可以随时删除笔记及其关联的视频文件

## 权限替代方案
目前无替代方案，因为应用尚未实现视频功能。

# READ_MEDIA_VIDEO Permission Usage

## Permission Purpose
EasNote app declares the `READ_MEDIA_VIDEO` permission for future functionality expansion to select videos from the user's device gallery and add them to notes.

## Specific Usage Scenarios
Currently, EasNote app has not implemented video-related functionality, so the `READ_MEDIA_VIDEO` permission is not actually used in the current version.

## Permission Scope
- When video functionality is implemented in the future, this permission will only be used to access videos explicitly selected by the user
- It will not automatically scan or access all videos on the device
- It will not upload or share the user's video data (unless the user explicitly chooses to share a note containing videos)

## Permission Acquisition
Currently, since the app does not implement video functionality, this permission will not be requested.
When video functionality is implemented in the future, the app will dynamically request this permission when the user first attempts to select videos.

## Data Processing
Currently, since the app does not implement video functionality, no video data is processed.
When video functionality is implemented in the future:
- Selected videos will be saved to the app's private storage space
- Video files will only be associated with the notes that create them
- Users can delete notes and their associated video files at any time

## Permission Alternatives
No alternatives currently exist as the app has not implemented video functionality.