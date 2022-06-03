// ==UserScript==
// @name              仓库屏蔽用户评论&投稿
// @description       提供屏蔽绅士仓库的用户评论和用户帖子的功能
// @namespace         moe.cangku.mengzonefire
// @version           1.0.0
// @author            mengzonefire
// @license           MIT
// @match             *://cangku.icu/*
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at            document-start
// ==/UserScript==
!(function () {
  "use strict";
  const homeBtn1 =
    '<div id="mzf-block-archive" class="view meta-label float-left">屏蔽</div>'; // 主页缩略图模式下的帖子屏蔽按钮
  const homeBtn2 =
    '<span id="mzf-block-archive" class="view meta-label">屏蔽</span>'; // 主页全图模式下的帖子屏蔽按钮
  const commentBtn = '<a id="mzf-block-comment" class="operate-btn"> 屏蔽 </a>'; // 帖子下的评论屏蔽按钮
  const setBtn =
    '<li id="mzf-block-setting" class="menu-list-item"><a href="javascript:;">屏蔽设置</a></li>'; // 账户设置页的设置按钮
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  var observer1, observer2;

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
    if (matchArchive) {
      observer1 = new MutationObserver(ArchiveHandler);
      observer1.observe($("ul.comment-list")[0], {
        childList: true,
      });
    } else if (matchHome) {
      observer2 = new MutationObserver(HomeHandler);
      observer2.observe($("div.post-list>span.row")[0], {
        childList: true,
      });
    } else if (matchAccount) {
      addSetBtn();
    }
  }

  function urlChangeHandler() {
    observer1 && observer1.disconnect();
    observer2 && observer2.disconnect();
    start();
  }

  function ArchiveHandler() {}
  function HomeHandler() {}
  function addSetBtn() {
    $("ul.menu-group-list").append(setBtn);
  }

  function listenBtn() {
    // 预先绑定好按钮事件
    $(document).on("click", "#mzf-block-archive", () => {});
    $(document).on("click", "#mzf-block-comment", () => {});
    $(document).on("click", "#mzf-block-setting", () => {});
  }

  $(main);
})();
