# 图标配置指南（Google Play发布）

## 1. 当前图标配置现状

manifest.json文件中已配置了以下Android图标：
- hdpi: 72x72px (logo_72x72.png)
- mdpi: 48x48px (logo_48x48.png)
- xhdpi: 96x96px (logo_96x96.png)
- xxhdpi: 144x144px (logo_144x144.png)
- xxxhdpi: 192x192px (logo_192x192.png)

同时也包含了iOS图标配置：
- icon: 48x48px (logo_48x48.png)
- ipad: 72x72px (logo_72x72.png)
- ipad_2x: 144x144px (logo_144x144.png)
- appstore: logo.png

## 2. iOS图标配置的必要性

### 2.1 仅在Google Play发布时

**如果您只计划在Google Play发布Android版本的应用**：
- iOS图标配置**不是必需的**
- uni-app框架会自动忽略不相关平台的配置
- 保留iOS配置不会影响Android版本的编译和发布

### 2.2 建议处理方式

尽管不是必需的，但建议采取以下处理方式：
1. **保留现有iOS配置**：这样如果未来需要发布iOS版本，可以快速启用
2. **不需要添加额外iOS图标**：仅保留基本配置即可
3. **不需要准备iOS专用图标**：当前使用的与Android共享的图标可以继续使用

## 3. Google Play图标要求

### 3.1 必需图标尺寸

| 尺寸 | 用途 | 要求 |
|------|------|------|
| 512x512px | Google Play商店列表图标 | 必须使用PNG格式，32位，文件大小上限1024KB |

### 3.2 推荐图片（功能图形）

| 尺寸 | 用途 | 要求 |
|------|------|------|
| 1024x500px | Google Play商店特色图片 | JPEG或24位PNG格式，用于在应用商店页面顶部展示 |

### 3.2 配置方法

已在manifest.json的`app-plus.distribute.icons.android`节点中添加了以下配置：
```json
"512x512" : "./static/logo_512x512.png"
```

## 4. 图标准备建议

### 4.1 创建图标文件

请在`static`目录下创建以下图标文件：
1. `logo_512x512.png` (512x512px) - 必需

### 4.2 可选的功能图形

如果您想在Google Play商店页面顶部展示特色图片，建议创建：
1. `feature_graphic_1024x500.png` (1024x500px) - 可选但推荐

### 4.2 图标设计要求

- **格式**：PNG格式（不支持JPG或SVG）
- **背景**：透明背景（推荐）
- **圆角**：不需要添加圆角，Google Play会自动添加
- **分辨率**：确保高分辨率，避免模糊
- **内容**：居中显示，避免边缘裁剪

### 4.3 使用现有图标缩放建议

可以使用static目录中的现有logo.png或logo_192x192.png文件进行缩放，但注意：
- 放大时可能会导致画质下降
- 建议从高质量源文件创建
- 确保放大后的图标清晰、无锯齿

## 5. 注意事项

1. **图标尺寸**：严格按照要求的尺寸创建，不要使用错误尺寸
2. **文件命名**：确保文件名与manifest.json中的配置一致
3. **文件位置**：所有图标文件必须放在`static`目录下
4. **图标质量**：高质量图标会提升应用在Google Play上的展示效果

## 6. 总结

- 仅在Google Play发布时，iOS图标配置不是必需的
- 已为Google Play添加了512x512px和1024x1024px的图标配置
- 请按照要求准备对应的图标文件
- 高质量图标有助于提升应用的专业性和用户体验