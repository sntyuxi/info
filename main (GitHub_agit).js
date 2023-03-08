console.clear();

http.__okhttp__.setTimeout(10000);

let url = [
    'https://raw.iqiq.io/sntyuxi/info/main/ui.js', //iqiq.io 加速ok sntyuxi_ui
    'https://ghproxy.com/https://raw.githubusercontent.com/sntyuxi/info/main/ui.js',   //github 加速器地址ok sntyuxi_ui
    'https://gh.api.99988866.xyz/https://raw.githubusercontent.com/sntyuxi/info/main/ui.js',  //github 加速备用地址
    'https://agit.ai/smtyuxi2002/apps/raw/branch/main/2_UI.js',  //调用agit 0.js  调用天天向上info.json
    'https://ghproxy.com/https://raw.githubusercontent.com/sec-an/Better-Auto-XXQG/main/UI.js', // 强国助手的加速器
    'https://gh.api.99988866.xyz/https://raw.githubusercontent.com/sec-an/Better-Auto-XXQG/main/UI.js', // 强国助手的加速器
    // https://gh.api.99988866.xyz , https://ghproxy.com/ , https://toolwa.com/github/ 
    ];

for (var i = 0; i < url.length; i++) {
    try {
        let res = http.get(url[i]);
        console.log(i + ":" + res.statusCode);
        if (res.statusCode == 200) {
            var UI = res.body.string();
            if (UI.indexOf('"ui";') == 0) break;
        } else {
            toastLog('UI脚本:地址' + i + '下载失败');
        }
    } catch (error) {}
}

engines.execScript("UI", UI);