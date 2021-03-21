"use strict";

function retrieveLGTM(qiita_url, tab, i) {
    $.ajax({
        type: "GET",
        url: qiita_url,
        success: function (data) {
            let $dom = $($.parseHTML(data));
            let lgtm = $dom.find('div.p-items_wrapper').find('a:first');
            if (lgtm.attr('href').endsWith('likers')) {
                let n_lgtm = lgtm.text();
                chrome.tabs.sendMessage(tab.id, {
                    command: "notify_lgtm",
                    n_lgtm: n_lgtm,
                    index: i
                });
            }
        }
    });
}

function modifyDOM() {
    return document.body.innerHTML;
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status !== "complete") {
        return;
    }

    if (tab.url && tab.url.indexOf("https://www.google.com/search") >= 0) {
        chrome.tabs.executeScript({
            code: "(" + modifyDOM + ")();"
        }, (results) => {
            let $dom = $($.parseHTML(results[0]));
            $dom.find("div.g").each(function (i, obj) {
                let result_url = $(obj).find('div a:first').attr('href');
                if (result_url.startsWith('https://qiita.com/')) {
                    retrieveLGTM(result_url, tab, i);
                }
            });
        });
    }
});