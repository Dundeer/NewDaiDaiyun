var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BeginPage = (function (_super) {
    __extends(BeginPage, _super);
    function BeginPage() {
        var _this = _super.call(this) || this;
        //是否开启匹配
        _this.ismatching = false;
        //当前数据的排位
        _this.CurrentRankNumber = 0;
        //会发送过来的数据长度
        _this.AllRankLength = 0;
        //防止排行数据的数组
        _this.let = [];
        return _this;
    }
    BeginPage.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    BeginPage.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
    };
    //初始化
    BeginPage.prototype.init = function () {
        //添加事件
        this.AddEvent();
        //获取用户id
        this.id = SceneManager.instance().myid;
        //初始化规则面板
        this.CloseRule();
        //初始化战绩面板
        this.CloseRecord();
        //初始化排行
        this.CloseRank();
        //如果玩家想要立即再匹配一局则打开匹配功能否则关闭匹配面板
        if (SceneManager.instance().isRestart) {
            this.matching();
            SceneManager.instance().isRestart = false;
        }
        else {
            this.Matching.visible = false;
        }
    };
    //添加的所有事件
    BeginPage.prototype.AddEvent = function () {
        //排行榜返回按钮
        this.RankBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CloseRank, this);
        //排行榜按钮
        this.RankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OpenRank, this);
        //规则返回按钮
        this.RuleBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CloseRule, this);
        //规则按钮
        this.RuleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OpenRule, this);
        //战绩返回按钮
        this.RecordBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CloseRecord, this);
        //战绩按钮
        this.RecordBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Record, this);
        //给人机对战按钮绑定点击事件
        this.AIBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ai, this);
        //给匹配对战按钮绑定点击事件
        this.MatchingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.matching, this);
        //匹配返回按钮
        this.MatchingBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.BackBegin, this);
        //服务器数据监听
        SceneManager.instance().webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    };
    //移除所有事件
    BeginPage.prototype.RemoveEvent = function () {
        if (this.RuleBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.RuleBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.CloseRule, this);
        }
        if (this.RuleBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.RuleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OpenRule, this);
        }
        if (this.RecordBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.RecordBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, function () { this.RecordGroup.visible = false; }, this);
        }
        if (this.RecordBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.RecordBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Record, this);
        }
        if (this.AIBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.AIBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ai, this);
        }
        if (this.MatchingBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.MatchingBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.matching, this);
        }
        if (this.MatchingBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.MatchingBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.BackBegin, this);
        }
        if (SceneManager.instance().webSocket.hasEventListener(egret.ProgressEvent.SOCKET_DATA)) {
            SceneManager.instance().webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        }
    };
    //关闭排行榜
    BeginPage.prototype.CloseRank = function () {
        this.let.splice(0, this.let.length);
        this.CurrentRankNumber = 0;
        this.AllRankLength = 0;
        this.RankingGroup.visible = false;
    };
    //展示排行榜
    BeginPage.prototype.OpenRank = function () {
        this.Sendsocket("SelfRank", "0");
    };
    //关闭规则面板
    BeginPage.prototype.CloseRule = function () {
        this.Rule.visible = false;
    };
    //打开规则面板
    BeginPage.prototype.OpenRule = function () {
        this.Rule.visible = true;
    };
    //关闭战绩
    BeginPage.prototype.CloseRecord = function () {
        this.RecordGroup.visible = false;
    };
    //展示战绩
    BeginPage.prototype.Record = function () {
        this.Sendsocket("Selfshuju", "cha");
    };
    //开始ai对战
    BeginPage.prototype.ai = function () {
        //切换人机对战场景
        SceneManager.instance().isAI = true;
        this.ismatching = false;
        SceneManager.instance().changeScene('gameScene');
    };
    //中止匹配返回主界面
    BeginPage.prototype.BackBegin = function () {
        this.Matching.visible = false;
        this.ismatching = false;
        this.Sendsocket("Quit", "0");
    };
    //开始匹配
    BeginPage.prototype.matching = function () {
        //切换匹配对战场景
        SceneManager.instance().isAI = false;
        this.Matching.visible = true;
        this.ismatching = true;
        this.Sendsocket("Login", "0");
    };
    //使自己的战绩显示到UI中
    BeginPage.prototype.ShowSelfShuju = function (winnumber, timesNubmer, integral) {
        //胜率
        var shenglvNumber = winnumber / timesNubmer;
        shenglvNumber = Math.floor(shenglvNumber * 100);
        //将战斗场次文字显示
        this.FireNumber.text = timesNubmer.toString();
        if (winnumber == 0) {
            this.shenglv.text = "0%";
        }
        else {
            var shenglvwenzi = shenglvNumber.toString();
            this.shenglv.text = shenglvwenzi + "%";
        }
        //将积分文字显示
        this.jifen.text = integral.toString();
    };
    //在排行中显示自己的数据
    BeginPage.prototype.ShowSelfRank = function (rank, id, integral) {
        this.MyRankTable.text = rank.toString();
        this.MyIDLabel.text = id;
        this.MyIntegralLable.text = integral.toString();
    };
    //发送信息到服务端
    BeginPage.prototype.Sendsocket = function (type, start) {
        var cmd = '{"id":"' + this.id + '","type":"' + type + '","start":"' + start + '"}';
        SceneManager.instance().webSocket.writeUTF(cmd);
    };
    //监听服务器回复
    BeginPage.prototype.onReceiveMessage = function () {
        //拿到服务端发送的数据
        var msg = SceneManager.instance().webSocket.readUTF();
        try {
            //将数据转换成json格式
            var obj = JSON.parse(msg);
            //如果确实转换为json格式且不为空
            if (typeof obj == "object" && obj) {
                switch (obj.message) {
                    case "通讯中":
                        //返回的信息为“通讯中”且开始匹配则向服务端发送加入房间请求	
                        if (this.ismatching) {
                            this.Sendsocket("Joinin", "0");
                        }
                        break;
                    case "进入房间":
                        //如果已经进入房间则向服务端发送开始游戏请求
                        this.Matching.visible = true;
                        this.Sendsocket("Gaming", "1");
                        break;
                    case "对方已准备":
                        //如果对方已经准备开始战斗则跳转到战斗界面
                        this.ismatching = false;
                        this.RemoveEvent();
                        SceneManager.instance().changeScene('gameScene');
                        break;
                    case "退出房间":
                        //如果已经退出房间则向服务端发送验证通信请求
                        this.Sendsocket("Login", "0");
                        break;
                    case "个人数据":
                        //接收到个人数据并把数据显示到UI上
                        console.log(obj.data);
                        //获取到信息中的数据
                        var str = obj.data;
                        //获取到数据中的胜场
                        var winnumber = str.win;
                        //战斗场次
                        var timesNubmer = str.times;
                        //获取积分
                        var integral = str.integral;
                        //将数据展示到UI中
                        this.ShowSelfShuju(winnumber, timesNubmer, integral);
                        //将数据面板打开
                        this.RecordGroup.visible = true;
                        break;
                    case "个人排行":
                        //接收个人排行数据并处理
                        var selfdata = obj.data;
                        var Myrank = selfdata.jifen;
                        var MyId = selfdata.name;
                        var Myintegral = selfdata.integral;
                        var length_1 = selfdata.Alllength;
                        if (length_1 > 20) {
                            this.AllRankLength = 20;
                        }
                        else {
                            this.AllRankLength = length_1;
                        }
                        this.ShowSelfRank(Myrank, MyId, Myintegral);
                        this.Sendsocket("AllRank", "0");
                        break;
                    case "总排行":
                        //记录当前人的排行
                        this.CurrentRankNumber++;
                        //接收前二十的数据并处理，最后打开排行榜面板
                        var Alldata = obj.data;
                        var RankData = {
                            Rank: this.CurrentRankNumber,
                            ID: Alldata.name,
                            integral: Alldata.integral
                        };
                        //将数据记录
                        this.let.push(RankData);
                        //打开排行榜面板
                        if (this.CurrentRankNumber == this.AllRankLength) {
                            //this.AllRankScroller = new eui.Scroller();
                            this.AllRankList = new eui.List();
                            this.AllRankList.dataProvider = new eui.ArrayCollection(this.let);
                            this.AllRankList.itemRenderer = ListItem;
                            this.AllRankScroller.viewport = this.AllRankList;
                            this.AllRankScroller.scrollPolicyH = eui.ScrollPolicy.OFF;
                            this.AllRankScroller.scrollPolicyV = eui.ScrollPolicy.ON;
                            //this.AllRankList.updateRenderer = this.gameCell.bind(this.let);
                            //this.AllRankList.itemRendererSkinName = ListItem;
                            this.RankingGroup.visible = true;
                        }
                        break;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    BeginPage.prototype.gameCell = function (renderer, itemIndex, data) {
        renderer.data = data;
        renderer.itemIndex = itemIndex;
        return renderer;
    };
    return BeginPage;
}(eui.Component));
__reflect(BeginPage.prototype, "BeginPage", ["eui.UIComponent", "egret.DisplayObject"]);
