"use strict";

function retrieveCommentFromArxiv(arxiv_url, tab, i) {
    $.ajax({
        type: "GET",
        url: arxiv_url,
        success: function (data) {
            let $dom = $($.parseHTML(data));
            // console.log($dom);
            let lgtm = $dom.find('div.p-items_wrapper').find('a:first');
            if (lgtm.attr('href').endsWith('likers')) {
                let n_lgtm = lgtm.text();
                // let ret_data = n_lgtm;
                console.log(i, 'LGTM:', n_lgtm);
                chrome.tabs.sendMessage(tab.id, {
                    command: "notify_lgtm",
                    n_lgtm: n_lgtm,
                    index: i
                });
            }
            // let comment = $dom.find("div.metatable").find(".comments").text();
            // if (comment === null || comment === "") {
            //     comment = "No comments";
            // }
            // chrome.tabs.sendMessage(tab.id, {
            //     command: "notify_comment",
            //     comment: comment
            // });
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
        //   const message = { type: "hoge" };
        //   chrome.tabs.sendMessage(tabId, message, null);
        chrome.tabs.executeScript({
            code: "(" + modifyDOM + ")();"
        }, (results) => {
            // let $dom = $($.parseHTML(results[0]));
            let $dom = $($.parseHTML(results[0]));
            $dom.find("div.g").each(function (i, obj) {
                let result_url = $(obj).find('div a:first').attr('href');
                if (result_url.startsWith('https://qiita.com/')) {
                    console.log(result_url);
                    retrieveCommentFromArxiv(result_url, tab, i);
                }
                return;
            });
        });
    }
});