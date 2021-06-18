## 相关教程

脚本<span style="color: rgb(209, 72, 65);"> 不能正常使用 </span>或<span style="color: rgb(209, 72, 65);"> 不会安装 </span>, 请先阅读安装教程 [安装教程](https://shimo.im/docs/Jqf8y260KuofSb4K/)

(内含 安卓浏览器 找不到 "电脑版转换" 按钮, 以及 "秒传按钮不显示" 等问题的解决方法)

脚本的完整使用教程(包括安装脚本、提取、生成秒传)可参考视频教程：[秒传教程[视频版]](https://www.bilibili.com/video/BV1E5411H76K)

生成&分享过程中遇到问题(例如秒传无效/md5获取失败/文件和谐)可参考 [分享教程](https://shimo.im/docs/TZ1JJuEjOM0wnFDH/)

## 脚本说明

使用了[仓库用度盘投稿助手](https://greasyfork.org/zh-CN/scripts/3285)中的秒传提取代码，代码通过babel工具转换为es5，若需要es6版本的源码，请前往 [![](https://github.githubassets.com/favicons/favicon.png) GitHub](https://github.com/mengzonefire/my_web_script/blob/main/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96(es6).js)

支持批量提取(回车分隔符), 支持url传参(一键秒传), 格式：`https://pan.baidu.com/#bdlink=[参数]`，[参数]为base64加密过的任意格式链接 (支持批量)

若喜欢该脚本可前往 [![](https://static.afdiancdn.com/favicon.ico) 爱发电](https://afdian.net/@mengzonefire) 支持作者

## 常见秒传格式示例

梦姬标准/标准码: D5AABEFC3290F7A3C09912228B136D0C#821A9F0D27FCD19C80474D2140ED2D85#6467659#test.exe

PanDL格式: bdpan://dGVzdC5leGV8NjQ2NzY1OXxENUFBQkVGQzMyOTBGN0EzQzA5OTEyMjI4QjEzNkQwQ3w4MjFBOUYwRDI3RkNEMTlDODA0NzREMjE0MEVEMkQ4NQ==

PCS-GO格式: BaiduPCS-Go rapidupload -length=6467659 -md5=D5AABEFC3290F7A3C09912228B136D0C -slicemd5=821A9F0D27FCD19C80474D2140ED2D85 "/test.exe"

## 常见问题

（若秒传按钮不显示、无反应或弹窗卡死，请按F12打开控制台查看&截图反馈报错）

1. 若控制台报错“Base64 is not define”，则为网络问题，请检查网络或尝试更换DNS

2. 安装脚本显示编译错误请先安装油猴Tampermonkey或暴力猴Violentmonkey, 注意脚本<span style="color: rgb(184, 49, 47);">不兼容</span>油猴子Greasemonkey

3. 火狐firefox用户使用会员账号生成秒传时, 会报 "文件获取失败(#403)", 通过 [UA切换插件](https://addons.mozilla.org/zh-CN/firefox/addon/uaswitcher) 切换为Chrome的UA, 即可解决

## 更新历史

21.3.30更新：修复部分秒传转存提示 "文件不存在" 或 "md5不匹配", 有该情况的请务必更新到1.6.7版本

21.3.29更新：新增<span style="color: rgb(209, 72, 65);"> 直接修复下载 </span>功能，无需秒传即可修复下载，感谢TkzcM的帮助

<span style="color: rgb(184, 49, 47);">注意:</span> 后续测试发现1.6.1和1.6.2版本该功能有可能使原文件丢失, 若需要使用该功能请务必更新到1.6.3以上版本

<span style="color: rgb(184, 49, 47);">注意2:&nbsp;</span><span style="color: rgb(0, 0, 0);">由于实现机制不同, "直接修复" 的成功率相对 "转存的修复" 较低, 至少一半以上的文件无法修复(弹窗提示 "不支持修复"), 目前暂时未找到解决方法</span>

![](https://pic.rmb.bdstatic.com/bjh/5e05f7c1f772451b8efce938280bcaee.png)

21.3.16更新：秒传转存新增<span style="color: rgb(209, 72, 65);"> 修复下载 </span>功能，可修复绝大部分无法下载的文件 (需有秒传链接并在转存时勾选修复选项)

![](https://pic.rmb.bdstatic.com/bjh/822bf85e8b663f352c65f04a50a305e1.png)

21.2.26更新：若在更新1.5.0版本后出现秒传按钮不显示的问题, 请尝试更新到1.5.5版本

21.2.11更新：[分享教程](https://shimo.im/docs/TZ1JJuEjOM0wnFDH/) 更新, 原教程的 "固实压缩+加密文件名" 已无法再防和谐(在度盘移动端依旧可以在线解压), 目前有效的防和谐方法请参考教程内的 "双层压缩"

21.1.28更新：兼容了暴力猴插件, 添加更换主题功能, 优化部分代码逻辑

21.1.11更新：若1.4.0版本出现 "转存失败" 的情况, 请更新1.4.4版本

20.12.18更新：不再支持暴力猴violentmonkey2.12.8以上插件, 使用该插件的用户请降级插件或改用油猴插件Tampermonkey

若使用1.3.5版本时出现一键秒传(解base64)不可用的情况, 请将脚本更新至1.3.6以上

20.11.12更新：若1.2.9版本出现秒传按钮不显示的情况, 请更新1.3.0版本

20.11.5更新：若出现转存时路径留空转存无反应的情况, 请更新1.2.7版本

20.11.2更新：1.2.4版本加入了生成秒传的功能,选择文件/文件夹后即可看到秒传生成按钮

![](https://i.loli.net/2020/11/02/7xcdAZh94igmvCt.png)

另外还增加了跳转目录的功能,若在秒传转存时有输入保存路径, 转存完成后可以看到跳转按钮

![](https://i.loli.net/2020/11/02/zTnpl6WCxqmEH1t.png)

## 秒传链接的获取方式

1. [PanDL格式]</span> 的链接可以在PandownDownLoad（Win版）生成，需要在度盘中存有文件

2. [梦姬标准格式]请前往 [蓝奏云 密码:ab2f](https://wws.lanzous.com/b01u0yqvi) 获取生成工具，本地生成，但需要上传过文件到度盘才能使其生效

3. 使用脚本自带的生成功能生成[梦姬标准格式]：选中文件/文件夹, 再点击 "生成秒传" 即可
