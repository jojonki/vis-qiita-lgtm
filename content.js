// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command) {
        if (msg.command == "notify_lgtm") {
            let lgtm = "<b style='color: darkgreen'>Comments: " + msg.comment + "</b></br />";
            console.log('recieve lgtm', msg.index);
            let $dom = $(document);
            $dom.find("div.g").each(function (i, obj) {
                let result_url = $(obj).find('div a:first').attr('href');
                if (result_url.startsWith('https://qiita.com/') && i == msg.index) {
                    let $title = $(obj).find('h3');
                    $title.text($title.text() + ' (' + msg.n_lgtm + ')');
                }
                return;
            });
        }
    }
});
