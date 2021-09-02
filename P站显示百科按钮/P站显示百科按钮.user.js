// ==UserScript==
// @name              Pixiv显示百科按钮
// @description       显示一个打开Pixiv百科页面的按钮
// @namespace         moe.cangku.mengzonefire
// @version           1.0.3
// @author            mengzonefire
// @contributionURL   https://afdian.net/@mengzonefire
// @match             *://www.pixiv.net/*
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at            document-end
// ==/UserScript==
!(() => {
  "use strict";
  const htmlTag = "div.sc-1973m3p-0.eafcux";
  var tag = "";
  function addBtn() {
    let html_tag = $(htmlTag);
    if (html_tag.length) {
      let htmlBtn = `<button id="mzf_dic_btn" aria-disabled="false" class="sc-13xx43k-0 sc-13xx43k-1 kzKWyw" onclick="window.open('https://dic.pixiv.net/a/${tag}','_self')">Pixiv百科全书</button>`;
      html_tag.before(htmlBtn);
    } else setTimeout(addBtn, 100);
  }
  function start() {
    let MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    let observer = new MutationObserver(urlChangeHandler);
    observer.observe($("head > title")[0], {
      childList: true,
    });
  }
  function urlChangeHandler() {
    tag = window.location.href.match(/\/tags\/([^/]+)/);
    if (tag) {
      tag = tag[1];
      console.log(`match tag: ${decodeURIComponent(tag)}`);
      addBtn();
    }
  }
  jQuery(start);
})();
