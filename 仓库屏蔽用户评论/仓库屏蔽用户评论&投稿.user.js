// ==UserScript==
// @name              仓库屏蔽用户评论&帖子
// @description       提供屏蔽绅士仓库的用户评论和用户帖子的功能
// @namespace         moe.cangku.mengzonefire
// @version           1.0.6
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
  const matchUserId = /\/user\/(\d+)/;
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
  const setBtn =
    '<li class="menu-list-item"><a id="mzf-block-set" href="javascript:;">屏蔽设置</a></li>'; //账户设置页的设置按钮
  const setHtml =
    '<div class="card manage-card"> <div class="card-header"> <h3 class="title">屏蔽设置</h3> </div> <div class="card-body"> <p>id获取: 用户主页 -&gt; https://cangku.icu/user/[用户id]; 每条id用空格分隔</p> <div class="form-group"><label>屏蔽评论的用户id:</label><input id="mzf-input-id1" type="text" class="form-control"></div> <div class="form-group"><label>屏蔽帖子的用户id:</label><input id="mzf-input-id2" type="text" class="form-control"></div><div class="form-group"><label>屏蔽标题关键字 (多个关键字以英文逗号","分隔):</label><input id="mzf-input-keyword" type="text" class="form-control"></div> <div id="" class="form-group pt-4 mb-0"><button id="mzf-save-id" class="el-button el-button--success el-button--medium"><span>保存修改</span></button></div> </div> </div>';
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  function blockManager(listName) {
    let idListStr = GM_getValue(listName) || "";
    let idList = new Set(idListStr.split(/\s+/));
    return {
      get() {
        return idListStr;
      },
      set(newIdList) {
        GM_setValue(listName, Array.from(new Set(newIdList)).join(" "));
      },
      add(id) {
        idList.add(id);
        GM_setValue(listName, Array.from(idList).join(" "));
      },
      remove(id) {
        idList.delete(id);
        GM_setValue(listName, Array.from(idList).join(" "));
      },
      isBlock(id) {
        return idList.has(id);
      },
    };
  }
  var observer1, observer2, observer3;

  // 主函数入口
  function main() {
    let observer = new MutationObserver(urlChangeHandler);
    observer.observe($("head > title")[0], {
      childList: true,
    });
    listenBtn();
    start();
  }

  function start() {
    let href = location.href;
    let matchArchive = href.match(/archives\/\d+/);
    let matchHome = href.match(/cangku.icu\/($|\?page=\d+)/);
    let matchAccount = href.match(/account/);
    let matchNoti = href.match(/notification\?type=reply/);
    let matchUser = href.match(/user\/\d+/);
    if (matchArchive) {
      // 评论列表并不会立即加载, 添加轮询
      observer1 = new MutationObserver(ArchiveHandler);
      observer1.observe($("#comment")[0], {
        childList: true,
        subtree: true,
      });
      addArchiveBtn();
    } else if (matchHome) {
      observer2 = new MutationObserver(HomeHandler);
      observer2.observe($("div.post-list>span.row")[0], {
        childList: true,
      });
    } else if (matchNoti) {
      observer3 = new MutationObserver(NotiHandler);
      observer3.observe($("div.notification-list")[0], {
        childList: true,
      });
    } else if (matchAccount && !$("#mzf-block-set").length) addSetBtn();
    else if (matchUser) addUserBtn();
  }

  // 页面变化事件回调handler定义
  function urlChangeHandler() {
    observer1 && observer1.disconnect();
    observer2 && observer2.disconnect();
    observer3 && observer3.disconnect();
    start();
  }

  function ArchiveHandler() {
    killComment();
    if (!$("#mzf-block-comment").length)
      $("div.comment-operate").append(commentBtn);
  }

  function HomeHandler() {
    killArchive();
    if (!$("#mzf-block-archive").length)
      $("span.view.meta-label").after(homeBtn);
  }

  function NotiHandler() {
    killComment2();
    $("time").each((index, item) => {
      if (!$(item).next("#mzf-block-comment2").length) $(item).after(notiBtn);
    });
  }

  // DOM按钮添加函数定义
  function addArchiveBtn() {
    if ($("#mzf-archive-action").length) return;
    let target = $("article div.header div.meta");
    let userId = [...target[0].children[0].href.matchAll(/user\/(\d+)/g)][0];
    if (!userId) return; // 未加载到href属性
    userId = userId[1];
    let isblockArc = blockManager("blockArchiveId").isBlock(userId);
    let blockArchiveBtn = $(archiveBtn)
      .attr({ userId: userId, isblockArc: isblockArc })
      .text(isblockArc ? "解除屏蔽" : "屏蔽作者")
      .on("click", onBlockArchive2);
    target.append(blockArchiveBtn);
  }

  function addUserBtn() {
    if ($("#mzf-user-action").length) return;
    let userId = location.href.match(/user\/(\d+)/)[1];
    let isblockArc = blockManager("blockArchiveId").isBlock(userId);
    let isblockCom = blockManager("blockCommentId").isBlock(userId);
    let blockArchiveBtn = $(userBtn)
      .attr({ userId: userId, isblockArc: isblockArc })
      .text(isblockArc ? "解除帖子屏蔽" : "屏蔽用户帖子")
      .addClass(isblockArc ? "btn-success" : "")
      .on("click", onUserBlockArchiveBtn);
    let bnBlockCommentBtn = $(userBtn)
      .attr({ userId: userId, isblockCom: isblockCom })
      .text(isblockCom ? "解除评论屏蔽" : "屏蔽用户评论")
      .addClass(isblockCom ? "btn-danger" : "btn-secondary")
      .on("click", onUserBlockCommentBtn);
    $("div.user-header-info-body").prepend(
      $(userAction).append(blockArchiveBtn, bnBlockCommentBtn)
    );
  }

  function addSetBtn() {
    $("ul.menu-group-list").append(setBtn);
  }

  // 按钮事件定义
  function onUserBlockArchiveBtn(btn) {
    let ele = btn.target;
    ele.setAttribute("isblockArc", !eval(ele.getAttribute("isblockArc")));
    if (eval(ele.getAttribute("isblockArc"))) {
      ele.innerText = "解除帖子屏蔽";
      ele.classList.add("btn-success");
      blockManager("blockArchiveId").add(ele.getAttribute("userId"));
    } else {
      ele.innerText = "屏蔽用户帖子";
      ele.classList.remove("btn-success");
      blockManager("blockArchiveId").remove(ele.getAttribute("userId"));
    }
  }

  function onUserBlockCommentBtn(btn) {
    let ele = btn.target;
    ele.setAttribute("isblockCom", !eval(ele.getAttribute("isblockCom")));
    if (eval(ele.getAttribute("isblockCom"))) {
      ele.innerText = "解除评论屏蔽";
      ele.classList.replace("btn-secondary", "btn-danger");
      blockManager("blockCommentId").add(ele.getAttribute("userId"));
    } else {
      ele.innerText = "屏蔽用户评论";
      ele.classList.replace("btn-danger", "btn-secondary");
      blockManager("blockCommentId").remove(ele.getAttribute("userId"));
    }
  }

  function onSetingBtn() {
    $("div.col-md-9>div.manage-card").replaceWith(setHtml);
    $("#mzf-input-id1")[0].value = blockManager("blockCommentId").get();
    $("#mzf-input-id2")[0].value = blockManager("blockArchiveId").get();
  }

  function onSaveSetingBtn() {
    let blockCommentId = $("#mzf-input-id1")[0].value.split(/\s+/);
    let blockArchiveId = $("#mzf-input-id2")[0].value.split(/\s+/);
    blockManager("blockCommentId").set(blockCommentId);
    blockManager("blockArchiveId").set(blockArchiveId);
    alert("设置成功");
  }

  function onBlockArchive() {
    let ckeckEle = $(this).parents("div.post").find("a.meta-label");
    if (ckeckEle.length) {
      blockManager("blockArchiveId").add(
        ckeckEle[0].href.match(matchUserId)[1]
      );
      alert("屏蔽成功");
      killArchive();
    }
  }

  function onBlockArchive2(btn) {
    let ele = btn.target;
    ele.setAttribute("isblockArc", !eval(ele.getAttribute("isblockArc")));
    if (eval(ele.getAttribute("isblockArc"))) {
      ele.innerText = "解除屏蔽";
      blockManager("blockArchiveId").add(ele.getAttribute("userId"));
    } else {
      ele.innerText = "屏蔽作者";
      blockManager("blockArchiveId").remove(ele.getAttribute("userId"));
    }
  }

  function onBlockComment() {
    let ckeckEle = $(this).parents("div.content-wrap").find("a.author");
    if (ckeckEle.length) {
      blockManager("blockCommentId").add(
        ckeckEle[0].href.match(matchUserId)[1]
      );
      alert("屏蔽成功");
      killComment();
    }
  }

  function onBlockComment2() {
    let ckeckEle = $(this)
      .parents("a.notification-item")
      .find("div.avatar-wrapper");
    if (ckeckEle.length) {
      blockManager("blockCommentId").add(
        ckeckEle[0].children[0].href.match(matchUserId)[1]
      );
      alert("屏蔽成功");
      killComment2();
    }
  }

  // 屏蔽DOM元素实现
  function killComment() {
    $("div.comment-body li[id]").each((index, item) => {
      let checkELe = $(item).find("div.avatar-wrap");
      if (!checkELe.length) return;
      let userId = checkELe[0].children[0].href.match(matchUserId)[1];
      if (blockManager("blockCommentId").isBlock(userId)) item.remove();
    });
  }

  function killComment2() {
    $("a.notification-item").each((index, item) => {
      let checkELe = $(item).find("div.avatar-wrapper");
      if (!checkELe.length) return;
      let userId = checkELe[0].children[0].href.match(matchUserId)[1];
      if (blockManager("blockCommentId").isBlock(userId)) item.remove();
    });
  }

  function killArchive() {
    $("div.post").each((index, item) => {
      item = $(item);
      let checkELe = item.find("a.meta-label");
      if (!checkELe.length) return;
      let userId = checkELe[0].href.match(matchUserId)[1];
      if (blockManager("blockArchiveId").isBlock(userId))
        item.css("display", "none");
      else item.css("display", "block");
    });
  }

  function listenBtn() {
    // 预先绑定好按钮事件
    $(document).on("click", "#mzf-block-archive", onBlockArchive);
    $(document).on("click", "#mzf-block-comment", onBlockComment);
    $(document).on("click", "#mzf-block-comment2", onBlockComment2);
    $(document).on("click", "#mzf-block-set", onSetingBtn);
    $(document).on("click", "#mzf-save-id", onSaveSetingBtn);
  }

  $(main);
})();
