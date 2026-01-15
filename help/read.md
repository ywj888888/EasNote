###   轻笔记APP技术设计文档

###  应用名称：轻笔记
###  项目名称：EasNote
###  版本：1.0.0
###  创建时间：2025-11-7
###  开发者：个人

###  工具：HBuilder X 4.85

###  一、核心需求梳理

###  1.1 功能需求
- **文本记事功能**：用户可以输入文字，并作简单编辑
- **文本笔记保存功能**：将用户的文本笔记保存在移动端
- **文本笔记管理功能**：
    - 浏览所有文本笔记列表
    - 删除不需要的文本笔记
    - 显示和修改文本笔记

- **其他功能**：
    - 权限管理：告知用户应用的权限说明
    - 隐私声明：声明用户隐私信息保存方式，告知用户隐私信息的安全性
    - 关于我们：显示应用的基本信息，如版本号、开发者、联系方式（邮箱：953617338@qq.com）等。

###  1.2 非功能需求
- **性能要求**：页面跳转过程稳定，无明显延迟和卡顿
- **用户体验**：界面简洁直观，操作流畅
- **安全性**：保护文本笔记的隐私和安全（所有笔记内容保存在用户手机中）

### 二、框架设计

### 2.1 功能模块设计
- **文本笔记管理模块**：负责处理文本笔记的管理功能，包括文本笔记列表展示、文本笔记删除等
- **文本笔记编辑模块**：负责处理文本笔记的文字编辑修改等
- **权限管理模块**：告知用户应用的权限说明
- **隐私声明模块**：声明用户隐私信息保存方式，告知用户隐私信息的安全性（所有笔记内容保存在用户手机中，本应用不收集任何用户资料及信息）
- **关于我们模块**：显示应用的基本信息，如版本号、开发者、联系方式（邮箱：953617338@qq.com）等

### 2.2 页面设计
1. **首页**：文本笔记的管理功能，包括文本笔记列表展示、文本笔记删除。页面中下部有一个悬浮按钮“添加”，跳转文本笔记编辑页。
2. **文本笔记编辑页**：处理文本笔记的文字编辑修改。
3. **权限管理页**：告知用户应用的权限说明
4. **隐私声明页**：声明用户隐私信息保存方式，告知用户隐私信息的安全性（所有笔记内容保存在用户手机中，本应用不收集任何用户资料及信息）
5. **关于我们页**：显示应用的基本信息，如版本号、开发者、联系方式（邮箱：953617338@qq.com）等


### 三、页面style
- **页面背景色**：白色
- **字体颜色**：白色
- **字体大小**：18px
- **普通按钮样式**：圆角矩形，边框宽度为1px，边框颜色：浅蓝色，背景色：蓝色，字体颜色：白色，字体大小：18px，宽高：80px*60px
- **主要按钮样式**：圆形，边框宽度为1px，字体颜色：白色，字体大小：24px，宽高：120px*120px
- **卡片**：圆角矩形，背景色：浅绿色，边框宽度为1px，边框颜色：浅灰色
- **列表项**：圆角矩形，背景色：浅绿色，边框宽度为1px，边框颜色：浅灰色

### 四、代码文件结构
文件类型：配置文件、页面文件、功能模块文件、 资源文件：图标文件，图片文件等

#### 4.1 配置文件
| 文件名 | 相对路径 | 说明 |
| :--- | :--- | :--- |
| App.vue | /App.vue | 应用程序入口组件 |
| main.js | /main.js | 应用程序入口文件 |
| pages.json | /pages.json | 页面配置文件 |
| manifest.json | /manifest.json | 应用配置文件 |

#### 4.2 页面文件
| 文件名 | 相对路径 | 主要函数 | 功能说明 |
| :--- | :--- | :--- | :--- |
| welcome.vue | /pages/welcome/welcome.vue | startLoadingAnimation() | 欢迎页面 |
| index.vue | /pages/index/index.vue | loadNotes() | 加载笔记列表 |
|  |  | deleteNote(id) | 删除笔记 |
|  |  | addNote() | 添加新笔记 |
| note-edit.vue | /pages/note-edit/note-edit.vue | saveNote() | 保存笔记 |
|  |  | loadNote(id) | 加载笔记内容 |
| permission.vue | /pages/permission/permission.vue | showPermissions() | 显示权限说明 |
| privacy.vue | /pages/privacy/privacy.vue | showPrivacyPolicy() | 显示隐私声明 |
| about.vue | /pages/about/about.vue | showAppInfo() | 显示应用信息 |
| recycle-bin.vue | /pages/recycle-bin/recycle-bin.vue | restoreNote(id) | 回收页面 |


#### 4.3 功能模块文件
| 文件名 | 相对路径 | 主要函数 | 功能说明 |
| :--- | :--- | :--- | :--- |
| note-service.js | /utils/note-service.js | getAllNotes() | 获取所有笔记 |
|  |  | getNoteById(id) | 根据ID获取笔记 |
|  |  | saveNote(note) | 保存笔记 |
|  |  | deleteNote(id) | 删除笔记 |
| permission-service.js | /utils/permission-service.js | checkPermissions() | 检查权限 |
|  |  | requestPermissions() | 请求权限 |
| network-monitor.js | /utils/network-monitor.js | monitorNetworkChange(callback) | 监听网络 |
|  |  | checkNetworkStatus(showToast = false)  | 检查网络 |


#### 4.4 资源文件
| 文件名 | 相对路径 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| logo.png | /static/logo.png | 图片 | 应用图标 |
| add-icon.svg | /static/add-icon.svg | 图标 | 添加按钮图标 |
| delete-icon.svg | /static/delete-icon.svg | 图标 | 删除按钮图标 |
| edit-icon.svg | /static/edit-icon.svg | 图标 | 编辑按钮图标 |



