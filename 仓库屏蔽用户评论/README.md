# 绅士仓库评论帖子屏蔽

若喜欢该脚本可前往 <img src="https://static.afdiancdn.com/favicon.ico" width='16'>[爱发电](https://afdian.net/@mengzonefire) 支持作者

## 安装

[脚本发布页](https://greasyfork.org/zh-CN/scripts/445959)

\* 安装步骤可参考 **秒传脚本安装教程**: [载点1](https://mengzonefire.code.misakanet.cn/rapid-upload-userscript-doc-v2/document/Install/About) [载点2](https://xtsat.github.io/rapid-upload-userscript-doc/document/Install/About)

## 功能介绍

<details><summary>帖子屏蔽 (隐藏/模糊模式)</summary>
<p>帖子屏蔽在以下页面生效:</p> <ul> <li>排行页: cangku.icu/rank</li> <li>分类页: cangku.icu/category/*</li> <li>主页: cangku.icu, cangku.icu/?page=*</li> </ul> <p>在 <a href="https://cangku.icu/account">屏蔽设置</a> 内可设置以下两种屏蔽模式:</p> <ul> <li>隐藏 -&gt; 不显示帖子</li> <li>模糊 -&gt; 将帖子模糊显示 <a href="https://pic.rmb.bdstatic.com/bjh/7b21c1060269a9fc61a722ee3dc49e95.png">效果图1</a> <a href="https://pic.rmb.bdstatic.com/bjh/64feea498a94ad6d0822d3902d16de5d.png">效果图2</a> <p>* 模糊模式下, 触发 "<strong>用户屏蔽</strong>" "<strong>分类屏蔽</strong>" "<strong>关键词屏蔽</strong>" 规则的评论 -&gt; 用户名, 分类标签, 标题关键字 会分别被标红</p> </li> </ul>
</details>

<details><summary>评论屏蔽 (隐藏/打码模式)</summary>
<p>评论屏蔽在以下页面生效:</p> <ul> <li>帖子: cangku.icu/archives/***</li> <li>消息页: cangku.icu/notification?type=reply</li> <li>主页(即右侧的5条最新评论): cangku.icu, cangku.icu/?page=*</li> </ul> <p>在 <a href="cangku.icu/account">屏蔽设置</a> 内可设置以下两种屏蔽模式:</p> <ul> <li>隐藏 -&gt; 不显示帖子</li> <li>打码 -&gt; 将整条评论或屏蔽的关键词替换为*** <a href="https://pic.rmb.bdstatic.com/bjh/672199d753cf1080cac337087fbbb80b.png">用户屏蔽效果</a> <a href="https://pic.rmb.bdstatic.com/bjh/9ec564cbe33270a69a0628f74e8c0bc7.png">关键词屏蔽效果</a> <p>* 打码模式下, 触发 " <strong>用户屏蔽</strong>" 规则的评论 -&gt; 用户名会被标红</p> </li> </ul>
</details>

<details><summary>屏蔽规则1: 按用户屏蔽</summary>
<p>添加规则:</p> <ul><li>通过帖子标签处的屏蔽按钮 屏蔽用户的帖子, 图例: <ul><li><a href="https://pic.rmb.bdstatic.com/bjh/633463d52d0fa5d343d7bc108f09d09c.png">帖子列表的标签1</a></li><li><a href="https://pic.rmb.bdstatic.com/bjh/e6af6628e7869cfd0857044b28e127c3.png">帖子列表的标签2</a></li><li><a href="https://pic.rmb.bdstatic.com/bjh/b1c923b6b76207eafbc5310202d88999.png">帖子页上方的标签</a></li></ul></li><li>通过用户主页(cangku.icu/user/***)的屏蔽按钮, 切换 屏蔽/不屏蔽 该用户, 图例:<ul><li><a href="https://pic.rmb.bdstatic.com/bjh/519e1dc834a6ad3f0b58de39aa038f4d.png">屏蔽用户</a></li><li><a href="https://pic.rmb.bdstatic.com/bjh/4a3990a2e4a1ba3b1dfa816b525359b1.png">解除屏蔽</a></li></ul></li></ul>
</details>

<details><summary>屏蔽规则2: 按分类屏蔽</summary>
<p>添加规则:</p> <ul> <li>通过分类页(cangku.icu/category/*)的屏蔽按钮, 切换 屏蔽/不屏蔽 该分类, 图例: <ul> <li><a href="https://pic.rmb.bdstatic.com/bjh/acc306aabe17365fbc04865a39e86cb5.png">屏蔽分类</a></li> <li><a href="https://pic.rmb.bdstatic.com/bjh/12f544d079e0d037a84ec82e3b1d841d.png">解除屏蔽</a></li> </ul> </li> </ul>
</details>

<details><summary>屏蔽规则3: 按关键词屏蔽</summary>
<p>添加规则:</p> <ul> <li>通过设置页的<strong>屏蔽设置按钮</strong>, 切换到屏蔽设置界面, 添加屏蔽关键词, 图例: <ul> <li><a href="https://pic.rmb.bdstatic.com/bjh/7c6d378bcb6875125efdf6080821b1a1.png">打开设置页</a></li> <li><a href="https://pic.rmb.bdstatic.com/bjh/7915cdb37b679b7fb6d707334b36d1f9.png">打开屏蔽设置界面</a></li> </ul> </li> </ul>
</details>

## 开发中项目: **仓库增强脚本** 功能预览

1. 集成屏蔽功能(即本项目)
2. 帖子/作者订阅功能(通过右上小红点和消息页实现提醒, 监控 某作者更新 以及 某帖子修改->即监控补档)
   * 实现: 没有api的情况下, 监控帖子修改只能通过爬取dom进行CRC校验实现判断了
   * 监控作者更新则是直接访问api获取数据进行对比, 筛选出更新的帖子列表
3. 搜索增强功能, 通过提取本地文件的秒传信息, 搜索到对应的帖子(用于文件朔源, 查找解压密码等)
   * 实现: 提取到文件md5后, 通过仓库帖子搜索引擎(支持多关键字OR语法), 搜索如下4个关键字:
   * [小写md5] [大写md5] [小写md5_B64] [大写md5_B64]
   * 只要源帖子内包含 **一键秒传** 或 **标准码秒传** 即可被检索到