// ==UserScript==
// @name              绅士仓库评论帖子屏蔽
// @description       提供绅士仓库 评论和帖子 的屏蔽功能, 支持按用户、分类、关键字屏蔽
// @namespace         moe.cangku.mengzonefire
// @version           1.1.0
// @author            mengzonefire
// @license           MIT
// @icon              https://cangku.icu/favicon.ico
// @match             *://cangku.icu/*
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant             GM_setValue
// @grant             GM_getValue
// @run-at            document-start
// ==/UserScript==
!(function () {
  "use strict";

  // 全局变常量声明
  const host = "cangku.icu";
  const regUserId = new RegExp("/user/(\\d+)");
  const regArchive = new RegExp(`${host}/archives/\\d+`);
  const regHome = new RegExp(`${host}/($|\\?page=\\d+)`);
  const regRank = new RegExp(`${host}/rank`);
  const regCategory = new RegExp(`${host}/category/(\\d+)($|\\?page=\\d+)`);
  const regAccount = new RegExp(`${host}/account`);
  const regNoti = new RegExp(`${host}/notification\\?type=reply`);
  const regUserPage = new RegExp(`${host}/user/\\d+`);
  const archiveBtn =
    '<a id="mzf-archive-action" href="javascript:;" class="meta-label primary text-small"></a>'; //帖子页面内 标签上的屏蔽按钮
  const userAction =
    '<div id="mzf-user-action" style="position: absolute;z-index: 100;right: 0px;top: 0px;"></div>'; //用户主页的屏蔽按钮父元素
  const userBtn =
    '<button type="button" class="btn" style="margin-top: 5px;margin-right: 5px;"></button>'; //用户主页的屏蔽按钮
  const homeBtn =
    '<a id="mzf-block-archive" href="javascript:;" class="view meta-label">屏蔽作者</a>'; //主页的帖子屏蔽按钮
  const commentBtn =
    '<a id="mzf-block-comment" href="javascript:;" class="operate-btn"> 屏蔽用户 </a>'; //帖子下的评论屏蔽按钮
  const notiBtn =
    '<a id="mzf-block-comment2" href="javascript:;" style="margin-left:5px;white-space:nowrap;">屏蔽用户</a>'; //通知页评论屏蔽按钮
  const categoryBtn =
    '<button id="category-block-btn" categoryId="0" categoryStr="" type="button" class="btn btn-primary">屏蔽分类: </button>'; // 分类屏蔽按钮
  const setBtn =
    '<li class="menu-list-item"><a id="mzf-block-set" href="javascript:;">屏蔽设置</a></li>'; //账户设置页的设置按钮
  const setCard =
    '<div id="mzf-manage-card" class="card manage-card"> <div class="card-header"> <h3 class="title">屏蔽设置</h3> </div> <div class="card-body"> <p>用户id获取: 用户主页 -&gt; https://cangku.icu/user/[用户id]; 每条id用空格分隔</p> <div class="form-group"><label>屏蔽评论的用户id:</label><input id="mzf-input-id1" type="text" class="form-control"> </div> <div class="form-group"><label>屏蔽帖子的用户id:</label><input id="mzf-input-id2" type="text" class="form-control"> </div> <div class="form-group"><label>屏蔽评论关键字 (多个关键字以英文逗号","分隔):</label><input id="mzf-input-keyword1" type="text" class="form-control"></div> <div class="form-group"><label>屏蔽帖子标题关键字 (多个关键字以英文逗号","分隔):</label><input id="mzf-input-keyword2" type="text" class="form-control"></div> <p>分类id获取: 分类页面 -&gt; https://cangku.icu/category/[分类id]; 每条id用空格分隔</p> <div class="form-group"><label>屏蔽帖子分类id:</label><input id="mzf-input-id3" type="text" class="form-control"> </div> <div class="form-group"><label for="block-mode">帖子屏蔽方式:</label><select id="archive-block-mode" class="form-control"> <option value="hidden"> 隐藏 (直接隐藏帖子,不显示) </option> <option value="blur"> 模糊 (模糊帖子标题和封面) </option> </select></div> <div class="form-group"><label for="block-mode">评论屏蔽方式:</label><select id="comment-block-mode" class="form-control"> <option value="hidden"> 隐藏 (隐藏评论及相关回复,即整楼隐藏) </option> <option value="replace"> 打码 (整条评论或屏蔽的关键词替换为***) </option> </select></div> <div id="" class="form-group pt-4 mb-0"><button id="mzf-save-id" class="el-button el-button--success el-button--medium"><span>保存修改</span></button></div> </div> </div>'; // 设置界面
  const disableblurBtn =
    '<button id="disable-blur-btn" type="button" class="btn btn-info" style="z-index: 2; position: absolute; top: 50%; left: 50%; transform: scale(1.3) translate(-38%, -63%);">已屏蔽,点击显示</button>';
  const blurWrapper =
    '<div id="disable-click-wrapper" style=" width: 100%; height: 100%; z-index: 1; position: absolute; "></div>';
  const scriptHomePage = "https://greasyfork.org/zh-CN/scripts/445959";
  const domParseFail = `DOM解析失败, 请前往反馈:\n${scriptHomePage}`;
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  const configList = {
    // 配置数据条目以及对应的初值
    blockArchiveId: "",
    blockCommentId: "",
    blockCategoryId: "",
    blockArchiveKeyword: "",
    blockCommentKeyword: "",
    archiveBlockMode: "hidden",
    commentBlockMode: "hidden",
  };
  const config = {}; // 预缓存GM本地存储内的配置数据
  var observer1, observer2, observer3, page;

  function reloadConfig() {
    for (let key in configList)
      config[key] = GM_getValue(key) || configList[key];
  } // 重载配置数据

  /**
   * @description: 生成一个block列表(用户id,分类id,关键词)的管理实例
   * @param {*} listName block列表名称, 取值如下:
   * blockArchiveId: 屏蔽帖子的用户id blockCommentId: 屏蔽评论的用户id blockCategoryId: 屏蔽帖子的分类id (空格分隔符)
   * blockArchiveKeyword: 屏蔽帖子的关键词 blockCommentKeyword: 屏蔽评论的关键词 (","英文逗号分隔符)
   * @return {*} 管理实例, 包含增删查改的接口
   */
  function blockManager(listName) {
    let listStr = config[listName]; // 表数据
    let listType, separator, list;
    if (listName.includes("Id")) {
      listType = "Id";
      separator = " ";
      list = new Set(listStr.split(/\s+/));
    } else if (listName.includes("Keyword")) {
      listType = "Keyword";
      separator = ",";
      list = new Set(listStr.split(","));
    } else return null; // 表名不正确

    return {
      set(newList) {
        // 设置表, 注意参数newList为Array<String>类型
        let configVal = Array.from(new Set(newList)).join(separator); // 使用set结构实现去重
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      add(ele) {
        // 添加表条目(可以是用户id,分类id或关键词), 元数据使用set结构存储, 自带去重
        list.add(ele);
        let configVal = Array.from(list).join(separator);
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      remove(ele) {
        // 删除表条目
        list.delete(ele);
        let configVal = Array.from(list).join(separator);
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      isBlock(ele) {
        // 检查表内是否存在block条目, id类list返回bool, keyword类list则返回识别到的keyword条目或空字符串
        if (listType == "Id") return list.has(ele);
        else if (listType == "Keyword")
          for (let keyword of Array.from(list))
            if (keyword && ele.includes(keyword)) return keyword;
        return "";
      },
    };
  }

  // 主函数入口
  function main() {
    reloadConfig();
    addBtnListen();
    addObserver();
  }

  function addObserver() {
    let href = location.href;
    let observer = new MutationObserver(urlChangeHandler);
    observer.observe($("head > title")[0], {
      childList: true,
    });
    if (href.match(regArchive)) {
      // 评论列表并不会立即加载, 添加轮询
      observer1 = new MutationObserver(ArchiveHandler);
      observer1.observe($("#comment")[0], {
        childList: true,
        subtree: true,
      });
      addArchiveBtn();
    } else if (
      href.match(regHome) ||
      href.match(regCategory) ||
      href.match(regRank)
    ) {
      observer2 = new MutationObserver(HomeHandler);
      observer2.observe(
        $(
          "div.post-list>span.row, div.category-post>span.row, div.rank-post>span.row"
        )[0],
        {
          childList: true,
        }
      );
    } else if (href.match(regNoti)) {
      observer3 = new MutationObserver(NotiHandler);
      observer3.observe($("div.notification-list")[0], {
        childList: true,
      });
    } else if (href.match(regAccount) && !$("#mzf-block-set").length)
      addSetBtn();
    else if (href.match(regUserPage)) addUserBtn();
  }

  // 页面变化事件回调handler定义
  // url变化回调
  function urlChangeHandler() {
    // 页面变更, 重绑定监听器
    observer1 && observer1.disconnect();
    observer2 && observer2.disconnect();
    observer3 && observer3.disconnect();
    addObserver();
  }

  // 帖子内的评论列表变化回调
  function ArchiveHandler() {
    killComment();

    // 由于评论列表为动态加载, 故在此回调内添加评论屏蔽按钮
    if (!$("#mzf-block-comment").length)
      $("div.comment-operate").append(commentBtn);
  }

  // 主页的帖子列表变化回调
  function HomeHandler() {
    killArchive();

    // 由于帖子列表为动态加载, 故在此回调内添加帖子屏蔽按钮
    if (!$("#mzf-block-archive").length)
      $("span.view.meta-label").after(homeBtn);

    // 添加分类屏蔽按钮
    let categoryBtnTarget = $("ul.list.reset-ul-style.second-category");
    if (categoryBtnTarget.length) {
      let checkELe = $(
        "div.simple-navbar.text-center a.router-link-exact-active.active"
      );
      let categoryId = checkELe.attr("href").match(regCategory)[1];
      let blocked = blockManager("blockCategoryId").isBlock(categoryId);
      let categoryStr = checkELe.text();
      let btn = $("#category-block-btn");
      if (btn.length)
        btn
          .attr({ categoryId: categoryId, categoryStr: categoryStr })
          .html(`${blocked ? "解除屏蔽" : "屏蔽分类"}: ${categoryStr}`);
      // 按钮存在, 更新数据
      else
        categoryBtnTarget.before(
          $(categoryBtn)
            .attr({ categoryId: categoryId, categoryStr: categoryStr })
            .html(`${blocked ? "解除屏蔽" : "屏蔽分类"}: ${categoryStr}`)
        ); // 按钮不存在, 添加按钮
    }
  }

  // 通知页的评论列表变化回调
  function NotiHandler() {
    killComment(true);

    // 由于评论列表为动态加载, 故在此回调内添加评论屏蔽按钮
    $("time").each((_, item) => {
      if (!$(item).next("#mzf-block-comment2").length) $(item).after(notiBtn);
    });
  }

  // DOM按钮添加方法定义
  // 添加帖子内的帖子屏蔽按钮
  function addArchiveBtn() {
    if ($("#mzf-archive-action").length) return;
    let target = $("article div.header div.meta");
    let userId = [...target[0].children[0].href.matchAll(/user\/(\d+)/g)][0];
    if (!userId) return; // 未加载到href属性
    userId = userId[1];
    let blocked = blockManager("blockArchiveId").isBlock(userId);
    let blockArchiveBtn = $(archiveBtn)
      .attr("userId", userId)
      .text(blocked ? "解除屏蔽" : "屏蔽作者")
      .on("click", onBlockArchive2);
    target.append(blockArchiveBtn);
  }

  // 添加用户主页的按钮(屏蔽帖子和评论)
  function addUserBtn() {
    if ($("#mzf-user-action").length) return;
    let userId = location.href.match(/user\/(\d+)/)[1];
    let isblockArc = blockManager("blockArchiveId").isBlock(userId);
    let isblockCom = blockManager("blockCommentId").isBlock(userId);
    let blockArchiveBtn = $(userBtn)
      .attr("userId", userId)
      .text(isblockArc ? "解除帖子屏蔽" : "屏蔽用户帖子")
      .addClass(isblockArc ? "btn-success" : "")
      .on("click", onUserBlockArchiveBtn);
    let bnBlockCommentBtn = $(userBtn)
      .attr("userId", userId)
      .text(isblockCom ? "解除评论屏蔽" : "屏蔽用户评论")
      .addClass(isblockCom ? "btn-danger" : "btn-secondary")
      .on("click", onUserBlockCommentBtn);
    $("div.user-header-info-body").prepend(
      $(userAction).append(blockArchiveBtn, bnBlockCommentBtn)
    );
  }

  // 添加设置按钮
  function addSetBtn() {
    $("li.menu-list-item a").click(() => {
      $("#mzf-block-set").removeClass();
      $("#mzf-manage-card").css("display", "none");
      $("div.col-md-9>.manage-card[id!='mzf-manage-card']").css(
        "display",
        "flex"
      );
      $('a[aria-current="page"]').addClass("router-link-exact-active active");
    }); // 绑定原侧栏按钮事件切换dom显隐，防止干扰原生的切换效果
    $("ul.menu-group-list").append(setBtn);
  }

  // 按钮事件定义
  // 用户主页的帖子屏蔽按钮
  function onUserBlockArchiveBtn(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockArchiveId").isBlock(ele.attr("userId"));
    ele.html(blocked ? "解除帖子屏蔽" : "屏蔽用户帖子");
    blocked ? ele.addClass("btn-success") : ele.removeClass("btn-success");
    blocked
      ? blockManager("blockArchiveId").add(ele.attr("userId"))
      : blockManager("blockArchiveId").remove(ele.attr("userId"));
  }

  // 用户主页的评论屏蔽按钮
  function onUserBlockCommentBtn(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockCommentId").isBlock(ele.attr("userId"));
    ele.html(blocked ? "解除评论屏蔽" : "屏蔽用户评论");
    ele.removeClass(blocked ? "btn-secondary" : "btn-danger");
    ele.addClass(blocked ? "btn-danger" : "btn-secondary");
    blocked
      ? blockManager("blockCommentId").add(ele.attr("userId"))
      : blockManager("blockCommentId").remove(ele.attr("userId"));
  }

  // 设置按钮回调
  function onSetingBtn() {
    if ($("a.router-link-exact-active.active").attr("id") == "mzf-block-set")
      return; // 已在设置界面, 跳出
    $("a.router-link-exact-active.active").removeClass();
    $("#mzf-block-set").addClass("router-link-exact-active active"); //切换左侧侧栏按钮激活样式
    $("div.col-md-9>.manage-card").css("display", "none"); // 隐藏原dom，不要删除或替换，会导致原生切换失效
    if (!$("#mzf-manage-card").length)
      $("div.col-md-9>.manage-card").after(setCard); // 设置页dom不存在,添加dom
    $("#mzf-manage-card").css("display", "flex"); // 显示dom
    $("#mzf-input-id1")[0].value = config["blockCommentId"];
    $("#mzf-input-id2")[0].value = config["blockArchiveId"];
    $("#mzf-input-id3")[0].value = config["blockCategoryId"];
    $("#mzf-input-keyword1")[0].value = config["blockCommentKeyword"];
    $("#mzf-input-keyword2")[0].value = config["blockArchiveKeyword"];
    $("#archive-block-mode")[0].value = config["archiveBlockMode"];
    $("#comment-block-mode")[0].value = config["commentBlockMode"];
  }

  // 设置界面保存按钮回调
  function onSaveSetingBtn() {
    let blockCommentId = $("#mzf-input-id1")[0].value.split(/\s+/);
    let blockArchiveId = $("#mzf-input-id2")[0].value.split(/\s+/);
    let blockCategoryId = $("#mzf-input-id3")[0].value.split(/\s+/);
    let blockCommentKeyword = $("#mzf-input-keyword1")[0]
      .value.split(",")
      .map((str) => str.trim()); // 关键词列表使用trim方法修剪处理以保证准确性
    let blockArchiveKeyword = $("#mzf-input-keyword2")[0]
      .value.split(",")
      .map((str) => str.trim());
    config["archiveBlockMode"] = $("#archive-block-mode")[0].value;
    config["commentBlockMode"] = $("#comment-block-mode")[0].value;
    GM_setValue("archiveBlockMode", config["archiveBlockMode"]);
    GM_setValue("commentBlockMode", config["commentBlockMode"]);
    blockManager("blockCommentId").set(blockCommentId);
    blockManager("blockArchiveId").set(blockArchiveId);
    blockManager("blockCategoryId").set(blockCategoryId);
    blockManager("blockCommentKeyword").set(blockCommentKeyword);
    blockManager("blockArchiveKeyword").set(blockArchiveKeyword);
    alert("设置成功, 刷新页面生效");
  }

  //帖子外的帖子屏蔽按钮回调, 无状态
  function onBlockArchive(btn) {
    let ele = $(btn.target).parents("div.post").find("a.meta-label");
    let userId = ele.attr("href").match(regUserId)[1];
    if (ele.length && userId) {
      blockManager("blockArchiveId").add(userId);
      alert(`帖子作者: ${ele.html()} 屏蔽成功`);
      killArchive();
    } else alert(domParseFail);
  }

  // 帖子内的帖子屏蔽按钮回调, 包含两种状态
  function onBlockArchive2(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockArchiveId").isblock(ele.attr("userId"));
    ele.html(blocked ? "解除屏蔽" : "屏蔽作者");
    blocked
      ? blockManager("blockArchiveId").add(ele.attr("userId"))
      : blockManager("blockArchiveId").remove(ele.attr("userId"));
  }

  // 帖子内的评论条目的屏蔽按钮, 以及通知页的回复评论屏蔽按钮回调
  function onBlockComment(btn, isNotiPage = false) {
    let ckeckEle = isNotiPage
      ? $(btn.target).parents("a.notification-item").find("div.notice a")
      : $(btn.target).parents("div.content-wrap").find("div.comment-meta a");
    if (ckeckEle.length) {
      blockManager("blockCommentId").add(ckeckEle.attr("href"));
      alert(`评论用户: ${ckeckEle.html()} 屏蔽成功`);
      killComment();
    } else alert(domParseFail);
  }

  // DOM屏蔽实现
  // 屏蔽评论
  function killComment(isNotiPage = false) {
    $(isNotiPage ? "a.notification-item" : "div.comment-body li[id]").each(
      (index, item) => {
        item = $(item);
        let isblock = false;
        let commentEle = item.find("div.comment span");
        let blockKeyword = "";

        // 按用户id屏蔽评论 (优先执行)
        let checkELe = item.find(
          isNotiPage ? "div.notice" : "div.comment-meta"
        );
        if (!checkELe.length) return;
        let userId = checkELe.find("a");
        if (
          blockManager("blockCommentId").isBlock(
            userId.attr("href").match(regUserId)[1]
          )
        ) {
          isblock = true;
          userId.css("color", "red"); // 将用户昵称标红
          // 将下方的屏蔽按钮替换为显示按钮(用于解除文本打码)
        }

        // 按评论关键字屏蔽 (若已屏蔽则不执行)
        if (!isblock) {
          blockKeyword = blockManager("blockCommentKeyword").isBlock(
            commentEle.html()
          );
          isblock = Boolean(blockKeyword);
        }

        // 处理屏蔽
        if (isblock) {
          // 符合屏蔽规则, 按屏蔽模式执行对应修改
          if (config["commentBlockMode"] == "hidden")
            item.css("display", "none"); // 隐藏
          else if (config["archiveBlockMode"] == "replace") {
            commentEle.attr("oriContent", commentEle.html()); // 备份评论内容
            blockKeyword
              ? commentEle.html(
                  commentEle
                    .html()
                    .replaceAll(
                      blockKeyword,
                      "".padStart(blockKeyword.length, "*")
                    )
                )
              : commentEle.html("".padStart(commentEle.text().length, "*")); // 文字打码, 若为用户id屏蔽则将整条评论替换为等长星号，若为关键词屏蔽则仅替换关键词
          }
        }
      }
    );
  }

  //屏蔽帖子
  function killArchive() {
    let isCategoryPage = location.href.match(regCategory);
    $("div.post").each((index, item) => {
      let isblock = false;
      item = $(item);

      // 按用户id屏蔽文章 (优先执行)
      let checkELe = item.find("a.meta-label"); // 查找文章作者标签元素
      if (!checkELe.length) return; // 未找到识别元素->非正常的投稿列表项(可能是广告元素), 跳出
      let userId = checkELe.attr("href").match(regUserId)[1];
      if (blockManager("blockArchiveId").isBlock(userId)) {
        checkELe.find("span.author").css("color", "red"); // 将作者标红
        isblock = true;
      }

      // 按标题关键字屏蔽 (若已屏蔽则不执行)
      if (!isblock) {
        checkELe = item.find("div.title");
        if (!checkELe.length) return;
        let keyword = blockManager("blockArchiveKeyword").isBlock(
          checkELe.text()
        );
        if (keyword) {
          checkELe.html(
            checkELe
              .html()
              .replaceAll(keyword, `<span style="color: red">${keyword}</span>`)
          ); // 将标题内识别到的屏蔽关键词标红
          isblock = true;
        }
      }

      // 按分类屏蔽 (若已屏蔽则不执行, 若在分类页面也不执行)
      if (!isblock && !isCategoryPage) {
        checkELe = item.find("a.category");
        for (let ele of checkELe) {
          let result = ele.href.match(regCategory);
          if (result && blockManager("blockCategoryId").isBlock(result[1])) {
            isblock = true;
            $(ele).css("color", "red");
            break;
          }
        }
      }

      // 处理屏蔽
      if (isblock) {
        // 符合屏蔽规则, 按屏蔽模式执行对应修改
        if (config["archiveBlockMode"] == "hidden")
          item.css("display", "none"); // 隐藏
        else if (config["archiveBlockMode"] == "blur") {
          // 高斯模糊&添加解除模糊按钮&禁用a标签
          item.find("div.post-card-content").css("filter", "blur(1.2rem)");
          if (!item.find("#disable-blur-btn").length) {
            item
              .find("section.post-card-wrap")
              .prepend(disableblurBtn + blurWrapper);
          }
        }
      } else {
        // 不符合屏蔽规则, 恢复元素CSS, 去除按钮
        item
          .css("display", "block")
          .find("div.post-card-content")
          .css("filter", "none")
          .find("span.author")
          .css("color", "");
        item.find("a.category").css("color", "");
        item.find("#disable-click-wrapper, #disable-blur-btn").remove();
      }
    });
  }

  function addBtnListen() {
    // 预先绑定好按钮事件
    $(document).on("click", "#mzf-block-archive", onBlockArchive);
    $(document).on("click", "#mzf-block-comment", (btn) => onBlockComment(btn));
    $(document).on("click", "#mzf-block-comment2", (btn) =>
      onBlockComment(btn, true)
    );
    $(document).on("click", "#mzf-block-set", onSetingBtn);
    $(document).on("click", "#mzf-save-id", onSaveSetingBtn);
    $(document).on("click", "#disable-blur-btn", (btn) => {
      let ele = $(btn.target);
      ele.siblings("div.post-card-content").css("filter", "none"); // 全图界面
      ele.siblings("a").find("div.post-card-content").css("filter", "none"); // 缩略图界面
      ele.siblings("#disable-click-wrapper").remove();
      ele.remove();
    });
    $(document).on("click", "#category-block-btn", (btn) => {
      let ele = $(btn.target);
      let blocked = !blockManager("blockCategoryId").isBlock(
        ele.attr("categoryId")
      );
      blocked
        ? blockManager("blockCategoryId").add(ele.attr("categoryId"))
        : lockManager("blockCategoryId").remove(ele.attr("categoryId"));
      ele.html(
        `${blocked ? "解除屏蔽" : "屏蔽分类"}: ${ele.attr("categoryStr")}`
      );
    });
  }

  $(main);
})();
