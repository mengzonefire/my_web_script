// ==UserScript==
// @name              Pixiv显示百科按钮
// @description       显示一个打开Pixiv百科页面的按钮
// @namespace         moe.cangku.mengzonefire
// @version           1.0.1
// @author            mengzonefire
// @match             *://www.pixiv.net/tags/*
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at            document-start
// ==/UserScript==

!function () {
    'use strict';
    var href = "";
    var html_code = "";
    var link = "";
    let loop = setInterval(() => {
        if (window.location.href != href) {
            href = window.location.href;
            link = href.match(/\/tags\/([^\/]+)\/?/)[1];
            html_code = `<button aria-disabled="false" class="sc-13xx43k-0 sc-13xx43k-1 kzKWyw" onclick="window.open('https://dic.pixiv.net/a/${link}','_self')">Pixiv百科全书</button>`;
            clearInterval(loop);
            set_btn();
        }
    }, 1000);

    function set_btn() {
        let loop = setInterval(() => {
            var html_tag = $("div.rr60ze-3.foZeuY");
            if (!html_tag.length) return false;
            html_tag.append(html_code);
            clearInterval(loop);
        }, 500);
    }
}();