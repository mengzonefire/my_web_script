// ==UserScript==
// @name              仓库屏蔽用户评论&投稿
// @description       提供屏蔽绅士仓库的用户评论和用户帖子的功能
// @namespace         moe.cangku.mengzonefire
// @version           1.0.0
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

  const homeBtn =
    '<a id="mzf-block-archive" href="javascript:;" class="view meta-label float-left">屏蔽作者</a>'; //主页的帖子屏蔽按钮
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
    let matchNoti = href.match(/notification/);
    if (matchArchive) {
      // 评论列表并不会立即加载, 添加轮询
      observer1 = new MutationObserver(ArchiveHandler);
      observer1.observe($("#comment")[0], {
        childList: true,
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
    if (!$("#mzf-block-comment").length)
      $("div.comment-operate").append(commentBtn);
  }

  function HomeHandler() {
    if (!$("#mzf-block-archive").length)
      $("span.view.meta-label").after(homeBtn);
  }

  function NotiHandler() {
    $("time").each((index, item) => {
      if (!$(item).prev("#mzf-block-comment2").length) $(item).before(notiBtn);
    });
  }

  function addSetBtn() {
    $("ul.menu-group-list").append(setBtn);
  }

  function onSetingBtn() {
    $("div.col-md-9>div.manage-card").replaceWith(setHtml);
    let id1 = GM_getValue("blockCommentId") || [];
    let id2 = GM_getValue("blockCommentId") || [];
    $("#mzf-input-id1").value = id1.join(" ");
    $("#mzf-input-id2").value = id2.join(" ");
  }

  function onSaveSetingBtn() {
    let blockCommentId = $("#mzf-input-id1").value.split(/\s+/);
    let blockArchiveId = $("#mzf-input-id2").value.split(/\s+/);
    GM_setValue("blockCommentId", Array.from(new Set(blockCommentId)));
    GM_setValue("blockArchiveId", Array.from(new Set(blockArchiveId)));
    alert("设置成功");
  }

  function onBlockArchive() {
    console.log($(this));
  }

  function onBlockComment() {
    console.log($(this));
  }

  function onBlockComment2() {
    console.log($(this));
  }

  function killComment2() {}

  function killComment() {}

  function killArchive() {}

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
