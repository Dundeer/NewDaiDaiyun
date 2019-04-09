var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var wxtool = (function () {
    function wxtool() {
    }
    Object.defineProperty(wxtool, "Instance", {
        get: function () {
            if (wxtool.instance == null) {
                wxtool.instance = new wxtool();
            }
            return wxtool.instance;
        },
        enumerable: true,
        configurable: true
    });
    //打开广告
    wxtool.prototype.OpenBanner = function (id) {
        //创建广告banner
        var bannerAd = wx.createBannerAd({
            adUnitId: id,
            style: {
                left: 10,
                top: 76,
                width: 320
            }
        });
        //加载banner
        bannerAd.onLoad(function () {
            console.log('banner 广告加载成功');
            bannerAd.style.width = 400;
            bannerAd.show();
        });
        bannerAd.onError(function (err) {
            console.log('banner 广告加载失败' + err);
        });
    };
    //打开激励广告
    wxtool.prototype.OpenAD = function (id) {
        //创建激励广告
        var video = wx.createRewardedVideoAd({
            adUnitId: id
        });
        //方式1
        //加载广告
        // video.onLoad(()=>{
        //     console.error('激励视频加载成功，执行打开');
        //     video.show();
        // });
        //方法2
        video.load().then(function () {
            video.show();
        }).catch(function (err) {
            console.error("打开失败" + err);
        });
        video.onError(function (err) {
            console.error("打开广告失败" + err);
        });
        video.onClose(function (res) {
            if (res && res.isEnded || res == undefined) {
                console.error("正常关闭");
                video.offClose();
            }
            else {
                console.log("中途退出");
                video.offClose();
            }
        });
    };
    return wxtool;
}());
__reflect(wxtool.prototype, "wxtool");
