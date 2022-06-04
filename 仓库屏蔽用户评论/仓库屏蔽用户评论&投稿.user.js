// ==UserScript==
// @name              仓库屏蔽用户评论&帖子
// @description       提供屏蔽绅士仓库的用户评论和用户帖子的功能
// @namespace         moe.cangku.mengzonefire
// @version           1.0.3
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

  const matchUserId = /\/user\/(\d+)/;
  const homeBtn =
    '<a id="mzf-block-archive" href="javascript:;" class="view meta-label">屏蔽作者</a>'; //主页的帖子屏蔽按钮
  const commentBtn =
    '<a id="mzf-block-comment" href="javascript:;" class="operate-btn"> 屏蔽用户 </a>'; //帖子下的评论屏蔽按钮
  const notiBtn =
    '<a id="mzf-block-comment2" href="javascript:;" style="margin-right: 5px;">屏蔽用户</a>'; //通知页评论屏蔽按钮
  const setBtn =
    '<li class="menu-list-item"><a id="mzf-block-set" href="javascript:;">屏蔽设置</a></li>'; //账户设置页的设置按钮
  const setHtml =
    '<div class="card manage-card"> <div class="card-header"> <h3 class="title">屏蔽设置</h3> </div> <div class="card-body"> <div class="form-group"><label>屏蔽评论的用户id:</label><input id="mzf-input-id1" type="text" class="form-control"></div> <div class="form-group"><label>屏蔽帖子的用户id:</label><input id="mzf-input-id2" type="text" class="form-control"></div> <div id="" class="form-group pt-4 mb-0"><button id="mzf-save-id" class="el-button el-button--success el-button--medium"><span>保存修改</span></button></div> </div> </div>';
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  var observer1, observer2, observer3;

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
    if (matchArchive) {
      // 评论列表并不会立即加载, 添加轮询
      observer1 = new MutationObserver(ArchiveHandler);
      observer1.observe($("#comment")[0], {
        childList: true,
        subtree: true,
      });
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
    } else if (matchAccount && !$("#mzf-block-set").length) {
      addSetBtn();
    }
  }

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
      if (!$(item).prev("#mzf-block-comment2").length) $(item).before(notiBtn);
    });
  }

  function addSetBtn() {
    $("ul.menu-group-list").append(setBtn);
  }

  function onSetingBtn() {
    $("div.col-md-9>div.manage-card").replaceWith(setHtml);
    let id1 = GM_getValue("blockCommentId") || "";
    let id2 = GM_getValue("blockArchiveId") || "";
    $("#mzf-input-id1")[0].value = id1;
    $("#mzf-input-id2")[0].value = id2;
  }

  function onSaveSetingBtn() {
    let blockCommentId = $("#mzf-input-id1")[0].value.split(/\s+/);
    let blockArchiveId = $("#mzf-input-id2")[0].value.split(/\s+/);
    GM_setValue(
      "blockCommentId",
      Array.from(new Set(blockCommentId)).join(" ")
    );
    GM_setValue(
      "blockArchiveId",
      Array.from(new Set(blockArchiveId)).join(" ")
    );
    alert("设置成功");
  }

  function onBlockArchive() {
    let ckeckEle = $(this).parents("div.post").find("a.meta-label");
    if (ckeckEle.length) {
      let idList = GM_getValue("blockArchiveId") || "";
      idList = idList.split(/\s+/);
      idList.push(ckeckEle[0].href.match(matchUserId)[1]);
      GM_setValue("blockArchiveId", idList.join(" "));
      alert("屏蔽成功");
      killArchive();
    }
  }

  function onBlockComment() {
    let ckeckEle = $(this).parents("div.content-wrap").find("a.author");
    if (ckeckEle.length) {
      let idList = GM_getValue("blockCommentId") || "";
      idList = idList.split(/\s+/);
      idList.push(ckeckEle[0].href.match(matchUserId)[1]);
      GM_setValue("blockCommentId", idList.join(" "));
      alert("屏蔽成功");
      killComment();
    }
  }

  function onBlockComment2() {
    let ckeckEle = $(this)
      .parents("a.notification-item")
      .find("div.avatar-wrapper");
    if (ckeckEle.length) {
      let idList = GM_getValue("blockCommentId") || "";
      idList = idList.split(/\s+/);
      idList.push(ckeckEle[0].children[0].href.match(matchUserId)[1]);
      GM_setValue("blockCommentId", idList.join(" "));
      alert("屏蔽成功");
      killComment2();
    }
  }

  function killComment() {
    let blockCommentId = GM_getValue("blockCommentId") || "";
    blockCommentId = blockCommentId.split(/\s+/);
    $("div.comment-body li[id]").each((index, item) => {
      let checkELe = $(item).find("div.avatar-wrap");
      if (!checkELe.length) return;
      let userId = checkELe[0].children[0].href.match(matchUserId)[1];
      if (blockCommentId.indexOf(userId) !== -1) item.remove();
    });
  }

  function killComment2() {
    let blockCommentId = GM_getValue("blockCommentId") || "";
    blockCommentId = blockCommentId.split(/\s+/);
    $("a.notification-item").each((index, item) => {
      let checkELe = $(item).find("div.avatar-wrapper");
      if (!checkELe.length) return;
      let userId = checkELe[0].children[0].href.match(matchUserId)[1];
      if (blockCommentId.indexOf(userId) !== -1) item.remove();
    });
  }

  function killArchive() {
    let blockArchiveId = GM_getValue("blockArchiveId") || "";
    blockArchiveId = blockArchiveId.split(/\s+/);
    $("div.post").each((index, item) => {
      item = $(item);
      let checkELe = item.find("a.meta-label");
      if (!checkELe.length) return;
      let userId = checkELe[0].href.match(matchUserId)[1];
      if (blockArchiveId.indexOf(userId) !== -1) item.css("display", "none");
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
