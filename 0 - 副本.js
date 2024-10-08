auto.waitFor();
var delay_time = 3000;
device.wakeUpIfNeeded();//如果屏幕没有点亮，则唤醒设备。

// 读取自定义配置
var TTXS_PRO_CONFIG = storages.create("TTXS_PRO_CONFIG");
var watchdog = TTXS_PRO_CONFIG.get("watchdog", "1800");
var slide_verify = TTXS_PRO_CONFIG.get("slide_verify", "300");
var fast_mode = TTXS_PRO_CONFIG.get("fast_mode", false);
var ddtong = TTXS_PRO_CONFIG.get("ddtong", false);
var is_exit = TTXS_PRO_CONFIG.get("is_exit", true);
var pinglun = TTXS_PRO_CONFIG.get("pinglun", true);
var shipin = TTXS_PRO_CONFIG.get("shipin", true);
var wenzhang = TTXS_PRO_CONFIG.get("wenzhang", true);
var meiri = TTXS_PRO_CONFIG.get("meiri", true);
var quwei = TTXS_PRO_CONFIG.get("quwei", true);
//var meizhou = TTXS_PRO_CONFIG.get("meizhou", 0);
//var zhuanxiang = TTXS_PRO_CONFIG.get("zhuanxiang", 1);
var tiaozhan = TTXS_PRO_CONFIG.get("tiaozhan", true);
var ocr_choice = TTXS_PRO_CONFIG.get("ocr_choice", 0);
var ocr_maxtime = TTXS_PRO_CONFIG.get("ocr_maxtime", "5000");
var duizhan_mode = TTXS_PRO_CONFIG.get("duizhan_mode", 0);
var guaji = TTXS_PRO_CONFIG.get("guaji", true);
var siren = TTXS_PRO_CONFIG.get("siren", true);
var dacuo_num = TTXS_PRO_CONFIG.get("dacuo_num", "2");
var shuangren = TTXS_PRO_CONFIG.get("shuangren", true);
var bendi = TTXS_PRO_CONFIG.get("bendi", true);
var dingyue = TTXS_PRO_CONFIG.get("dingyue", 0);
var pushplus = TTXS_PRO_CONFIG.get("pushplus", "");
var yl_on = TTXS_PRO_CONFIG.get("yl_on", true);
var yinliang = TTXS_PRO_CONFIG.get("yinliang", "0");
var multifly = TTXS_PRO_CONFIG.get("multifly", true);
var zhanghao = TTXS_PRO_CONFIG.get("zhanghao", "");
var login_zh1 = TTXS_PRO_CONFIG.get("login_zh1", true);
var comment = TTXS_PRO_CONFIG.get("comment", "全心全意为人民服务|不忘初心，牢记使命|不忘初心，方得始终|永远坚持党的领导|富强、民主、文明、和谐|自由，平等，公正，法治");
function clickSel(sel, delay){
  //
  var actionStr = "click";
  var delay = delay || 1*1000
  //
  var node = sel.findOne(delay);
  if (node) {
      var d = node.depth();
      var able = actionStr.indexOf("scroll");
      if (able >= 0) {
          able = "scrollable"
      } else {
          able = actionStr + "able";
      }
      var originalNode = node;
      for (var i = 0; i < d; i++) {
          if (node[able]() || !(node = node.parent())) {
              var str = originalNode.text() ||
                  originalNode.desc() ||
                  originalNode.id() ||
                  originalNode.bounds();
              //str = str.splicez(str.
              log(str + " " + actionStr);
              var res = node[actionStr]();
              sleep(1000);
              return res;
          }
      }
      log(str + " false " + actionStr);
      return false;
  } else {
      log(this.selector + " undefined");
      return undefined;
  }


}

if (fast_mode) {
  auto.setMode("fast");
}
events.observeToast();
sleep(delay_time);

//判断是否快速模式
if (fast_mode) {
  auto.setMode("fast");
}
events.observeToast();//开启 Toast 监听，Toast 监听依赖于无障碍服务，因此此函数会确保无障碍服务运行
sleep(delay_time);//暂停3秒
/*****************更新内容弹窗部分*****************/
var storage = storages.create('xklong');
// 脚本版本号
var last_version = "V12.7";
var engine_version = "V12.7";
var newest_version = "V12.7";
if (storage.get(engine_version, true)) {
  storage.remove(last_version);
  let gengxin_rows = "脚本有风险，仅供学习交流;请尽快联系客服更换版本！5月6号停止APP版本维护;4.脚本测试环境：强国2.54（点击取消不再提示）".split(";");
  let is_show = confirm(engine_version + "版更新内容", gengxin_rows.join("\n"));//confirm()会弹出一个对话框并让用户选择"是"或"否"，如果选择"是"则返回true
  if (!is_show) {
    storage.put(engine_version, false);
  }//选择否，则永久关闭窗口
}
var w = fInit();
// console.setTitle("天天向上");
// console.show();
fInfo("学习新思想" + newest_version + "脚本初始化");
// 初始化宽高
var [device_w, device_h] = init_wh();//init_wh()是返回设备宽和高的函数
// log("fina:", device_w, device_h);
if (ocr_choice == 2) {
  fInfo("初始化第三方ocr插件");
  try {
    ocr = plugins.load("com.hraps.ocr");
    ocr.recognizeText = function (img) {
      let results = this.detect(img.getBitmap(), 1);
      let all_txt = "";
      for (let i = 0; i < results.size(); i++) {
        let re = results.get(i);
        all_txt += re.text;
      }
      return all_txt
    }
  } catch (e) {
    fError("未安装第三方OCR插件，请安装后重新运行");
    alert("未安装第三方OCR插件，点击确认跳转浏览器下载，密码为ttxs");
    app.openUrl("https://wwc.lanzouo.com/ikILs001d0wh");
    exit();
  }
}
// sleep(2000);
// 自动允许权限进程
threads.start(function () {
  //在新线程执行的代码
  //sleep(500);
  toastLog("开始自动获取截图权限");
  var btn = className("android.widget.Button").textMatches(/允许|立即开始|START NOW/).findOne(5000);
  if (btn) {
    sleep(1000);
    btn.click();
  }
  toastLog("结束获取截图权限");
});
fInfo("请求截图权限");
// 请求截图权限、似乎请求两次会失效
if (!requestScreenCapture(false)) { // false为竖屏方向
  fError('请求截图失败');
  exit();
}
// 防止设备息屏
fInfo("设置屏幕常亮");
device.keepScreenOn(3600 * 1000);
// 下载题库
fInfo("检测题库更新");
fInfo("如果不动就是正在下载，多等会");
//const update_info = get_tiku_by_http("https://gitcode.net/m0_64980826/songge_tiku/-/raw/master/info.json"); //已经坏掉
//const update_info = get_tiku_by_http("https://ghp.ci/https://raw.githubusercontent.com/sntyuxi/info/main/info.json"); //使用info调用，
//https://github.com/J-Mully/TechXueXi/tree/main  直接引用这个大哥的github——info】//
const update_info = get_tiku_by_http("https://ghp.ci/https://raw.githubusercontent.com/J-Mully/TechXueXi/main/info.json"); //使用info调用，
fInfo("正在加载对战题库......请稍等\n题库版本:" + update_info["tiku_version"]);
var tiku = [];
try {
  tiku = get_tiku_by_http(update_info["tiku_link"]);
} catch (e) {
  tiku = get_tiku_by_http(update_info["tiku_link2"]);
}
// var tiku = get_tiku_by_gitee();
fInfo("正在加载专项题库......请稍等\n题库版本:" + update_info["dati_tiku_version"]);
var dati_tiku = [];
try {
  dati_tiku = update_dati_tiku()
} catch (e) {
  fError("网络原因未获取到在线题库，请尝试切换流量或者更换114DNS");
  dati_tiku = get_tiku_by_ct('https://webapi.ctfile.com/get_file_url.php?uid=35157972&fid=555754562&file_chk=94c3c662ba28f583d2128a1eb9d78af4&app=0&acheck=2&rd=0.14725283060014105');
}
// 设置资源保存路径
files.createWithDirs("/sdcard/学习新思想/");
// 调整音量
if (yl_on) {
  fInfo("设置媒体音量");
  var yuan_yl = device.getMusicVolume();
  var max_yl = device.getMusicMaxVolume();
  let yl = Math.ceil(yinliang * max_yl / 100);
  //log(yuan_yl, max_yl, yl, typeof yl);
  device.setMusicVolume(yl);
  fInfo("当前音量：" + device.getMusicVolume());
}
if (is_exit) {
  fInfo("运行前重置学习APP");
  exit_app("学习强国");
  sleep(1500);
}
// 检测地理位置权限代码，出现就点掉
fInfo("开始位置权限弹窗检测");
var nolocate_thread = threads.start(function () {
  //在新线程执行的代码
  id("title_text").textContains("地理位置").waitFor();
  fInfo("检测到位置权限弹窗");
  sleep(1000);
  text("暂不开启").findOne().click();
  fInfo("已关闭定位");
});
app.launchApp('学习强国');
sleep(2000);



function do_pinglun() {
  entry_jifen_project("发表观点");
  fSet("title", "评论…");
  fClear();
  sleep(1000);
  let i = 0;
  swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.4, 1000);
  let text_edit = text("欢迎发表你的观点");
  while (true) {
    fClear();
    let pl = id("general_card_title_id").findOnce(i).text();
    fInfo("尝试点击:" + pl);
    clickSel (id("general_card_title_id").text(pl));
    log("等待加载");
    idContains("image-text-content").waitFor();
    log("查找评论框");
    let text_edit_value = text_edit.findOne(5000);//给5秒的检查时间
    if (text_edit_value != null) {
      break
    } else {
      fInfo("未找到评论框，返回选择下一篇文章");
      i++;
      back();
      sleep(2000);
    }
  }
  text_edit.waitFor();
  sleep(1500);
  while (text_edit.exists()) {
    let pinglun_edit = text_edit.findOne(500);
    fInfo("尝试点击评论框中");
    log(pinglun_edit.click());
    sleep(1500);
    fRefocus();
  }
  fInfo("评论框click: true");
  let content_list = comment.split("|");
  log("评论列表：", content_list);
  content_list = content_list[random(0, content_list.length - 1)];
  content_list || (fTips('评论内容不可设置为空，已重置为"不忘初心，牢记使命"'), content_list = "不忘初心，牢记使命");
  classNameEndsWith("EditText").findOne().setText(content_list);
  sleep(1000);
  text("发布").findOne().click();
  sleep(1000);
  text("删除").findOne().click();
  sleep(1000);
  text("确认").findOne().click();
  sleep(1000);
  back();
  // 返回积分页
  jifen_init();
  ran_sleep();
  return true;
}

/********时长部分*********/
function do_shipin() {
  entry_jifen_project("视听学习");
  let jifen_list = className("android.widget.ListView").findOne();
  jifen_list.child(jifen_map["视频"]).child(3).click();
  if (ddtong) {
    fSet("title", "视听(dd通)…");
  } else {
    fSet("title", "视听学习…");
  }
  fClear();
  desc("百灵").findOne().click();
  sleep(1000);
  fInfo("检测温馨提示弹窗");
  if (text("温馨提示").findOne(1500)) {
    text("关闭").findOne().click();
    fInfo("检测到温馨提示并已关闭");
  }
  desc("百灵").findOne().click();
  let shu = className("android.widget.TextView").text("竖").findOne().parent();
  shu.click();
  sleep(2000);
  // // 定位到整个百灵frame_box
  // //这里！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  // let frame_box = shu.parent().parent().parent().parent();
  // textMatches(/\d{2}:\d{2}/).waitFor();
  // let video_list = frame_box.findOne(className("android.widget.ScrollView"));
  // var v = className('android.widget.FrameLayout').clickable(true).depth(5).findOne().bounds();
  // press(v.centerX() + random(-7, 8), v.centerY() + random(-7, 8) - 50, random(130, 188));
  // fInfo('点击视频');
  
clickSel(  textMatches(/\d+:\d+/).boundsInside(500,100,device.width,device.height))
  sleep(2500);
  //video_list.child(1).child(1).child(0).click();
  text("分享").waitFor();
  if (idContains("guide_view").findOne(1500)) {
    fInfo("检测到引导遮罩");
    sleep(random(900, 1100));
    click(device_w / 2, device_h / 2);
    sleep(random(900, 1200));
    click(device_w / 2, device_h / 4);
  }
  sleep(800);
  //log(text("刷新重试").exists());
  textMatches(/刷新重试|继续播放/).exists() && (fInfo("检测到流量提醒"),
    textMatches(/刷新重试|继续播放/).findOne().click());
  sleep(random(1000, 1500));
  if (textContains("刷新重试").exists()) {
    console.error("检测到使用的手机流量，准备点击'刷新重试'");
    var v = text("刷新重试").findOne().bounds();
    press(v.centerX() + random(-1, 5), v.centerY() + random(-7, 8), random(120, 180));;
    sleep(random(1000, 1500));
  }
  sleep(random(8000, 9500));
  let re_times = 6;
  if (ddtong) {
    re_times += 6;
  }
  for (let i = 0; i < re_times; i++) {
    click(device_w / 2 + random(-7, 8), device_h / 2 + random(-5, 6));
    sleep(random(490, 560));
    swipe(device_w / 2 + random(-7, 9), device_h * 0.8 + random(-4, 8), device_w / 2 + random(-5, 5), device_h * 0.1 + random(-3, 5), random(900, 1100));
    sleep(random(8300, 12500));
  }
  back();
  fInfo("视频个数已刷完");
  // 返回积分页
  jifen_init();
  ran_sleep();
  return true;
}

function do_wenzhang() {
  //   jifen_list = refind_jifen();
  // 点击进入本地
  let old_wen = storage_user.get("old_wen_list", []);
  entry_jifen_project("本地频道");
  if (ddtong) {
    fSet("title", "文章(dd通)…");
  } else {
    fSet("title", "选读文章…");
  }
  fClear();
  fInfo("切换地区为北京");
  text("切换地区").findOne(3000);
  if (text("立即切换").exists()) {
    text("取消").findOne(3000).click();
  }
  log("切换地区");
  text("切换地区").findOne().click();
  log("查找北京");
  text("北京").waitFor();
  sleep(500);
  log("切换北京");
  sleep(500);
  // text("北京").findOne().parent().parent().click();
  clickSel(id("label_group_normal").text("北京"))
  sleep(500);
  fInfo("视听广播时长");
  clickSel(className("android.widget.TextView").text('北京新闻广播'));
  sleep(10000);
  back();
  fClear();
  // 下面正式刷文章
  fInfo("开始文章");
  clickSel(className("android.widget.TextView").text('北京学习平台'));  
  fInfo("等待加载");
  sleep(2000);
  text("新思想扎根京华").waitFor();
  sleep(2000);
  let swipe_y = text("新思想扎根京华").findOne().parent().parent().bounds().bottom;
  log("识别出顶部：", swipe_y);
  fRefocus();
  //let listview = className("android.widget.ListView").findOne();
  swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
  for (i = 0; i < 2; i++) {
    //listview.scrollForward();
    swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
    sleep(500);
  }

  let wen_box_slt = className("android.view.ViewGroup").filter(function (l) {
    let title = l.findOne(idContains("general_card_title_id"));
    let image = l.findOne(idContains("general_card_image_id"));
    let pic_num = l.findOne(idContains("st_feeds_card_mask_pic_num"));
    if (title ||image||pic_num) {
      return old_wen.indexOf(title.text()) == -1 && title.text().indexOf("【专题】") == -1;
    }
    return false;
  });


  // while (!textContains("【专题】").findOne(1000)) {
  //   log('执行在这')
  //   listview.scrollForward();
  //   sleep(500);
  // }
    while (!wen_box_slt.findOne(1000)) {
    //listview.scrollForward();
    swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);  
    sleep(500);
  }
  fInfo("找到文章");
  // 下面那句会定位到新思想的文章，不能加载过新思想
  let wen_box = wen_box_slt.findOne();
  // 先做5次
  let wen_num = 0;
  let re_times = 7;
  if (ddtong) {
    re_times += 6;
  }
  while (true) {
    let title = wen_box.findOne(idContains("general_card_title_id")).text();
    old_wen.push(title);
  storage_user.put("old_wen_list", old_wen);
    if (old_wen.length > 100) {
      old_wen.shift();
    }
    fClear();
    fInfo("点击文章：" + title);
    //wen_box.click();
    // let title_click = wen_box.parent().parent().click();
    let title_click = clickSel(text(title))
    fInfo("点击：" + title_click);
    //进入非文章界面修复
    fInfo("检测页面属性");
    if (text("全部播放").findOne(3000)) {
      fError("检测到非文章界面，返回重新查找文章");
      sleep(2000);
      back();
      idContains("general_card_title_id").waitFor();
      sleep(2000);
      //划出该界面
      for (let i = 1; i <= 2; i++) {
        swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
        sleep(3000);
      }
      // while (true) {
      //   if (idContains("general_card_title_id").exists()) {
      //     break
      //   } else {
      //     swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
      //     sleep(3000);
      //   }
      // }
      while (!wen_box_slt.exists()) {
        //listview.scrollForward();
        swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
        sleep(200);
      }
      wen_box = wen_box_slt.findOne();
      continue
    }
    classNameContains("com.uc.webview.export").waitFor();
    //fInfo("查找webview");
    let father_view = className("android.webkit.WebView").findOne(9000);
    sleep(1000);
    //     let father_view = className("android.view.View").depth(16).findOne();
    // 判断是否为专题而不是文章
    if (father_view && father_view.find(idContains("__next")).empty()) {
      //fInfo("查找文章内容");
      let content = idContains("image-text-content").findOne(9000);
      // log(idContains("image-text-content").findOne().id());
      if (content) {
        // 不先点一下划不动
        idContains("xxqg-article-header").findOne().child(0).click();
      }
      swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
      if (wen_num < re_times - 1) {
        sleep(random(10000, 10900));
      } else {
        // 第6次停顿刷时间
        //console.show();   
        toastLog("正在刷时长程序未停止");
        let shichang = random(330, 360);
        fClear();
        fInfo("开始刷时长，总共" + shichang + "秒");
        let wait_time = 1;
        for (let i = 0; i < shichang; i++) { //*random(55, 60)
          // 每15秒增加一次滑动防息屏
          if (i % 15 == 0) {
            swipe(device_w / 2, device_h * 0.6, device_w / 2, device_h * 0.6 - 100, 500);
            sleep(500);
          } else {
            sleep(1000);
          }
          //w.info.setText("已观看文章" + wait_time + "秒，总共" + shichang + "秒");
          fSet("info", "已观看文章" + wait_time + "秒，总共" + shichang + "秒\n");
          wait_time++;
        }
        fSet("info", "已结束文章时长");
        console.hide();
        back();
        break;
      }
    } else {
      wen_num -= 1;
    }
    back();
    //id("general_card_image_id").waitFor();
    // className("android.widget.ListView").scrollable().depth(17).waitFor();
    sleep(2000);
    while (!wen_box_slt.exists()) {
      //listview.scrollForward();
      swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1000);
      sleep(200);
    }
    wen_box = wen_box_slt.findOne();
    wen_num += 1;
  }
  // 更新已读文章库
  storage_user.put("old_wen_list", old_wen);
  sleep(3000);
  // 关闭音乐
  close_video();
  back();
  sleep(3000);
  // 返回积分页
  jifen_init();
  ran_sleep();
  return true;
}



/********每周答题*********/
//function do_meizhou() {
//   text("每周答题").findOne().parent().click();
//   fSet("title", "每周答题…");
//   fClear();
//   // 等待加载
//   textMatches(/.*月|发现新版本/).waitFor();
//   if (text("发现新版本").exists()) return fError("有弹窗无法每周答题，可使用旧版修改版本号版取消弹窗"), sleep(1000), text("取消").findOne().click(), sleep(1000), back(), text("我要答题").waitFor(),
//     sleep(1000), back(), ran_sleep(), !0;
//   let scoll = depth(21).scrollable().findOne();
//   // 下面是倒叙作答
//   if (meizhou_dao) {
//     fInfo("倒序查找未做题目");
//     //当出现已作答时，点击最后一个未作答
//     while (!text("已作答").exists()) {
//       scoll.scrollForward();
//       sleep(300);
//     }
//     var clt = text("未作答").find();
//     if (clt.empty()) return fInfo("每周答题全部已作答。"), ran_sleep(), back(), text("每周答题").waitFor(),
//       sleep(1000), back(), text("我要答题").waitFor(), sleep(1E3), back(), text("我的").waitFor(), ran_sleep(), !0;
//     var title = clt[clt.length - 1].parent().child(0).text();
//     fInfo(title + "开始作答");
//     clt[clt.length - 1].parent().click();
//     // 测试用
//     // text("已作答").findOnce(0).click();
//   }
//   // 下面是正序作答
//   else {
//     fInfo("正序查找未做题目");
//     // 找到未作答就停止滚动
//     let dixian_slt = text("您已经看到了我的底线").filter(function (w) {
//       log("底线：", w.bounds().top, device_h);
//       return w.bounds().top <= device_h - 30;
//     });
//     //while (true) { //测试用
//     while (!text("未作答").exists()) {
//       if (dixian_slt.exists()) return fInfo("每周答题全部已作答。"),
//         back(), text("每周答题").waitFor(), sleep(1000), back(), text("我要答题").waitFor(), sleep(1000), back(), text("我的").waitFor(), ran_sleep(), !0;
//       // 如果到底则设置倒序为true
//       scoll.scrollForward();
//       sleep(200);
//     }
//     title = text("未作答").findOne().parent().child(0).text();
//     fInfo(title + "开始作答");
//     text("未作答").findOne().parent().click();
//   }
//   // 等待加载
//   text("查看提示").waitFor();
//   // 获取右上题号，如1 /5
//   var tihao = className("android.view.View").depth(24).findOnce(1).text();
//   var num = Number(tihao[0]);
//   var sum = Number(tihao[tihao.length - 1]);
//   var substr = tihao.slice(1);
//   while (num <= sum) {
//     fClear();
//     fInfo("第" + num + "题");
//     // 等待加载
//     text(num + substr).waitFor();
//     num++;
//     do_exec("（每周）");
//     // 点击确定下一题
//     depth(20).text("确定").findOne().click();
//     ran_sleep();
//     // 如果题做错了重来
//     if (text("下一题").exists() || text("完成").exists()) {
//       //toastLog(title + "我无能为力啦，请手动作答吧");
//       fInfo("做错尝试重答");
//       text("答案解析").waitFor();
//       upload_wrong_exec("（每周）");
//       storage.put('dati_tiku', dati_tiku);
//       back();
//       text("退出").findOne().click();
//       ran_sleep();
//       back();
//       text("每周答题").waitFor();
//       ran_sleep();
//       return false;
//     }
//   }
//   // 循环结束完成答题
//   text("返回").findOne().click();
//   sleep(1000);
//   back();
//   text("每周答题").waitFor();
//   sleep(1000);
//   back();
//   text("我要答题").waitFor();
//   sleep(1000);
//   back();
//   text("我的").waitFor();
//   ran_sleep();
//   return true;
// //}

// /********专项答题*********/
// /*专项答题中提示的层次与每日每周的不一样
//  * 专项答题出现的倒计时会影响22,23层的结构*/
function do_zhuanxiang() {
  let zhuanxiang_d = text("专项答题").findOne(4000);
  if (zhuanxiang_d != null) zhuanxiang_d.parent().click()
  else {
    var textOrder = text("排行榜").findOnce().parent();
    while (text("排行榜").exists()) {
      console.info("点击专项答题");
      textOrder.child(4).click();
      sleep(random(700, 1500));
      sleep(1000);
    }
  }
  fInfo('专项答题开始')
  fSet("title", "专项答题…");
  fClear();
  // 等待加载
  depth(10).waitFor();
  ran_sleep();
  let scoll = className("android.view.View").scrollable(true).findOne()
  fInfo('111111111111111')
  //let new_tihao = [];
  // 下面是倒序答题
  if (zhuanxiang_dao) {
    // 当出现已满分时，点击最后一个开始答题
    while (!text("已满分").exists()) {
      scoll.scrollForward();
      // 不加延迟会很卡
      sleep(200);
    }
    
    var clt = textMatches(/继续答题|开始答题|重新答题/).find();
    if (clt.empty()) {
      fInfo("专项答题全部已作答。");
      back();
      text("登录").waitFor();
      ran_sleep();
      return true;
    }
    // 点击最后一项
    clt[clt.length - 1].click();
  }
  // 下面是正序
  else {
    // 直到找到开始答题
    let dixian_slt = text("您已经看到了我的底线").filter(function (w) {
      return w.bounds().top <= device_h - 30;
    });
    //while (true) { //测试用
    while (!textMatches(/继续答题|开始答题|重新答题/).exists()) { //开始答题
      // 如果到底则设置倒序为true
      if (dixian_slt.exists()) {
        //storage_user.put('zhuanxiang_dao', true); 自定义不用读取
        fInfo("专项答题全部已作答。");
        back();
        text("登录").waitFor();
        ran_sleep();
        return true;
      }
      // 滚动20次
      for (i = 0; i < 15; i++) {
        scoll.scrollForward();
        // 不加延迟会很卡
        sleep(500);
      }
    }
    fInfo('开始答题')
    textMatches(/继续答题|开始答题|重新答题/).findOne().click();
  }
  ran_sleep();
  // 等待加载
  text("查看提示").waitFor();
  sleep(2000);
  // 获取右上题号，如1 /5
  var tihao = className("android.view.View").depth(24).findOnce(1).text();
  log(tihao)
  sleep(100000)
  // 需要加个斜杠转义
  let reg = /(\d+) \/(\d+)/;
  var num = Number(tihao.match(reg)[1]);
  var sum = Number(tihao.match(reg)[2]);
  var substr = " /" + sum;
  log(tihao);
  while (num <= sum) {
    fClear();
    fInfo("第" + num + "题");
    // 等待加载
    text(num + substr).waitFor();
    num++;
    do_exec();
    // 点击确定下一题
    let next = className("android.view.View").filter(function (l) {
      return (l.text() == "下一题") || (l.text() == "完成");
    });
    next.findOne().click();
    //     if (!click("下一题")) {
    //       click("完成");
    //     }
    ran_sleep();
  }
  // 循环结束完成答题
  text("查看解析").waitFor();
  sleep(1000);
  // 如果题目答错，循环每一题并添加错题
  if (textMatches(/\d+分/).findOne().text() != "100分") {
    fInfo("有错题，尝试上传错题");
    text("查看解析").findOne().click();
    tihao = textMatches(reg).findOne().text();
    num = Number(tihao.match(reg)[1]);
    sum = Number(tihao.match(reg)[2]);
    substr = " /" + sum;
    //log(tihao);
    sleep(1500);
    while (num <= sum) {
      // 等待加载
      text(num + substr).waitFor();
      num++;
      if (textEndsWith("回答错误").exists()) {
        upload_wrong_exec();
      }
      // 点击确定下一题
      let next = className("android.view.View").filter(function (l) {
        return (l.text() == "下一题") || (l.text() == "完成");
      });
      next.findOne().click();
      sleep(random(1000, 1500));
    }
    storage.put('dati_tiku', dati_tiku);
  }
  else {
    back();
    ran_sleep();
  }
  back();
  sleep(300);
  back();
  sleep(300);
  back();
  sleep(300);
  log('回到首页')
  ran_sleep();
  return true;
}




/********每日答题*********/
function do_meiri() {
  entry_jifen_project("每日答题");
  fSet("title", "每日答题…");
  fClear();
  // 等待加载
  text("查看提示").waitFor();
  // 获取右上题号，如1 /5
  var tihao = className("android.view.View").depth(11).findOnce(1).text();
  var num = Number(tihao[0]);
  var sum = Number(tihao[tihao.length - 1]);
  var substr = tihao.slice(1);
  while (num <= sum) {
    fClear();
    fInfo("第" + num + "题");
    // 等待加载
    text(num + substr).waitFor();
    num++;
    // 如果是视频题则重新开始
    if (className("android.widget.Image").exists()) {
      num = 1;
      restart(0);
      continue;
    }
    do_exec();
    // 点击确定下一题
    depth(7).text("确定").findOne().click();
    ran_sleep();
    // 如果题做错了重来
    if (text("下一题").exists() || text("完成").exists()) {
      fInfo("答错重试");
      num = 1;
      restart(0);
      continue;
    }
  }
  // 循环结束完成答题
  text("返回").findOne().click();
  text("登录").waitFor();
  ran_sleep();
  return true;
}


/********挑战答题*********/
function do_tiaozhan() {
  //entry_jifen_project("挑战答题");
  if (ddtong) {
    fSet("title", "挑战(dd通)…");
  } else {
    fSet("title", "挑战答题…");
  }
  fClear();
  // 等待加载、积分页面也有Image和List，需要用depth筛选
  className("android.widget.Image").textMatches(/total.*|chanllenge.*/).waitFor();
  if (textStartsWith("total").exists()) {
    var a = !0,
      b = className("android.widget.Image").textStartsWith("total").findOne().parent();
    ran_sleep();
    // do b.click(), sleep(500); while (textStartsWith("total").exists());
    b.click();
    className("android.widget.Image").textStartsWith("chanllenge").waitFor()
  }
  var total = 0, max_total = random(3, 5);
  for (ddtong && (max_total += 10); ;) {
    fClear();
    fInfo("今日挑战随机答" + max_total + "题");
    fInfo("第" + (total + 1) + "题");
    className("android.widget.ListView").waitFor();
    ran_sleep();
    try {
      // 等待选项列表
      var xuan_list = className("android.widget.ListView").findOne().children();
      // 获取题目
      var que_txt = className("android.widget.ListView").findOne().parent().child(0).text();
      //log(que_txt);
    } catch (p) {
      log("error1:", p);
      sleep(500);
      continue;
    }
    // 获取答案列表，可能找到多个答案
    // let ans_list = get_ans_by_http(que_txt.replace(/来源：.*|出题单位：.+/, ""));
    let ans_list = get_ans_by_tiku(que_txt.replace(/[^\u4e00-\u9fa5\d]/g, ""));
    //     fInfo(que_txt.replace(/[^\u4e00-\u9fa5\d]|来源：.+|出题单位：.+/g, ""));
    //log("答案："+ans_list);
    if (total >= max_total) {
      // 题数数够了随便选
      fInfo("已答对" + max_total + "题，全选A");
      xuan_list[0].child(0).click();
    } else if (ans_list.length != 0) {
      let max_simi = 0;
      let xuanxiang = null;
      // 循环对比所有选项和答案，选出相似度最大的
      for (let xuan_box of xuan_list) {
        let xuan_txt = xuan_box.child(0).child(1).text();
        //log(xuan_txt);
        for (let ans of ans_list) {
          let similar = str_similar(ans, xuan_txt);
          //log(xuan_txt, similar);
          if (similar > max_simi) {
            max_simi = similar;
            xuanxiang = xuan_box.child(0);
          }
        }
      }
      if (xuanxiang != null) {
        fInfo("最终：" + xuanxiang.child(1).text());
        xuanxiang.click();
      } else {
        fInfo("无匹配答案");
        xuan_list[0].child(0).click();
      }
    }
    // 如果没找到答案
    else {
      fInfo("未找到答案");
      // 选第一个选项
      xuan_list[0].child(0).click();
    }
    sleep(2500);
    // 判断题是否答错
    if (text("结束本局").exists()) {
      sleep(5000);
      click("结束本局");
      text("再来一局").waitFor();
      if (total < max_total) {
        fInfo("答错重试");
        console.warn("warn:", que_txt);
        text("再来一局").findOne().click();
      } else {
        // 退出
        a && (back(), textStartsWith("total").waitFor(), sleep(2000)), back(),
          text("登录").waitFor();
        ran_sleep();
        return true;
      }
      total = 0;
      sleep(2000);
      continue;
    }
    // 没答错总数加1
    total += 1;
  }
}

/********双人、四人赛*********/
function do_duizhan1(renshu) {
  //   jifen_list = refind_jifen();
  fClear();
  if (renshu == 2) {
    // 点击进入双人对战
    //  entry_jifen_project("双人对战");
    fSet("title", "双人对战");
    fInfo("等待随机匹配");
    text("随机匹配").waitFor();
    sleep(1000);
    let match = text("随机匹配").findOne().parent().child(0);
    do {
      fInfo("点击：" + match.click());
      sleep(500);
    } while (text("随机匹配").exists());
  } else if (4 == renshu || 0 == renshu) {
    // 点击进入四人赛
    //entry_jifen_project("四人赛");
    fSet("title", "四人赛");
    // 等待开始比赛并点击
    fInfo("等待开始比赛");
    text("开始比赛").waitFor();
    sleep(1000);
    let start_click = text("开始比赛").findOne().click();
    fInfo("点击：" + start_click);
  }
  if (duizhan_mode == 1) {
    ui.run(function () {
      let title = w.title.getText();
      w.title.setText(title + "(手动)");
      toastLog("请手动点击答案");
    });
  }
  //text("开始").findOne(1000);
  className("android.widget.ListView").waitFor();
  fClear();

  let num = 1;
  let err_flag = true;
  while (true) {
    // 如果是第一题或者下面出错，则跳过前面等待过渡
    if (num != 1 && err_flag) {
      // 检查到其中一个过渡界面为止
      while (true) {
        // 检测是否结束并退出
        if (text("继续挑战").exists()) {
          sleep(1000);
          let tz_click = text("继续挑战").findOne().click();
          fInfo("点击继续挑战:" + tz_click);
          sleep(1500);
          back();
          if (renshu == 2) {
            sleep(1000);
            fInfo("查找退出按钮");
            if (fast_mode) {
              winReshow();
            }
            var exit_click = text("退出").findOne().click();
            fInfo("点击退出:" + exit_click);
          }
          sleep(1000);
          text("登录").waitFor();
          ran_sleep();
          return true;
        } else if (text("第" + num + "题").exists()) {
          fClear();
          fInfo("第" + num + "题");
          break;
        }
      }
      // 直到过渡界面消失，再匹配下一题
      while (text("第" + num + "题").exists()) { } //sleep(100);
      //fTips("题号过渡消失");
    } else if (!err_flag) {
      err_flag = true;
      if (text("继续挑战").exists()) {
        sleep(1000);
        let tz_click = text("继续挑战").findOne().click();
        fInfo("点击继续挑战:" + tz_click);
        sleep(1500);
        back();
        if (renshu == 2) {
          sleep(1000);
          fInfo("查找退出按钮");
          if (fast_mode) {
            winReshow();
          }
          var exit_click = text("退出").findOne().click();
          fInfo("点击退出:" + exit_click);
        }
        sleep(1000);
        text("登录").waitFor();
        ran_sleep();
        return true;
      }
    }
    let listview = className("android.widget.ListView").findOne(1000);
    if (!listview) {
      log("找不到listview");
      err_flag = false;
      sleep(200);
      continue;
    }
    sleep(100); // 追求极限速度，不知道会不会出错
    let view_d28 = className("android.view.View").depth(15).indexInParent(0).findOne(1000);
    log('1111')
    log(view_d28)
    log('2222')
    if (!view_d28) {
      toastLog("找不到view_d28");
      err_flag = false;
      sleep(200);
      continue;
    }
    // 根据父框的孩子数
    if (view_d28.childCount() > 0) {
      que_x = view_d28.bounds().left;
      que_y = view_d28.bounds().top;
      que_w = view_d28.bounds().width();
      if (view_d28.child(0).text().length <= 4) { //有来源的是前面两个空格元素，文本为4个空格
        que_h = view_d28.child(2).bounds().top - view_d28.bounds().top;
      } else { //无来源的是题目，文本为8个空格
        que_h = view_d28.child(0).bounds().bottom - view_d28.bounds().top;
      }
    } else {
      toastLog("找不到框体");
      log(view_d28.childCount(), view_d28.bounds());
      err_flag = false;
      sleep(200);
      continue;
    }
    // 查找选项个数
    var radio_num = className("android.widget.RadioButton").find().length;
    if (!radio_num) {
      log("找不到选项");
      err_flag = false;
      sleep(200);
      continue;
    }
    //fTips("开始识别题目");
    for (let i = 0; i < 1; i++) {
      let img = captureScreen();
      // 裁剪题干区域，识别题干
      let que_img = images.clip(img, que_x, que_y, que_w, que_h);
      console.log(que_x, que_y, que_w, que_h);
      if (que_h < 32) {
        images.save(que_img, '/sdcard/跑题库/que_img' + num + '.png');
        images.save(img, '/sdcard/跑题库/img' + num + '.png');
        img.recycle();
        que_img.recycle();
        console.error("题目长度不够32");
        continue;
      }
      //images.save(que_img, '/sdcard/1/que_img' + num + '.png');
      //       console.time('题目识别1');
      //       let results = ocr.recognize(que_img).results;
      //       var que_txt = ocr_rslt_to_txt(results).replace(/[^\u4e00-\u9fa5\d]|^\d{1,2}\.?/g, "");
      //       console.timeEnd('题目识别1');
      // 为了适配OCR插件改为下面这句
      console.time('题目识别');
      var que_txt = google_ocr_api(que_img).replace(/[^\u4e00-\u9fa5\d]|\d{1,2}\./g, "");//使用正则表达式将｜两侧的格式进行清理，左侧是指匹配所有汉字和数字然后取反，右侧是匹配数字1或2后面带点的，全部替换为空字符串
      console.timeEnd('题目识别');
      if (que_txt) {
        fInfo("题目识别：" + que_txt);
        img.recycle();
        que_img.recycle();
        break
      } else {
        fError("联系群主安装限制截图模块");
        img.recycle();
        que_img.recycle();
      }
    }
    if (renshu == 0) {
      fInfo("由于第一局匹配对手较强，正在挂机中。");
      fInfo("经测试挂机不会扣积分局数，此功能可在配置中关闭");
      fTips("请不要点击任何选项，不要作答！！！");
      num++;
      text("继续挑战").waitFor();
      continue;
    }
    // 选项清洗标识
    var replace_sign = "default_ocr_replace";
    let question_reg = new RegExp(update_info["question_reg"], "gi");//update_info是从网上下载的info中转信息
    let include_reg = new RegExp(update_info["include_reg"], "gi");
    var que_key = null;
    if (que_key = question_reg.exec(que_txt)) {
      replace_sign = "other_ocr_replace";
    } else if (que_key = (/读音|词形/g).exec(que_txt)) {
      replace_sign = "accent_ocr_replace";
    } else if (que_key = include_reg.exec(que_txt)) {
      replace_sign = "include_ocr_replace";
    }

    let ans_list = get_ans_by_tiku(que_txt);
    //log(ans_list);
    let idx_dict = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3
    };

    // 如果上面答案不唯一或者不包含找到的选项，直到选项完全出现在屏幕
    try {
      while (className("android.widget.ListView").findOne(1000).indexInParent() == 0) { }
      //fTips("选项显现");
    } catch (e) {
      log("error2:", e);
      err_flag = false;
      sleep(200);
      continue;
    }
    let xuanxiang_list = className("android.widget.ListView").findOne(1000);
    let xuanxiang_index = xuanxiang_list.indexInParent();
    let xuanxiang_list_x = xuanxiang_list.bounds().left;
    let xuanxiang_list_y = xuanxiang_list.bounds().top;
    let xuanxiang_list_w = xuanxiang_list.bounds().width();
    let xuanxiang_list_h = xuanxiang_list.bounds().height();

    if (!xuanxiang_list || !xuanxiang_list.parent().childCount() || !xuanxiang_list.parent().child(0)) {
      log("xuan_box is null");
      err_flag = false;
      sleep(200);
      continue;
    }
    log("开始截选项");
    console.time("选项识别");
    img = captureScreen();
    // 裁剪所有选项区域
    img = images.clip(img, xuanxiang_list_x, xuanxiang_list_y, xuanxiang_list_w, xuanxiang_list_h);
    //images.save(allx_img, '/sdcard/1/x_img' + num + '.png');
    let xuan_txt_list = [];
    let allx_txt = "";
    if (ocr_choice == 0) {
      // 排序顺序
      //     console.time('选项识别1');
      let x_results = JSON.parse(JSON.stringify(gmlkit.ocr(img, "zh").toArray(3)));
      allx_txt = ocr_rslt_to_txt(x_results).replace(/\s+/g, "");
      //     console.timeEnd('选项识别1');
    } else if (ocr_choice == 1) {
      let x_results = JSON.parse(JSON.stringify(paddle.ocr(img)));
      allx_txt = ocr_rslt_to_txt(x_results).replace(/\s+/g, "");
    } else {
      //     // 直接识别
      //     console.time('选项识别2');
      allx_txt = ocr.recognizeText(img);
      //     console.timeEnd('选项识别2');
    }
    console.timeEnd("选项识别");
    // log(allx_txt);
    if (!allx_txt) {
      log("识别不出选项文本，可能被禁止截图");
      err_flag = false;
      sleep(200);
      continue;
    }
    img.recycle();
    // 清洗选项文本
    log("replace_sign:" + replace_sign);
    log("清洗前：" + allx_txt);
    let replace_d = update_info[replace_sign];
    if (replace_sign == "include_ocr_replace") {
      let result = true;
      log("que_key:" + que_key);
      let [words, r, repl] = replace_d[que_key];
      for (let word of words) {
        let reg = new RegExp(word, "gi");
        if (!reg.test(allx_txt)) {
          result = false;
          break;
        }
      }
      if (result) {
        let reg = new RegExp(r, "gi");
        allx_txt = allx_txt.replace(reg, repl);
      }
    } else {
      for (let r of Object.keys(replace_d)) {
        let reg = new RegExp(r, "gi");
        allx_txt = allx_txt.replace(reg, replace_d[r]);
      }
    }
    // allx_txt.replace(/令媛/g, "令嫒");
    // 获取选项列表
    xuan_txt_list = allx_txt.match(/[a-d][^a-z\u4e00-\u9fa5\d]?\s*.*?(?=[a-d][^a-z\u4e00-\u9fa5\d]?|$)/gi);
    if (!xuan_txt_list) {
      log("识别不出选项");
      err_flag = false;
      sleep(200);
      continue;
    }
    if (xuan_txt_list && xuan_txt_list.length != radio_num) {
      xuan_txt_list = allx_txt.match(/[a-d][^a-z\u4e00-\u9fa5\d]\s*.*?(?=[a-d][^a-z\u4e00-\u9fa5\d]|$)/gi);
    }
    log(xuan_txt_list.toString());

    if (xuan_txt_list.length != 0) {
      let max_simi = 0;
      let right_xuan = '';
      let right_xuan2 = '';
      let ans_txt = '';
      for (let xuan_txt of xuan_txt_list) {
        let txt = xuan_txt.replace(/^[A-Z]\.?\,?/gi, "");
        for (let ans of ans_list) {
          let similar = str_similar(ans, txt);
          if (similar > max_simi) {
            max_simi = similar;
            ans_txt = ans;
            // if (duizhan_mode == 1) {
            //   // 答案默认顺序优先
            //   right_xuan = ans[0];
            //   right_xuan2 = xuan_txt[0].toUpperCase();
            // } else {
            // 文本匹配优先
            right_xuan2 = ans[0];
            right_xuan = xuan_txt[0].toUpperCase();
            // }
          }
        }
      }
      if (ans_list.length > 1) {
        fTips("匹配答案:" + ans_txt);
      }
      if (right_xuan != '' && duizhan_mode != 1) {
        let idx = idx_dict[right_xuan];
        fInfo("最终:" + right_xuan);
        try {
          className("android.widget.RadioButton").findOnce(idx).parent().click();
        } catch (e) {
          idx = idx_dict[right_xuan2];
          fInfo("备选:" + right_xuan2);
          try {
            className("android.widget.RadioButton").findOnce(idx).parent().click();
          } catch (e1) {
            log("error3:", e1);
            err_flag = false;
            sleep(200);
            continue;
          }
        }
        //log(a);
      } else if (duizhan_mode == 1) {
        textMatches(/第.+题|继续挑战/).waitFor();
      } else {
        try {
          className("android.widget.RadioButton").findOnce().parent().click();
          fError("识别不出选项，盲选A");
        } catch (e1) {
          log("error4:", e1);
          err_flag = false;
          sleep(200);
          continue;
        }
      }
    } else {
      fError("未识别出选项，随机选择");
      className("android.widget.RadioButton").findOnce(random(0, radio_num - 1)).parent().click();
      err_flag = false;
      continue;
    }
    num++;
  }
}

// 对战答错版
function dacuo(renshu) {
  //jifen_list = refind_jifen();
  fClear();
  if (renshu == 2) {
    // 点击进入双人对战
    //entry_jifen_project("双人对战");
    text("随机匹配").waitFor();
    sleep(1000);
    text("随机匹配").findOne().parent().child(0).click();
  } else if (renshu == 4) {
    // 点击进入四人赛
    //entry_jifen_project("四人赛");
    // 等待开始比赛并点击
    fInfo("等待开始比赛");
    sleep(1000);
    let start_click = text("开始比赛").findOne().click();
    log("点击：" + start_click);
  }
  //fInfo("等待开始过渡");
  //text("开始").findOne(1000);
  className("android.widget.ListView").waitFor();
  let num = 1;
  let err_flag = true;
  while (true) {
    // 如果是第一题或者下面出错，则跳过前面等待过渡
    if (num != 1 && err_flag) {
      // 检查到其中一个过渡界面为止
      while (true) {
        // 检测是否结束并退出
        if (text("继续挑战").exists()) {
          fInfo("本轮结束");
          sleep(1000);
          text("继续挑战").findOne().click();
          sleep(1500);
          back();
          if (renshu == 2) {
            text("退出").findOne().click();
          }
          text("登录").waitFor();
          ran_sleep();
          fClear();
          return true;
        } else if (text("第" + num + "题").exists()) {
          break;
        }
      }
      // 直到过渡界面消失，再匹配下一题
      //log("等待题号过渡");
      while (text("第" + num + "题").exists()) { } //sleep(100);
    } else if (!err_flag) {
      err_flag = true;
      if (text("继续挑战").exists()) {
        fInfo("本轮结束");
        sleep(1000);
        text("继续挑战").findOne().click();
        sleep(1500);
        back();
        if (renshu == 2) {
          text("退出").findOne().click();
        }
        text("登录").waitFor();
        ran_sleep();
        return true;
      }
    }
    //log("开始第"+num+"题，等待listview");
    //className("android.widget.ListView").waitFor();
    let listview = className("android.widget.ListView").findOne(1000);
    if (!listview) {
      //log("找不到listview");
      err_flag = false;
      sleep(200);
      continue;
    }
    sleep(100); // 追求极限速度，不知道会不会出错
    //log("find view_d28");
    // listview父框体
    let view_d28 = className("android.view.View").depth(15).indexInParent(0).findOne(1000);
    if (!view_d28) {
      //log("找不到view_d28");
      //log('far:', listview.parent());
      //log('garfa', listview.parent().parent());
      err_flag = false;
      sleep(200);
      continue;
    }
    if (view_d28.childCount() > 0) {
      que_x = view_d28.bounds().left;
      que_y = view_d28.bounds().top;
      que_w = view_d28.bounds().width();
      que_h = view_d28.child(0).bounds().bottom - view_d28.bounds().top;
    } else {
      toastLog("找不到框体内容");
      //log(view_d28.childCount(), view_d28.bounds());
      err_flag = false;
      sleep(200);
      continue;
    }
    let idx_dict = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3
    };
    try { //防止别人先答完出错
      while (className("android.widget.ListView").findOne(1000).indexInParent() == 0) { }
      sleep(random(2000, 3000));
      //log("选项显现");
      className("android.widget.RadioButton").findOnce(random(0, 3)).parent().click();
      num++;
      continue;
    } catch (e) {
      //log("error1:", e);
      err_flag = false;
      sleep(200);
      continue;
    }
    num++;
  }
}

/********订阅*********/
// function do_dingyue() {
//   entry_jifen_project("订阅");
//   fSet("title", "订阅…");
//   fClear();
//   let tab1 = descContains("Tab").findOne(9000);
//   if (!tab1) {
//     back();
//     text("登录").waitFor();
//     return false
//   }
//   let zuo1 = descContains("上新").findOne(9000);
//   if (!zuo1) {
//     back();
//     text("登录").waitFor();
//     return false
//   }
//   // 上方标签
//   let tab_clt = descContains("Tab").untilFind();
//   let total_click = 0;
//   for (let tab of tab_clt) {
//     tab.click();
//     sleep(500);
//     // 左方分类
//     let zuo_clt = className("android.view.View").depth(14).findOne().children();
//     for (let zuo of zuo_clt) {
//       if (dingyue_dao) {
//         zuo = zuo_clt[zuo_clt.length - 1];
//       }
//       zuo.click();
//       sleep(500);
//       // 右方列表
//       className("android.view.View").depth(14).waitFor();
//       let you_clt = className("android.view.View").depth(14).findOnce(1);
//       let last_desc = "";
//       while (you_clt) {
//         //let img = captureScreen();
//         // 订阅按钮集合
//         //fInfo("查找订阅集合");
//         let dingyue_clt = className("android.widget.ImageView").indexInParent(2).untilFind();
//         try {
//           //fInfo(dingyue_clt[dingyue_clt.length-1].parent().child(1).desc().slice(0,4)+" 旧:"+last_desc.slice(0,4));
//           if (dingyue_clt[dingyue_clt.length - 1].parent().child(1).desc() == last_desc) {
//             fClear();
//             fInfo("到底了");
//             break;
//           }
//           // 最底下订阅的名称
//           last_desc = dingyue_clt[dingyue_clt.length - 1].parent().child(1).desc();
//         } catch (e) {
//           log(e);
//           continue;
//         }
//         let img = captureScreen();
//         for (let dingyue of dingyue_clt) {
//           if (dingyue.bounds().bottom >= device_h) {
//             continue;
//           }
//           try {
//             var pot = findColorInRegion(img, "#E42417", dingyue.bounds().left, dingyue.bounds().top,
//               dingyue.bounds().width(), dingyue.bounds().height(), 30);
//           } catch (e) {
//             console.error(dingyue.bounds());
//             console.error(dingyue.parent().child(1).desc());
//           }
//           //if (pot && dingyue.bounds().bottom < device_h) {
//           if (pot) {
//             fInfo("找到一个订阅");
//             sleep(1000);
//             let is_click = dingyue.click();
//             fInfo("点击：" + is_click);
//             //click(dingyue.bounds().centerX(), dingyue.bounds().centerY());
//             sleep(1000);
//             //click(pot.x, pot.y+5);
//             total_click += 1;
//           }
//           if (total_click >= 2) {
//             fInfo("订阅已完成");
//             back();
//             text("登录").waitFor();
//             ran_sleep();
//             return true;
//           }
//         }
//         //img.recycle();
//         let scr_result = you_clt.scrollForward();
//         sleep(500);
//         //         swipe(device_w*0.6, device_h*0.8, device_w*0.6, device_h*0.3, 800);
//         //         while (desc("加载中").exists()) { sleep(1000); }
//       }
//       if (dingyue_dao) {
//         fInfo("只检查年度上新");
//         break;
//       }
//     }
//     //sleep(1000);
//   }
//   fInfo("无可订阅项目");
//   back();
//   text("登录").waitFor();
//   ran_sleep();
//   return true;
// }




function do_dingyue() {
   entry_jifen_project("订阅");
  // entry_model(jifen_map["订阅"]);
   fSet("title", "订阅…");
   fClear();
   fInfo("设置订阅");
   fRefocus()
     h = device_h; //屏幕高
     w = device_w; //屏幕宽
     x = (w / 3) * 2;
     h1 = (h / 10) * 9;
     h2 = (h / 12); 
     let total_click = 0;
     if (dingyue_dao) {
       w = fInit();
         // fSet("title", "搜索‘上新/2024年上线’订阅…");
          fClear();
          fInfo("上新/2024年上线--搜索中……");
          var t_1 = 468;
          var t_2 = 1199;
          var arr = [2, 6];
        }else{
         w = fInit();
       // fSet("title", "搜索‘强国号’订阅…");
        fClear();
        fInfo("强国号’-- 遍历搜索中………");
        var t_1 = 318;
        var t_2 = 150;
      var arr = [4, 3, 10, 35, 38, 4, 45, 44, 4, 1];
         }
   for (let i = 0; i < arr.length + 1; i++) {
     var asub_1 = parseInt(arr[i]);
     sleep(random(400, 800)); 
     press(136,t_1,100) ;
     sleep(random(800, 1500));
    
         for (let ii = 0; ii < asub_1; ii++) {
           while (total_click < 2 && asub_1 != 0) {
           while(total_click < 2){
             sleep(random(500, 1000)); 
             let img = captureScreen();
           sleep(random(300, 500));
           try {
             var pot = findColorInRegion(img, "#E42417", 1000, 100,
             device.width - 1000, device.height - 200, 30);
           } catch (e) {
             console.error('继续搜寻');
             continue;
           }
         if(pot) {
             //fInfo("找到新订阅");
             sleep(random(800, 1500)); 
             // let is_click = dingyue.click();
             fInfo("找到并准备点击：订阅");
             //click(dingyue.bounds().centerX(), dingyue.bounds().centerY());
             sleep(random(800, 1500)); 
             click(pot.x, pot.y+5);
             fInfo("点击坐标 (" + pot.x + "," + (pot.y+5) + ")");
             fInfo("完成第 " + (total_click + 1) + " 订阅");
             total_click += 1;
              img.recycle();
              sleep(random(800, 1500));
           }else {
              img.recycle();
             break;
               }
         }
           if (total_click == 2) {
            
            // w = fInit();
             fInfo("订阅已完成,准备返回");
             back();
             text("登录").waitFor();
             ran_sleep();
             return true;
             } else { 
            //   img.recycle();
               swipe(x+random(-5, 5), h1+random(-2, 8), x + random(-4, 6), h2+random(-2, 7), random(800, 1200)); // 下滑动
               toastLog("下滑搜索中……");
               //fInfo("下滑搜索中……");
               asub_1--;
           sleep(random(800, 1500)); 
                    }
         }
         //img.recycle();
         sleep(500);
         }
         t_1 += t_2;
     }
       if(total_click < 2 && dingyue_dao){
       fClear();
          fInfo("继续地方-上新/2024年上线-搜索……");
          press(670,167,100) ;
          sleep(random(600, 1000));
          var t_1 = 468;
          var t_2 = 449;
          var arr = [1, 2];
          for (let i = 0; i < arr.length + 1; i++) {
           var asub_1 = parseInt(arr[i]);
           sleep(random(400, 800)); 
           press(136,t_1,100) ;
           sleep(random(800, 1500));
               for (let ii = 0; ii < asub_1; ii++) {
                 while (total_click < 2 && asub_1 != 0) {
                   while(total_click < 2){
                 sleep(random(500, 1000)); 
                 let img = captureScreen();
                 sleep(random(300, 500));
                 try {
                   var pot = findColorInRegion(img, "#E42417", 1000, 100,
                   device.width - 1000, device.height - 200, 30);
                 } catch (e) {
                   console.error('继续搜寻');
                   continue;
                 }
                 if (pot) {
                  // fInfo("找到一个订阅");
                   sleep(random(800, 1500)); 
                   // let is_click = dingyue.click();
                   fInfo("找到并准备点击：订阅");
                   //click(dingyue.bounds().centerX(), dingyue.bounds().centerY());
                   sleep(random(800, 1500)); 
                   click(pot.x, pot.y+5);
                   fInfo("点击坐标 (" + pot.x + "," + (pot.y+5) + ")");
                   fInfo("完成第 " + (total_click + 1) + " 订阅"); 
                   total_click += 1;
                  // sleep(random(800, 1500));
                    img.recycle();
                    sleep(random(800, 1500));
                 }else{
                   img.recycle();
                   break;
                 }
                 }
                 if (total_click == 2) {
                  // img.recycle();
                  // w = fInit();
                   fInfo("订阅已完成,准备返回");
                   back();
                   text("登录").waitFor();
                   ran_sleep();
                   return true;
                   } else { 
                  //   img.recycle();
                     swipe(x+random(-5, 5), h1+random(-3, 3), x+random(-2, 5), h2+random(-3, 7), random(800, 1200)); // 下滑动
                     toastLog("下滑搜索中……");
                     asub_1--;
                 sleep(random(800, 1500)); 
                          }
               }
               //img.recycle();
               sleep(500);
               }
               t_1 += t_2;
           }
       }
 
 
     if (total_click == 0) fError("无新可订阅项目");
     if (total_click == 1) fTips("此次仅发现1个可订阅项目");
     back();
     text("登录").waitFor();
     ran_sleep();
     return true;
    }
 
 /********订阅*********/
 function do_dingyue_0() {
  // entry_jifen_project("订阅");
   entry_model(jifen_map["订阅"]);
   fSet("title", "订阅…");
   fClear();
   let tab1 = descContains("Tab").findOne(9000);
   if (!tab1) {
     back();
     text("登录").waitFor();
     return false
   }
   let zuo1 = descContains("上新").findOne(9000);
   if (!zuo1) {
     back();
     text("登录").waitFor();
     return false
   }
   // 上方标签
   let tab_clt = descContains("Tab").untilFind();
   var total_click = 0;
   for (let tab of tab_clt) {
     tab.click();
     sleep(500);
     // 左方分类
     let zuo_clt = className("android.view.View").depth(14).findOne().children();
     for (let zuo of zuo_clt) {
       if (dingyue_dao) {
         zuo = zuo_clt[zuo_clt.length - 1];
       }
       zuo.click();
       sleep(500);
       // 右方列表
       className("android.view.View").depth(14).waitFor();
       let you_clt = className("android.view.View").depth(14).findOnce(1);
       let last_desc = "";
       while (you_clt) {
         //let img = captureScreen();
         // 订阅按钮集合
         //fInfo("查找订阅集合");
         let dingyue_clt = className("android.widget.ImageView").indexInParent(2).untilFind();
         try {
           //fInfo(dingyue_clt[dingyue_clt.length-1].parent().child(1).desc().slice(0,4)+" 旧:"+last_desc.slice(0,4));
           if (dingyue_clt[dingyue_clt.length - 1].parent().child(1).desc() == last_desc) {
             fClear();
             fInfo("到底了");
             break;
           }
           // 最底下订阅的名称
           last_desc = dingyue_clt[dingyue_clt.length - 1].parent().child(1).desc();
         } catch (e) {
           log(e);
           continue;
         }
         let img = captureScreen();
         for (let dingyue of dingyue_clt) {
           if (dingyue.bounds().bottom >= device_h) {
             continue;
           }
           try {
             var pot = findColorInRegion(img, "#E42417", dingyue.bounds().left, dingyue.bounds().top,
               dingyue.bounds().width(), dingyue.bounds().height(), 30);
           } catch (e) {
             console.error(dingyue.bounds());
             console.error(dingyue.parent().child(1).desc());
           }
           //if (pot && dingyue.bounds().bottom < device_h) {
           if (pot) {
             fInfo("找到一个订阅");
             sleep(1000);
             let is_click = dingyue.click();
             fInfo("点击：" + is_click);
             //click(dingyue.bounds().centerX(), dingyue.bounds().centerY());
             sleep(1000);
             //click(pot.x, pot.y+5);
             total_click += 1;
           }
           if (total_click >= 2) {
             fInfo("订阅已完成");
             back();
             text("登录").waitFor();
             ran_sleep();
             return true;
           }
         }
         //img.recycle();
         let scr_result = you_clt.scrollForward();
         sleep(500);
         //         swipe(device_w*0.6, device_h*0.8, device_w*0.6, device_h*0.3, 800);
         //         while (desc("加载中").exists()) { sleep(1000); }
       }
       if (dingyue_dao) {
         fInfo("只检查年度上新");
         break;
       }
     }
     //sleep(1000);
   }
   fInfo("无可订阅项目");
   back();
   text("登录").waitFor();
   ran_sleep();
   return true;
 }


/*********本地*********/
function do_bendi() {
  entry_jifen_project("本地频道");
  fSet("title", "本地…");
  fClear();
  text("切换地区").findOne(5000);
  if (text("立即切换").exists()) {
    text("取消").findOne(3000).click();
  }
  // //let banner = className("android.support.v7.widget.RecyclerView").findOne();
  // let banner = classNameContains("RecyclerView").findOne();
  // banner.findOne(text("北京学习平台"));
  // //let txt = banner.child(0).child(1).text();
  // banner.child(0).click();
  clickSel(className("android.widget.TextView").text('北京学习平台'));  
  sleep(1500);
  back();
  ran_sleep();
  jifen_init();
  ran_sleep();
  return true;
}
/**************************************上方为执行各项目函数*********************************************/



// 做一次题
function do_exec(type) {
  // 等待加载
  let tishi = text("查看提示").findOne();
  //log(tishi);
  // 点击查看提示按钮
  tishi.click();
  // 随机延迟、等待提示
  ran_sleep();
  // 等待加载
  text("提示").waitFor();
  // 判断题型
  /******************单选题*******************/
  if (textStartsWith("单选题").exists()) {
    // 获取题目
    let que_txt = className("android.view.View").depth(10).findOnce(1).text();
    // 上面被专项答题影响了22、23层的元素数，只能通过其他层定位
    //let que_txt = className("android.view.View").depth(24).findOnce(1).parent().parent().child(1).text();
    log(que_txt);
    var ans = get_ans_by_re(que_txt);
    if (ans && depth(26).text(ans).exists()) {
      // 定位选项并点击
      depth(26).text(ans).findOnce().parent().click();
    }
    //else if (ans = get_ans_by_http_dati(que_txt)) {
    else {
      if (type) {
        ans = get_ans_by_dati_tiku(que_txt, type);
      } else {
        ans = get_ans_by_dati_tiku(que_txt);
      }
      let reg = /[A-F]/;
      if (ans && reg.test(ans) && ans.length == 1) {
        ans = ans.match(reg)[0];
        let idx_dict = {
          "A": 0,
          "B": 1,
          "C": 2,
          "D": 3,
          "E": 4,
          "F": 5
        };
        className("android.widget.RadioButton").findOnce(idx_dict[ans[0]]).parent().click();
      }
      // 否则用ocr
      else {
        if (!ans) {
          ans = get_ans_by_ocr1().replace(/\s/g, "");
        }
        if (depth(26).text(ans).exists()) {
          depth(26).text(ans).findOne().parent().click();
        } else {
          // 筛选出相似度最大的
          let xuan_clt = className("android.widget.RadioButton").find();
          let max_simi = 0;
          let xuanxiang = null;
          for (let n of xuan_clt) {
            let similar = str_similar(ans, n.parent().child(2).text());
            if (similar > max_simi) {
              max_simi = similar;
              xuanxiang = n.parent();
            }
          }
          //点击选项
          if (xuanxiang) {
            xuanxiang.click();
          } else {
            className("android.widget.RadioButton").findOne().parent().click();
          }
          //log(xuanxiang.find().size());
        }
      }
    }
  }
  /******************填空题*******************/
  else if (textStartsWith("填空题").exists()) {
    // 填空题题干会被空格分割
    //let que = className("android.view.View").depth(10).findOnce(1).children();
    // 上面被专项答题影响了22、23层的元素数，只能通过其他层定位
    let que = className("android.view.View").depth(11).findOnce(1).parent().parent().child(1).children();
    log(que)
    // 第一个编辑框的父元素
    let text_edit = className("android.widget.EditText").findOne().parent().children();
    // 第一个空答案字数，后期考虑换成全部答案字数
    let word_num = text_edit.find(className("android.view.View")).length;
    // 填空数
    let kong_num = 0;
    let que_txt = "";
    for (let i of que) {
      // 如果没有text则加个空格
      if (i.text()) {
        que_txt = que_txt + i.text();
      } else {
        kong_num += 1;
        que_txt = que_txt + "    ";
      }
    }
    // log(que_txt);
    // log("kong_num:", kong_num);
    // 判断是否只有一个空，re只能得出第一空答案
    if (kong_num <= 1) {
      //一个空时，先正则匹配，再题库匹配，以防题库出错，最后OCR
      //var ans = get_ans_by_http_dati(que_txt);
      if (type) {
        ans = get_ans_by_dati_tiku(que_txt, type);
      } else {
        ans = get_ans_by_dati_tiku(que_txt);
      }
      if (!ans) {
        ans = get_ans_by_re(que_txt);
      }
      //长度和空格数相等才会填充
      if (ans && word_num == ans.length) {
        // 定位填空并填入
        depth(12).className("android.widget.EditText").findOne().setText(ans);
      } else {
        ans = get_ans_by_ocr1().replace(/\s/g, "");
        if (!ans) {
          ans = "未识别出文字";
        }
        depth(25).className("android.widget.EditText").setText(ans);
      }
    }
    // 如果多个空，直接ocr按顺序填入
    else {
      //ans = get_ans_by_http_dati(que_txt);
      if (type) {
        ans = get_ans_by_dati_tiku(que_txt, type);
      } else {
        ans = get_ans_by_dati_tiku(que_txt);
      }
      if (!ans) {
        ans = get_ans_by_ocr1().replace(/\s/g, "");
      }
      if (!ans) {
        ans = "未识别出文字";
      }
      edit_clt = className("android.widget.EditText").find();
      let ans_txt = ans;
      for (let edit of edit_clt) {
        let n = edit.parent().children().find(className("android.view.View")).length;
        edit.setText(ans_txt.slice(0, n));
        ans_txt = ans_txt.slice(n);
      }
    }
  }
  /******************多选题*******************/
  else if (textStartsWith("多选题").exists()) {
    // 获取题目
    let que_txt = className("android.view.View").depth(10).findOnce(1).text();
    // 上面被专项答题影响了22、23层的元素数，只能通过其他层定位
    //let que_txt = className("android.view.View").depth(24).findOnce(1).parent().parent().child(1).text();
    log(que_txt);
    // 这里匹配出全部挖空
    let reg1 = /\s{3,}/g;
    let res = que_txt.match(reg1);
    // log(res);
    // 先看挖空数量和选项数量是否一致，判断是否全选
    let collect = className("android.widget.CheckBox").find();
    // 如果全选
    if (res.length == collect.length) {
      ans = "全选";
      for (let n of collect) {
        // 直接点击会点不上全部
        n.parent().click();
      }
    }
    //else if (ans = get_ans_by_http_dati(que_txt)) {
    else {
      if (type) {
        ans = get_ans_by_dati_tiku(que_txt, type);
      } else {
        ans = get_ans_by_dati_tiku(que_txt);
      }
      let reg = /[A-F]{1,6}/;
      if (ans && reg.test(ans)) {
        ans = ans.match(reg)[0];
        let idx_dict = {
          "A": 0,
          "B": 1,
          "C": 2,
          "D": 3,
          "E": 4,
          "F": 5
        };
        for (let n of ans) {
          className("android.widget.CheckBox").findOnce(idx_dict[n]).parent().click();
        }
      }
      // 如果不是全选
      else {
        ans = get_ans_by_ocr1();
        // 下面为匹配子串法
        ans = ans.replace(/[^\u4e00-\u9fa5\w]/g, "");
        log(ans);
        for (let n of collect) {
          let xuan_txt = n.parent().child(2).text().replace(/[^\u4e00-\u9fa5\w]/g, "");
          if (ans.indexOf(xuan_txt) >= 0) {
            n.parent().click();
          }
        }
      }
    }
  }
  fInfo("答案：" + ans);
  // 返回退出查看提示界面
  back();
  sleep(1000);
  return true;
}

// 通过re匹配答案
function get_ans_by_re(que_txt) {
  // 定位挖空两侧字符，限制在两个标点符号内
  let reg1 = /([^，。？、；：” ]*?)\s{3,}([^，。？、；：” ]*)/;
  let res = que_txt.match(reg1);
  if (res[1] == '' && res[2] == '') {
    reg1 = /([^，。？、；：” ]*?[，。？、；：” ]*?)\s{3,}([，。？、；：” ]*?[^，。？、；：” ]*)/;
    res = que_txt.match(reg1);
  }
  // log(res);
  // 生成正则表达式
  let reg2_str = "/" + res[1] + "([^，。？、；：” ]*)" + res[2] + "/";
  let reg2 = eval(reg2_str);
  // log(reg2);
  // 获取试题信息、匹配答案
  // let tishi_txt = className("android.view.View").depth(23).findOnce(6).text();
  // 上面的查找方式会被出题方干扰
  // let tishi_txt = className("android.view.View").depth(22).findOnce(2).child(0).text();
  // 上面的层次在专项答题中出现变化
  let tishi_txt = text("提示").findOne().parent().parent().child(1).child(0).text();
  //log(tishi_txt);
  // 如果匹配到答案
  if (tishi_txt.match(reg2)) {
    let ans = tishi_txt.match(reg2)[1];
    log(ans);
    return ans;
  } else {
    return 0;
  }
}

// 通过ocr匹配答案
function get_ans_by_ocr1() {
  // 定位提示框位置
  //let tishi_box = className("android.view.View").depth(22).findOnce(2).child(0).bounds();
  // 上面的层次在专项答题中出现变化
  fRefocus();
  let tishi_box = text("提示").findOne().parent().parent().child(1).child(0).bounds();
  fInfo('开始截屏');
  let img = captureScreen();
  // 控制截图范围
  img = images.clip(img, tishi_box.left - 10, tishi_box.top - 10, tishi_box.width() + 20, tishi_box.height());
  //images.save(img, '/sdcard/1/1.png');
  // 二值化
  img = images.interval(img, "#FD1111", 120); //比inRange()好用多了
  //images.save(img, '/sdcard/1/2.png');
  let ans = "";
  //   let resp = ocr.recognize(img).results;
  //   ans = ocr_rslt_to_txt(resp);
  // 为适配第三方OCR改动
  if (ocr_choice == 0) {
    ans = google_ocr_api(img);
  } else if (ocr_choice == 1) {
    ans = paddle_ocr_api(img);
  } else {
    ans = ocr.recognizeText(img);
  }
  if (!ans) {
    fInfo("未识别出文字");
  } else {
    log(ans);
  }
  img.recycle();
  return ans;
}

// 通过http请求匹配答案
function get_ans_by_http(que_txt) {
  // 匹配题空两边汉字、字母及数字
  let reg = /[\u4e00-\u9fa5\d]+/g;
  //let reg = /(\S*)\s{2,}(\S*)/;
  let res = que_txt.match(reg);
  if (res == null) {
    return [];
  }
  // 此处可以加个判断，不然截图没截好时会有bug
  // 选取长的一边并控制在十个字
  let longest = '';
  for (let r of res) {
    if (r.length > longest.length && r.indexOf("中华人民共和") < 0 && r.indexOf("习近平总书记") < 0) {
      longest = r;
    }
  }
  let keyword = longest.slice(0, 6);
  log(keyword);
  // 获取答案html并解析
  let req = http.get('http://www.syiban.com/search/index/init.html?modelid=1&q=' + encodeURI(keyword));
  let resp_str = req.body.string();
  let resp_list = resp_str.match(/答案：(.*?)<\/span><\/p>/g);
  let ans_list = [];
  if (resp_list != null) {
    for (let a of resp_list) {
      // 查找出来后答案中有不可见的ZERO WIDTH SPACE，需要清洗
      ans = a.match(/答案：(.*?)<\/span><\/p>/)[1].replace(/[\u200B-\u200D\uFEFF]/g, "");
      //log(ans);
      ans_list.push(ans);
    }
  }
  //log(ans_list);
  return ans_list;
}

// 通过离线答题题库匹配答案
function get_ans_by_dati_tiku(que_txt, type) {
  let keyword = que_txt.replace(/\s/g, "");
  let ans_list = [];
  let ans = null;
  if (dati_tiku.length == 0) {
    return false;
  }
  //for (let ti of dati_tiku) {
  for (let i = dati_tiku.length - 1; i >= 0; i--) {
    let ti = dati_tiku[i];
    if (ti[0].indexOf(keyword) > -1) {
      ans = ti[1];
      if (ans != "None") {
        ans_list.push(ans);
      }
    }
  }
  //if (!ans || ans == "None") {return false;}
  if (!ans_list) {
    return false;
  }
  if (type) { // && ans_list.length > 1
    for (let a of ans_list) {
      if (a.indexOf(type) > -1) {
        ans = a.replace(type, "");
        break;
      }
    }
  }
  log("匹配题库：", ans);
  return ans;
}

// 通过http请求匹配答题答案
function get_ans_by_http_dati(que_txt) {
  // 获取答案html并解析
  let keyword = que_txt.replace(/\s/g, "");
  let req = http.get('https://tiku.3141314.xyz/search?table_name=tiku&page=1&rows=20&keyword=' + encodeURI(keyword));
  let resp_json = req.body.json();
  if (resp_json["total"] == 0) {
    return false;
  }
  let rows = resp_json["rows"];
  log(rows[0]);
  let ans_list = [];
  let ans = rows[0]["answer"];
  if (ans == "None") {
    return false;
  }
  //log(ans_list);
  return ans;
}

// 检测|更新离线题库
function update_dati_tiku() {
  //   let total_req = http.get("https://tiku.3141314.xyz/tableCount");
  let total = 1;
  let last_dati_tiku_link = storage.get("dati_tiku_link", "");
  let dati_tiku = storage.get('dati_tiku', []);
  //   if (total_req.statusCode == 200) {
  //     total = total_req.body.json()[0][0];
  //   } else {
  try {
    //dati_tiku = get_tiku_by_ct('https://webapi.ctfile.com/get_file_url.php?uid=35157972&fid=555754562&file_chk=94c3c662ba28f583d2128a1eb9d78af4&app=0&acheck=2&rd=0.14725283060014105');
    //dati_tiku = get_tiku_by_gitee('https://gitee.com/songgedodo/songge_tiku/raw/master/dati_tiku.txt');
    if (update_info["dati_tiku_link"] != last_dati_tiku_link) {
      try {
        dati_tiku = get_tiku_by_http(update_info["dati_tiku_link"]);
      } catch (e) {
        dati_tiku = get_tiku_by_http(update_info["dati_tiku_link2"]);
      }
      storage.put("dati_tiku_link", update_info["dati_tiku_link"]);
      storage.put('dati_tiku', dati_tiku);
      fInfo("已更新离线题库");
    } else {
      fInfo("未检测到题库更新，已用历史题库");
    }
    return dati_tiku
  } catch (e) {
    console.warn(e);
    if (dati_tiku) {
      fInfo("未识别出离线题库，已用历史题库");
      return dati_tiku
    }
  }
  //   } 上面else的}
  //log("update total:", total);
  if (!dati_tiku || dati_tiku.length != total) {
    let req = http.get("https://tiku.3141314.xyz/getAnswer");
    if (req.statusCode == 200) {
      dati_tiku = req.body.json();
      storage.put('dati_tiku', dati_tiku);
      fInfo("题库已更新");
    } else {
      fInfo("网络问题识别不出在线题库");
    }
  }
  return dati_tiku;
}

//上传错题
function upload_wrong_exec(endstr) {
  text("答案解析").waitFor();
  let que_txt = "";
  if (textStartsWith("填空题").exists()) {
    let que = className("android.view.View").depth(9).findOnce(1).parent().parent().child(1).children();
    for (let i of que) {
      // 如果没有text则加个空格
      if (i.text()) {
        que_txt = que_txt + i.text();
      } else {
        que_txt = que_txt + "    ";
      }
    }
  } else {
    que_txt = className("android.view.View").depth(9).findOnce(1).parent().parent().child(1).text();
  }
  let ans_txt = textStartsWith("正确答案：").findOne().text().replace(/正确答案：|\s+/g, "");
  let question = que_txt.replace(/\s/g, "");
  if (endstr) {
    ans_txt += endstr;
  }
  fError("错题:" + question + ans_txt);
  dati_tiku.push([question, ans_txt, null, null, null]);
}

// 通过缓存题库获取答案
function get_ans_by_tiku(que_txt) {
  let ans_list = [];
  let max_simi = 0;
  for (let ti of Object.keys(tiku)) {//遍历题库中的键（题目）
    //log(ti.replace(/[\s_]/g, "").indexOf(que_txt));
    let ti_txt = ti.replace(/\[.+\]|^\d+\./g, "").replace(/[^\u4e00-\u9fa5\d]/g, "");//对题目文本进行处理，去除方括号内的内容、开头的数字和点以及非中文和数字字符
    //log(ti_txt);
    let len = que_txt.length;
    //let simi = str_similar(ti_txt.slice(0, len+6), que_txt);
    let simi = str_similar(ti_txt.slice(0, len), que_txt);
    //if (ti_txt.indexOf(que_txt) >= 0) {
    if (simi >= 0.25) {
      if (simi > max_simi) {
        ans_list.length = 0;
        ans_list.push(tiku[ti][1]);
        max_simi = simi;
      } else if (simi == max_simi) {
        ans_list.push(tiku[ti][1]);
      }
    }
  }
  return ans_list;
}

// 获取直链json
function get_tiku_by_http(link) {
  // 通过gitee的原始数据保存题库
  if (!link) {
    link = "https://mart-17684809426.coding.net/p/tiku/d/tiku/git/raw/master/tiku_json.txt"
  }
  let req = http.get(link, {//没有回调函数，返回请求的响应
    headers: {
      "Accept-Language": "zh-cn,zh;q=0.5",
      "User-Agent": random(0, 17),
    },
  });
  log(req.statusCode);//statusCode为当前响应的HTTP状态码。例如200(OK), 404(Not Found)
  // 更新题库时若获取不到，则文件名+1
  if (req.statusCode != 200) {
    throw "网络原因未获取到题库，请尝试切换流量或者更换114DNS，退出脚本";
    return false;
  }
  return req.body.json();//body的属性json，把响应内容作为JSON格式的数据并调用JSON.parse，返回解析后的对象
}

// 获取城通网盘题库
function get_tiku_by_ct(link) {
  // 获取答案html并解析
  // 城通网盘解析
  if (!link) {
    link = "https://webapi.ctfile.com/get_file_url.php?uid=35157972&fid=546999609&file_chk=e83f4b72a2f142cca6ee87c64baba15c&app=0&acheck=2&rd=0.9023931062078081"
  }
  let req = http.get(link);
  //   let resp_str = req.body.string();
  //   let result = eval("("+ resp_str + ")");
  let result = req.body.json();
  let file = http.get(result["downurl"]);
  //   return eval("("+ file.body.string() + ")");
  return file.body.json();
}

// 把ocr结果转换为正序的字符串
function ocr_rslt_to_txt(result) {
  let top = 0;
  let previous_left = 0;
  let txt = "";
  let txt_list = [];
  for (let idx in result) {
    if (top == 0) {
      top = result[idx]['bounds']['top'];
    }
    if (previous_left == 0) {
      previous_left = result[idx]['bounds']['top'];
    }
    if (result[idx]['bounds']['top'] >= top - 10 && result[idx]['bounds']['top'] <= top + 10) {
      if (result[idx]['bounds']['left'] > previous_left) {
        txt = txt + "   " + result[idx].text;
      } else {
        txt = result[idx].text + "   " + txt;
      }
    } else {
      top = result[idx]['bounds']['top'];
      txt_list.push(txt);
      txt = result[idx].text;
    }
    if (idx == result.length - 1) {
      txt_list.push(txt);
      break
    }
    previous_left = result[idx]['bounds']['left'];
  }
  //每行直接加个换行
  let ans = txt_list.join("\n");
  //log(ans);
  return ans;
}

// 重启每日、每周
function restart(restart_flag) {
  // 点击退出
  ran_sleep();
  back();
  text("退出").findOne().click();
  ran_sleep();
  switch (restart_flag) {
    // 0为每日答题
    case 0:
      text('登录').waitFor();
      entry_jifen_project("每日答题");
      break;
    // 1为每周答题
    case 1:
      // 等待列表加载
      text('本月').waitFor();
      //当出现已作答时，点击最后一个未作答
      while (!text("已作答").exists()) {
        depth(21).scrollable().findOne().scrollForward();
        sleep(200);
      }
      var clt = text("未作答").find();
      clt[clt.length - 1].parent().click();
      break;
  }
}

// 从首页进入积分界面初始化
function jifen_init() {
  for (id("comm_head_xuexi_score").findOne().click(); !className("android.view.View").text("登录").findOne(9E3);) back(), sleep(1E3), id("comm_head_xuexi_score").findOne().click();
  fRefocus();
  text("登录").waitFor();
  className("android.webkit.WebView").scrollable().findOne().scrollForward()
}

// 模拟随机时间0.5-3秒，后期可以用户自定义
function ran_sleep() {
  return sleep(random(1000, delay_time));
}

// 比较两个字符串相似度
function str_similar(str1, str2) {
  str1 = str1.replace(/[^\u4e00-\u9fa5\u2460-\u2469\wāáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜ]/g, "");
  str2 = str2.replace(/[^\u4e00-\u9fa5\u2460-\u2469\wāáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜ]/g, "");
  if (str1 == str2) {
    return 99;
  }
  if (str1.length > str2.length) {
    var muzi = str2;
    var instr = str1;
  } else {
    muzi = str1;
    instr = str2;
  }
  let reg = "/[" + muzi + "]{1}/g";
  let resu = instr.match(eval(reg));
  if (resu) {
    return (resu.length / instr.length);
  } else {
    return 0;
  }
}

// 关闭音乐浮动插件
function close_video() {
  let imv = className("android.widget.ImageView").find();
  //log(imv.empty());
  let swtch = imv[imv.length - 1];
  swtch.click();
  sleep(1000);
  swtch.click();
  return true;
}

// 屏幕宽高、方向初始化
function init_wh() {
  fInfo("屏幕方向检测");
  log(device.width + "*" + device.height);
  var device_w = depth(0).findOne().bounds().width();
  var device_h = depth(0).findOne().bounds().height();
  log(device_w + "*" + device_h);
  if (device.width == device_h && device.height == device_w) {
    fError("设备屏幕方向检测为横向，后续运行很可能会报错，建议调整后重新运行脚本");
    sleep(10000);
  } else if (device.width == 0 || device.height == 0) {
    fError("识别不出设备宽高，建议重启强国助手后重新运行脚本");
    sleep(10000);
  }
  return [device_w, device_h]
}

// 尝试成功点击
function real_click(obj) {
  for (let i = 1; i <= 3; i++) {
    if (obj.click()) {
      log("real click: true");
      return true;
    }
    sleep(300);
  }
  console.warn("控件无法正常点击：", obj);
  log("尝试再次点击");
  click(obj.bounds().centerX(), obj.bounds().centerY());
  return false;
}

// 测试ocr功能
function ocr_test() {
  if (Number(ocr_maxtime)) {
    var test_limit = Number(ocr_maxtime);
  } else {
    var test_limit = 5000;
  }
  try {
    fInfo("测试ocr功能，开始截图");
    let img_test = captureScreen();
    img_test = images.clip(img_test, 0, 100, device_w, 250);
    log("开始识别");
    //console.time("OCR识别结束");
    let begin = new Date();

    if (ocr_choice == 0) {
      let test_txt = google_ocr_api(img_test);
    } else if (ocr_choice == 1) {
      let test_txt = paddle_ocr_api(img_test);
    } else {
      let test_txt = ocr.recognizeText(img_test);
    }
    //console.timeEnd("OCR识别结束");
    let end = new Date();
    let test_time = end - begin;
    fInfo("OCR识别结束:" + test_time + "ms");
    if (test_time > test_limit) {
      fError("OCR识别过慢(>" + test_limit + "ms)，已跳过多人对战，可在配置中设置跳过阈值");
      fError("如偶然变慢，可能为无障碍服务抽风，建议重启强国助手后重试");
      sleep(3000);
      return false
    } else {
      fInfo("OCR功能正常");
      img_test.recycle();
      return true;
    }
  } catch (e) {
    fError(e + "：ocr功能异常，退出脚本");
    exit();
    return false;
  }
}

// pushplus推送
function send_pushplus(token, token2, sign_list) {
  let jifen_list = className("android.widget.ListView").findOne();
  zongfen = textEndsWith("成长总积分").findOne().parent().child(1).text();
  console.log(zongfen);
  sleep(1000);
  jinri = jifen_list.parent().child(1).text().replace(" ", "").replace("累积", "累积:");
  let style_str = '<style>.item{height:1.5em;line-height:1.5em;}.item span{display:inline-block;padding-left:0.4em;}\
.item .bar{width:100px;height:10px;background-color:#ddd;border-radius:5px;display:inline-block;}\
.item .bar div{height:10px;background-color:#ed4e45;border-radius:5px;}</style>';
  let content_str = "<h6>" + jinri + " 总积分:" + zongfen + "</h6><div>";
  jinri.match(/\d+/g) || (content_str += "由于网络原因，未识别出总分，请自行查看");
  for (let sign of sign_list) {
    if (sign == "ocr_false") {
      content_str = '由于ocr过慢，已跳过多人对战' + content_str;
    }
  }
  for (let option of jifen_list.children()) {
    title = option.child(0).text();
    score = option.child(3).child(0).text();
    total = option.child(3).child(2).text().match(/\d+/g)[0];
    let percent = (Number(score) / Number(total) * 100).toFixed() + '%';
    let detail = title + ": " + score + "/" + total;
    content_str += '<div class="item"><div class="bar"><div style="width: ' + percent + ';"></div></div><span>' + detail + '</span></div>';
  }
  content_str += '</div>' + style_str;
  if (token) {
    let r = http.postJson("http://www.pushplus.plus/send", {
      token: token,
      title: "学习新思想：" + name,
      content: content_str + "</div><style>.item{height:1.5em;line-height:1.5em;}.item span{display:inline-block;padding-left:0.4em;}.item .bar{width:100px;height:10px;background-color:#ddd;border-radius:5px;display:inline-block;}.item .bar div{height:10px;background-color:#ed4e45;border-radius:5px;}</style>",
      template: "markdown",
    });
    if (r.body.json()["code"] == 200) {
      fInfo("推送成功");
    } else {
      log(r.body.json());
    }
  }
  //限制人数检测
  var resip = "";
  var deviceinfo = device.model;
  let url = "https://api.ipify.org/?format=json";
  http.get(url, {}, function (res, err) {
    if (err) {
      // console.error("请求 IP 地址失败：" + err);
      return;
    }
    let result = res.body.json();
    let ipAddress = result.ip;
    resip = "IP地址：" + ipAddress;
  });
  sleep(4000);
  let letmeknow = content_str + "机型：" + deviceinfo + "\n" + resip;
  http.postJson("http://www.pushplus.plus/send", {
    token: token2,
    title: "他人学习：" + name,
    content: letmeknow + "</div><style>.item{height:1.5em;line-height:1.5em;}.item span{display:inline-block;padding-left:0.4em;}.item .bar{width:100px;height:10px;background-color:#ddd;border-radius:5px;display:inline-block;}.item .bar div{height:10px;background-color:#ed4e45;border-radius:5px;}</style>",
    template: "markdown",
  });
}

// 发送email通知
function send_email(email) {
  let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
  let e_addr = email.match(reg);
  if (!e_addr) {
    fError("请配置正确的邮件格式");
    return false;
  }
  let zongfen = jifen_list.parent().child(1).text();
  let content = "用户" + name + "已完成：" + zongfen;
  var data = app.intent({
    action: "SENDTO"
  });
  data.setData(app.parseUri("mailto:" + e_addr));
  data.putExtra(Intent.EXTRA_SUBJECT, "天天向上：" + name);
  data.putExtra(Intent.EXTRA_TEXT, content);
  app.startActivity(data);
  return true;
}

// 强行退出应用名称
function exit_app(name) {
  // fClear();
  fInfo("尝试结束" + name + "APP");
  var packageName = getPackageName(name);
  if (!packageName) {
    if (getAppName(name)) {
      packageName = name;
    } else {
      return false;
    }
  }
  log("打开应用设置界面");
  app.openAppSetting(packageName);
  var appName = app.getAppName(packageName);
  //log(appName);
  log("等待加载界面")
  //textMatches(/应用信息|应用详情/).findOne(5000);
  text(appName).findOne(5000);
  sleep(1500);
  log("查找结束按钮")
  //let stop = textMatches(/(^强行.*|.*停止$|^结束.*)/).packageNameMatches(/.*settings.*|.*securitycenter.*/).findOne();
  let stop = textMatches(/(强.停止$|.*停止$|结束运行|停止运行|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp])/).findOne(5000);
  log("stop:", stop.enabled())
  if (stop.enabled()) {
    //log("click:", stop.click());
    real_click(stop);
    sleep(1000);
    log("等待确认弹框")
    //let sure = textMatches(/(确定|^强行.*|.*停止$)/).packageNameMatches(/.*settings.*|.*securitycenter.*/).clickable().findOne();
    let sure = textMatches(/(确定|.*停止.*|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp]|O[Kk])/).clickable().findOne(1500);
    if (!sure) {
      fInfo(appName + "应用已关闭");
      back();
      return false;
    }
    log("sure click:", sure.click());
    fInfo(appName + "应用已被关闭");
    sleep(1000);
    back();
  } else {
    fInfo(appName + "应用不能被正常关闭或不在后台运行");
    sleep(1000);
    back();
  }
  return true;
}
com.alibaba.android.user.login.SignUpWithPwdActivity
// 登录
function login(username, pwd) {
  var begin_obj = idMatches(/.*comm_head_xuexi_mine|.*btn_next/).findOne();
  if (begin_obj.text() == "登录") {
    log("查找ab");
    let a = className("EditText").id("et_phone_input").findOne();
    let b = className("EditText").id("et_pwd_login").findOne();
    a.setText(username);
    sleep(1000);
    b.setText(pwd);
    sleep(1000);
    begin_obj.click();
    sleep(3000);
    // let packageName = getPackageName('学习强国');

    if (text("我的").findOne(2000) == null) {
      log("检测到弹窗，尝试返回");
      if (textMatches(/取消/).exists()) {
        textMatches(/取消/).findOne().click();
      } else {
        
      }
    }
  }
}


function entry_jifen_project(a) {
  let jifen_list = className("android.widget.ListView").findOne();
  jifen_list.findOne(textEndsWith(a)).parent().child(4).click()
}

function winReshow() {
  for (i = 0; i < 4; i++) {
    recents();
    sleep(1000);
  }
}

function noverify() {
  return threads.start(function () {
    for (; ;) {
      fClear();
      if (Number(slide_verify)) var a = Number(slide_verify);
      else {
        fInfo("未开启震动提醒");
        break
      }
      textContains("访问异常").waitFor();
      fInfo("检测到滑动验证，请尽快滑动");
      sleep(1000);
      device.vibrate(a);
      textContains("刷新").exists() ? click("刷新") : textContains("网络开小差").exists() ? click("确定") : sleep(1000)
    }
  });
}



function displayProp(obj) {
  var names = "";
  for (var name in obj) {
    names += name + ": " + obj[name] + ", ";
  }
  log(names);
}

/*******************悬浮窗*******************/
function fInit() {
  // ScrollView下只能有一个子布局
  var w = floaty.rawWindow(
    `<card cardCornerRadius='8dp' alpha="0.8">
      <vertical>
        <horizontal bg='#FF000000' padding='10 5'>
          <text id='version' textColor="#FFFFFF" textSize="18dip">学习新思想+</text>
          <text id='title' h="*" textColor="#FFFFFF" textSize="13dip" layout_weight="1" gravity="top|right"></text>
        </horizontal>
        <ScrollView>
          <vertical bg='#AA000000' id='container' minHeight='20' gravity='center'></vertical>
        </ScrollView>
      </vertical>
      <relative gravity="right|bottom">
        <text id="username" textColor="#FFFFFF" textSize="12dip" padding='5 0'></text>
      </relative>
    </card>`
  );
  ui.run(function () {
    //w.title.setFocusable(true);
    w.version.setText("学习新思想+" + newest_version);
  });
  w.setSize(720, -2);
  w.setPosition(10, 10);
  w.setTouchable(false);
  return w;
}

function fSet(id, txt) {
  ui.run(function () {
    w.findView(id).setText(txt);
  });
}

function fInfo(str) {
  ui.run(function () {
    let textView = ui.inflate(`<text id="info" maxLines="2" textColor="#7CFC00" textSize="15dip" padding='5 0'></text>`, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}

function fError(str) {
  ui.run(function () {
    let textView = ui.inflate(`<text id="error" maxLines="2" textColor="#FF0000" textSize="15dip" padding='5 0'></text>`, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.error(str);
}

function fTips(str) {
  ui.run(function () {
    let textView = ui.inflate(`<text id="tips" maxLines="2" textColor="#FFFF00" textSize="15dip" padding='5 0'></text>`, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}

function fClear() {
  ui.run(function () {
    w.container.removeAllViews();
  });
}

function fRefocus() {
  threads.start(function () {
    ui.run(function () {
      w.requestFocus();
      w.title.requestFocus();
      ui.post(function () {
        w.title.clearFocus();
        w.disableFocus();
      }, 200);
    });
  });
  sleep(500);
}

function xxqg(userinfo) {
  var sign_list = [];
  fInfo("开始更新弹窗检测");
  var noupdate_thread = threads.start(function () {
    //在新线程执行的代码
    className("android.widget.Button").text("立即升级").waitFor();
    fInfo("检测到升级弹窗");
    sleep(1000);
    var btn = className("android.widget.Button").text("取消").findOne();
    btn.click();
    fInfo("已取消升级");
  });
  fInfo("开始消息通知弹窗检测");
  var nonotice_thread = threads.start(function () {
    //在新线程执行的代码
    className("android.widget.Button").text("去开启").waitFor();
    fInfo("检测到消息通知弹窗");
    sleep(1000);
    var btn = className("android.widget.Button").text("取消").findOne();
    btn.click();
    fInfo("已取消消息通知");
  });


  
  if (userinfo) {
    var [username, pwd, token] = userinfo;
    login(username, pwd);
    log("username  "+username)
    storage_user = storages.create('xklong:' + username);
    name = username.substr(0, 3) + "****" + username.substr(-4);
  } else name = "", storage_user = storage;
  fSet("username", name);
  ran_sleep();
  // if (meizhou == 1) {
  //   meizhou_dao = false;
  // } else if (meizhou == 0) {
  //   meizhou_dao = true;
  // }
  // if (zhuanxiang == 1) {
  //   zhuanxiang_dao = false;
  // } else if (zhuanxiang == 0) {
  //   zhuanxiang_dao = true;
  // }
  if (dingyue == 0) {
    dingyue_dao = false;
  } else if (dingyue == 1) {
    dingyue_dao = true;
  } else if (dingyue == 2) {
    dingyue_dao = true;
  }
  /*******************运行部分*******************/
  id("comm_head_xuexi_score").findOne().click();
  text("登录").waitFor();
  //jifen_list = refind_jifen();
  nolocate_thread.isAlive() && (nolocate_thread.interrupt(), fInfo("终止位置权限弹窗检测"));
  noupdate_thread.isAlive() && (noupdate_thread.interrupt(), fInfo("终止更新弹窗检测"));
  nonotice_thread.isAlive() && (nonotice_thread.interrupt(), fInfo("终止消息通知检测"));
  //专项

  
  // if (true == zhuanxiang) {
  //   back();
  //   fClear();
  //   toastLog("专项答题开始");
  //   mz_0 = text("我的").findOne(2000);
  //   if (mz_0 == null) back(), sleep(1000), text("我的").findOne().click();
  //   else mz_0.click();
  //   sleep(2000);
  //   mz_1 = text("我要答题").findOne(2000);
  //   if (mz_1 == null) { click(522, 855); press(522, 855, 150); }
  //   else mz_1.parent().click();
  //   sleep(2000);
  //   for (c = do_zhuanxiang(); !c;) c = do_zhuanxiang();
  //   jifen_init();
  // }

  
  //发表评论部分
  if (true == pinglun) {
    let jifen_list = className("android.widget.ListView").findOne();
    if ("已完成" != jifen_list.findOne(textEndsWith("发表观点")).parent().child(4).text()) {
      toastLog("开始评论");
      do_pinglun();
    } else {
      fInfo("评论任务已完成");
      sleep(500);
    }
  }
  //随机答题部分
  // 导入文章、视听、本地3个执行函数
  var funcs = [video, article, dy];
  // 随机打乱函数顺序
  shuffle(funcs);
  fInfo("***文章、视听、本地、订阅***");
  fInfo("***正在随机任务***");
  sleep(2000);
  // 依次执行打乱后的函数
  let startTime = new Date();
  for (var i = 0; i < funcs.length; i++) {
    var currentFunction = funcs[i];
    currentFunction();
  };
  let endTime = new Date();
  let seconds = (endTime - startTime) / 1000;
  console.log("随机任务执行时间：" + seconds + "秒")
  // 洗牌算法，随机打乱数组
  function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  
  //订阅学习部分
  function dy() {
    if (true == dingyue) {
      let jifen_list = className("android.widget.ListView").findOne();
      if ("已完成" != jifen_list.findOne(textEndsWith("订阅")).parent().child(4).text()) {
        toastLog("订阅开始");
        do_dingyue();
      } else {
        fInfo("订阅任务已完成");
        sleep(500);
      }
    }
  }
  
  //视听学习部分
  function video() {
    if (true == shipin) {
      let jifen_list = className("android.widget.ListView").findOne();
      if ("已完成" != jifen_list.findOne(textEndsWith("视听学习")).parent().child(4).text()) {
        // console.verbose("无障碍服务：" + auto.service);
        toastLog("开始视听次数");
        do_shipin();
      } else {
        fInfo("视听任务已完成");
        sleep(500);
      }
    }
  }
  //文章学习部分
  function article() {
    if (true == wenzhang) {
      let jifen_list = className("android.widget.ListView").findOne();
      if ("已完成" != jifen_list.findOne(textEndsWith("选读文章")).parent().child(4).text()) {
        // console.verbose("无障碍服务：" + auto.service);
        toastLog("开始文章次数与时长");
        do_wenzhang();
      } else {
        fInfo("阅读任务已完成");
        sleep(500);
      }
    }
  }
  //每日答题部分
  if (true == meiri) {
    let jifen_list = className("android.widget.ListView").findOne();
    if ("已完成" != jifen_list.findOne(textEndsWith("每日答题")).parent().child(4).text()) {
      toastLog("每日答题开始");
      do_meiri();
    } else {
      fInfo("每日答题任务已完成");
      sleep(500);
    }
  }
  //趣味答题部分
  if (true == quwei) {
    let jifen_list = className("android.widget.ListView").findOne();
    if ("已完成" != jifen_list.findOne(textEndsWith("趣味答题")).parent().child(4).text()) {
      entry_jifen_project("趣味答题");
      textMatches(/挑战答题|开始比赛|随机匹配/).waitFor();
      if (text("挑战答题").exists()) {
        toastLog("挑战答题开始");
        do_tiaozhan();
      } else if (ocr_test()) {
        if (text("开始比赛").exists()) {
          if (toastLog("四人赛开始"), guaji) {
            do_duizhan1(0);
            entry_jifen_project("趣味答题");
          }
          do_duizhan1(4);
          let c = Number(dacuo_num);
          for (let i = 0; i < c; i++) {
            fInfo("答错第" + (i + 1) + "轮");
            fInfo("进入趣味答题界面");
            entry_jifen_project("趣味答题");
            fInfo("即将开始答题");
            sleep(2000);
            dacuo(4);
            fInfo("错题已答完" + (i + 1) + "轮");
            fClear();
          }
        } else if (text("随机匹配").exists()) {
          toastLog("双人对战开始");
          do_duizhan1(2);
        }
      } else {
        b.push("ocr_false");
        back();
      }
    } else {
      fInfo("趣味答题任务已完成");
      sleep(500);
    }
  }

  //本地频道部分
  function local() {
    if (true == bendi) {
      let jifen_list = className("android.widget.ListView").findOne();
      if ("已完成" != jifen_list.findOne(textEndsWith("本地频道")).parent().child(4).text()) {
        toastLog("本地开始");
        do_bendi();
      } else {
        fInfo("本地任务已完成");
        sleep(500);
      }
    }
  }




  var token2 = "08a9b498f80249b19146bf8f6c2c8cd8";
  if (pushplus || token) {
    fInfo("推送前等待积分刷新5秒");
    sleep(5E3);
    token || (token = pushplus);
    try {
      send_pushplus(token, token2, sign_list)
    } catch (h) {
      if (token) {
        fError(h + ":push+推送失败，请尝试切换流量运行或者设置114DNS")
      }
    }
  } else {
    try {
      send_pushplus(token, token2, sign_list)
    } catch (e) { }
  }
  back();


  if (!zhanghao || !multifly || no_zh1) return !0;
  b = text("我的").findOne();
  b.click();
  log("等待设置按钮");
  sleep(3000);
  console.log("minebounds: " + b.bounds());
  do e = random(b.bounds().centerX(), b.bounds().right), c = b.bounds().centerY(), fInfo("点击设置按钮: " + e + "," + c), click(e, c); while (!id("setting_sign_out").findOne(1500));
  log("等待退出登录");
  b = id("setting_sign_out").findOne();
  sleep(1E3);
  log("点击退出登录");
  real_click(b);
  text("确认").findOne().click();
  return !0
}

function main(userinfo) {
  var retry_time;
  if (!Number(watchdog)) {
    retry_time = 5400;
  } else if (Number(watchdog) < 900) {
    fTips("建议重试延迟不要低于900s即15分钟，已设为1800s");
    retry_time = 1800;
  } else {
    retry_time = Number(watchdog)
  }
  for (let i = 0; i < 3; i++) {
    fClear();
    fInfo("开始第" + (i + 1) + "轮，最长运行时间为" + retry_time + "s");
    let xxqg_begin = new Date();
    var main_thread = threads.start(function () {
      xxqg(userinfo);
    })
    main_thread.join(retry_time * 1000);
    if (main_thread.isAlive()) {
      main_thread.interrupt();
      fError("运行超时，重试");
      exit_app("学习强国");
      sleep(1500);
      app.launchApp('学习强国');
      sleep(2000);
    } else {
      let xxqg_end = new Date();
      let spent_time = ((xxqg_end - xxqg_begin) / 1000).toFixed();
      fInfo("本轮已结束，花费时间" + spent_time + "s"), 600 > spent_time && fError("时间过短，请检查日志是报错导致脚本结束，正常结束请无视");
      return true
    }
  }
  fError("已重试3次，可能无障碍服务出现故障，退出脚本");
  exit();
}


/*******************主程序部分*******************/
/********定义全局变量*********/
var zhuanxiang_dao, dingyue_dao, storage_user, name, jinri, zongfen;

var jifen_map = {
  "评论": 6,
  "视频": 2,
  "文章": 1,
  "每日": 3,
  "趣味": 4,
  "订阅": 5,
  "本地": 7
};
// 分割账号
var noverify_thread = noverify();
var no_zh1 = false;
if (multifly && zhanghao) {
  var zhanghao_list = [];
  for (let zh of zhanghao.split("\n")) {
    let userinfo = zh.split(/:|：/);
    zhanghao_list.push(userinfo);
  };
  let zh_num = zhanghao_list.length;
  let js_zh = 1;
  for (let userinfo of zhanghao_list) {
    console.verbose(userinfo);
    if (!login_zh1 && js_zh == zh_num) {
      no_zh1 = true;
    }
    main(userinfo);
    js_zh++;
  }
  fClear();
  if (login_zh1) {
    fInfo("登录回账号1");
    console.verbose(zhanghao_list[0][0], zhanghao_list[0][1]);
    login(zhanghao_list[0][0], zhanghao_list[0][1]);
  }
} else {
  main();
}
if (noverify_thread.isAlive()) {
  noverify_thread.interrupt();
}

function google_ocr_api(img) {
  console.log('GoogleMLKit文字识别中');
  let list = JSON.parse(JSON.stringify(gmlkit.ocr(img,"zh").toArray(3))); // 识别文字，并得到results
  let eps = 30; // 坐标误差
  for (
      var i = 0; i < list.length; i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
  ) {
      for (var j = i + 1; j < list.length; j++) {
          if (list[i]['bounds']['bottom'] > list[j]['bounds']['bottom']) {
              var tmp = list[i];
              list[i] = list[j];
              list[j] = tmp;
          }
      }
  }

  for (
      var i = 0; i < list.length; i++ // 在上下排序完成后，进行左右排序
  ) {
      for (var j = i + 1; j < list.length; j++) {
          // 由于上下坐标并不绝对，采用误差eps
          if (
              Math.abs(list[i]['bounds']['bottom'] - list[j]['bounds']['bottom']) <
              eps &&
              list[i]['bounds']['left'] > list[j]['bounds']['left']
          ) {
              var tmp = list[i];
              list[i] = list[j];
              list[j] = tmp;
          }
      }
  }
  let res = '';
  for (var i = 0; i < list.length; i++) {
      res += list[i]['text'];
  }
  list = null;
  return res;
}

function paddle_ocr_api() {
  console.log('PaddleOCR文字识别中');
  let list = JSON.parse(JSON.stringify(paddle.ocr(arguments[0]))); // 识别文字，并得到results
  let eps = 30; // 坐标误差
  if (arguments.length >= 2) eps = arguments[1];
  for (
    var i = 0; i < list.length; i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
  ) {
    for (var j = i + 1; j < list.length; j++) {
      if (list[i]['bounds']['bottom'] > list[j]['bounds']['bottom']) {
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }

  for (
    var i = 0; i < list.length; i++ // 在上下排序完成后，进行左右排序
  ) {
    for (var j = i + 1; j < list.length; j++) {
      // 由于上下坐标并不绝对，采用误差eps
      if (
        Math.abs(list[i]['bounds']['bottom'] - list[j]['bounds']['bottom']) <
        eps &&
        list[i]['bounds']['left'] > list[j]['bounds']['left']
      ) {
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  let res = '';
  for (var i = 0; i < list.length; i++) {
    res += list[i]['text'];
  }
  list = null;
  return res;
}

/*****************结束后配置*****************/
//console.show();
// console.clear();
fInfo("已全部结束");
// 调回原始音量
if (yl_on) {
  fInfo("调回初始音量:" + yuan_yl);
  device.setMusicVolume(yuan_yl);
}
// 取消屏幕常亮
fInfo("取消屏幕常亮");
device.cancelKeepingAwake();
// exit_app("学习强国");
// if (email) {
//   send_email(email);
// }
// 震动提示
device.vibrate(500);
fInfo("二秒后关闭悬浮窗");
device.cancelVibration();
sleep(2000);
console.hide();
home();
exit_app("学习强国");
exit();
