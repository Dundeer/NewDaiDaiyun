class wxtool{
    public constructor(){

    }
    private static instance:wxtool;//单例
    public static get Instance():wxtool{
        if(wxtool.instance== null){
            wxtool.instance = new wxtool();
        }
        return wxtool.instance;
    }


    //打开广告
    public OpenBanner(id){
        //创建广告banner
        const bannerAd = wx.createBannerAd({
            adUnitId:id,
            style:{
                left:10,
                top:76,
                width:320
            }
        });
        //加载banner
        bannerAd.onLoad(()=>{
            console.log('banner 广告加载成功');
            bannerAd.style.width = 400;
            bannerAd.show();
        });
        bannerAd.onError(err =>{
            console.log('banner 广告加载失败'+err);
        });
    }
    //打开激励广告
    public OpenAD(id){
        //创建激励广告
        const video = wx.createRewardedVideoAd(
            {
                adUnitId:id
            }
        );
        //方式1
        //加载广告
        // video.onLoad(()=>{
        //     console.error('激励视频加载成功，执行打开');
        //     video.show();
        // });

        //方法2
        video.load().then(()=>{
            video.show();
        }).catch(err=>{
            console.error("打开失败"+err);
        });

        video.onError(err=>{
            console.error("打开广告失败"+err);
        });

        video.onClose(res=>{
            if(res&&res.isEnded||res==undefined){
                console.error("正常关闭");
                video.offClose();
            }else{
                console.log("中途退出");
                video.offClose();
            }
        });
    }
}