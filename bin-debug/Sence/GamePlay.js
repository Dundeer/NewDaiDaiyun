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
var GamePlay = (function (_super) {
    __extends(GamePlay, _super);
    function GamePlay() {
        var _this = _super.call(this) || this;
        //自定义对象
        _this.Myun = []; //己方运的数组
        _this.Eyun = []; //敌方运的数组
        _this.AItouch = []; //本轮ai可以进行的出招
        _this.MyScoreShow = []; //己方成绩的组
        _this.EnemyScoreShow = []; //敌方成绩的数组
        _this.MyYun = 0; //己方拥有运的个数
        _this.EnemyYun = 0; //敌方拥有运的个数
        _this.TimeNumber = 3; //游戏开始倒计时的时间
        _this.GameTimeNumber = 3; //游戏中倒计时的时间
        _this.CurrentBout = 0; //当前回合数
        _this.MoveX = 560; //时间要移动到的位置
        _this.isDown = false; //是否到了可以检测的位置
        _this.KongImage = "kong_png"; //显示运为空是的图片
        _this.ManImage = "man_png"; //显示运为有时的图片
        _this.MyTouch = ""; //我的出招
        _this.EnemyTouch = ""; //敌人的出招
        _this.Result = ""; //一个回合的最终结果
        _this.CurrentLose = 0; //输的局数
        _this.CurrentWin = 0; //赢的局数
        _this.CurrentGame = 0; //当前时第几局
        _this.CurrentPing = 0; //当前平的局数
        _this.isAI = false; //是否时人机对战
        return _this;
    }
    GamePlay.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GamePlay.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.Restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.RestartBT, this);
        this.Back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.BackHome, this);
        //执行初始化
        this.init();
    };
    //重新匹配
    GamePlay.prototype.RestartBT = function () {
        if (this.isAI) {
            this.init();
        }
        else {
            SceneManager.instance().isRestart = true;
            this.SentSocket("0", "Quit", "0");
        }
    };
    //返回按钮	
    GamePlay.prototype.BackHome = function () {
        if (this.isAI) {
            this.RemoveBTFunction();
            SceneManager.instance().changeScene("beginScene");
        }
        else {
            SceneManager.instance().isRestart = false;
            this.SentSocket("0", "Quit", "0");
        }
    };
    //网络监听
    GamePlay.prototype.onReceiveMessage = function () {
        var msg = SceneManager.instance().webSocket.readUTF();
        try {
            var obj = JSON.parse(msg);
            if (typeof obj == "object" && obj) {
                console.log(obj.message);
                if (obj.message == "个人数据") {
                    if (this.CurrentPing == 2) {
                        this.setScoreText("平了！");
                    }
                    else if (this.CurrentLose == 2) {
                        this.setScoreText("你输了！");
                    }
                    else {
                        this.setScoreText("你赢了！");
                    }
                }
                else if (obj.message == "退出房间") {
                    this.RemoveAll();
                    SceneManager.instance().changeScene('beginScene');
                }
                else if (obj.message == "对方退出") {
                    if (this.CurrentGame <= 3) {
                        this.SentSocket("0", "Selfshuju", "ying");
                    }
                }
                else {
                    this.EnemyTouch = obj.data;
                    this.SetYUN(this.EnemyTime, this.EnemyTouch, this.EnemyTouchShow, this.EnemyYun, this.EnemyToggleGroup, this.Eyun, this.EnemyYunShow, this.EnemyYunLabel, "Enemyyun");
                    if (this.MyTouch != "") {
                        this.GameJudge();
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    //发送网络信息
    GamePlay.prototype.SentSocket = function (touch, type, start) {
        var id = SceneManager.instance().myid;
        var cmd = '{"id":"' + id + '","type":"' + type + '","play":"' + touch + '","start":"' + start + '"}';
        SceneManager.instance().webSocket.writeUTF(cmd);
    };
    //初始化
    GamePlay.prototype.init = function () {
        //是否时ai操作
        this.isAI = SceneManager.instance().isAI;
        if (!this.isAI) {
            SceneManager.instance().webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        }
        //关闭结束界面
        this.OverPanel.visible = false;
        //初始化当前的局数
        this.CurrentGame = 0;
        //初始化赢的局数
        this.CurrentWin = 0;
        //初始化输的局数
        this.CurrentLose = 0;
        //添加运的方法
        this.AddBTfunction();
        this.initGroup();
        //对一些公用项目初始化
        this.Allinit();
    };
    //通用项目初始化
    GamePlay.prototype.Allinit = function () {
        //显示倒计时遮罩面板
        this.TimeLabel.text = "3";
        this.TimeLabel.visible = true;
        //关闭所有按钮的功能
        this.CloseBt();
        //初始化回合状态
        this.CurrentBout = 0;
        this.Bout.text = "第" + this.CurrentBout.toString() + "回合";
        //初始化运的状态
        for (var i = 0; i < this.Myun.length; i++) {
            this.Myun[i].source = this.KongImage;
        }
        for (var n = 0; n < this.Eyun.length; n++) {
            this.Eyun[n].source = this.KongImage;
        }
        //敌我的运数
        this.MyYun = 0;
        this.EnemyYun = 0;
        //初始化倒计时
        this.TimeNumber = 3;
        this.GameTimeNumber = 3;
        //通用代码
        this.playInit();
        //设置时间检测
        var timer = new egret.Timer(1000, 3);
        //设置时间中要检测的方法
        timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        //设置时间检测结束的方法
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComplete, this);
        //开始时间检测
        timer.start();
    };
    //剥离出重复代码
    GamePlay.prototype.playInit = function () {
        //重置结果
        this.Result = "";
        //关闭胜负显示
        this.ScoreTime.visible = false;
        //初始化出招
        this.MyTouch = "";
        this.EnemyTouch = "";
        //初始化出招显示
        this.MyTouchShow.visible = false;
        this.EnemyTouchShow.visible = false;
        //将时间格的位置还原
        this.MyTime.x = 890;
        this.EnemyTime.x = 230;
    };
    //游戏运行
    GamePlay.prototype.GamePlaying = function () {
        var _this = this;
        //增加回合
        this.CurrentBout++;
        this.Bout.text = "第" + this.CurrentBout.toString() + "回合";
        if (this.CurrentBout > 100) {
            //添加局数
            this.CurrentPing++;
            this.EndSetText("平");
            this.SetResult();
            return;
        }
        //通用代码
        this.playInit();
        //设置战斗倒计时
        this.GameTimeNumber = 3;
        // let timer:egret.Timer = new egret.Timer(500,5);
        // timer.addEventListener(egret.TimerEvent.TIMER,
        // this.GameTime,this);
        //战斗倒计时开始
        //timer.start();
        this.OpenBt();
        //初始化对局结果
        this.Result = "";
        //添加tween动画
        egret.Tween.get(this.MyTime).to({
            x: this.MoveX
        }, 3000).call(function () {
            if (_this.MyTouch == "") {
                _this.AddYUN();
            }
        });
        egret.Tween.get(this.EnemyTime).to({
            x: this.MoveX
        }, 3000);
    };
    //添加攻防按钮的方法
    GamePlay.prototype.AddBTfunction = function () {
        this.yunBT.addEventListener(egret.TouchEvent.TOUCH_TAP, this.AddYUN, this);
        this.OneLevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchone, this);
        this.TwolevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchtwo, this);
        this.ThreeLevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchthree, this);
        this.OneLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefenseone, this);
        this.TwoLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefensetwo, this);
        this.ThreeLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefensethree, this);
    };
    //移除剩余的按钮事件
    GamePlay.prototype.RemoveAll = function () {
        if (this.Restart.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.Restart.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.RestartBT, this);
        }
        if (this.Back.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.Back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.BackHome, this);
        }
        if (SceneManager.instance().webSocket.hasEventListener(egret.ProgressEvent.SOCKET_DATA)) {
            SceneManager.instance().webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        }
    };
    //移除所有的按钮事件
    GamePlay.prototype.RemoveBTFunction = function () {
        if (this.yunBT.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.yunBT.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.AddYUN, this);
        }
        if (this.OneLevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.OneLevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchone, this);
        }
        if (this.TwolevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.TwolevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchtwo, this);
        }
        if (this.ThreeLevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.ThreeLevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetPunchthree, this);
        }
        if (this.OneLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.OneLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefenseone, this);
        }
        if (this.TwoLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.TwoLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefensetwo, this);
        }
        if (this.ThreeLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.ThreeLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.SetDefensethree, this);
        }
    };
    //设置三防的方法
    GamePlay.prototype.SetDefensethree = function () {
        //记录玩家的招式
        this.MyTouch = "defense3";
        //设置运的UI改变
        this.SetMyYun();
    };
    //设置二防的方法
    GamePlay.prototype.SetDefensetwo = function () {
        //记录玩家的招式
        this.MyTouch = "defense2";
        //设置运的UI改变
        this.SetMyYun();
    };
    //设置一防的方法
    GamePlay.prototype.SetDefenseone = function () {
        //记录玩家的招式
        this.MyTouch = "defense1";
        //设置运的UI改变
        this.SetMyYun();
    };
    //设置三拳的方法
    GamePlay.prototype.SetPunchthree = function () {
        //记录玩家的招式
        this.MyTouch = "Punch3";
        //设置运的UI改变
        this.SetMyYun();
    };
    //设置二拳的方法
    GamePlay.prototype.SetPunchtwo = function () {
        //记录玩家的招式
        this.MyTouch = "Punch2";
        //设置运的UI改变
        this.SetMyYun();
    };
    //设置一拳的方法
    GamePlay.prototype.SetPunchone = function () {
        //记录玩家的招式
        this.MyTouch = "Punch1";
        //设置运的UI改变
        this.SetMyYun();
    };
    //执行运的方法
    GamePlay.prototype.AddYUN = function () {
        //记录玩家的招式	
        this.MyTouch = "Yun";
        //设置运的UI改变	
        this.SetMyYun();
    };
    //打开一部分按钮
    GamePlay.prototype.OpenBt = function () {
        //开启全部不需要运的按钮
        this.yunBT.enabled = true;
        this.OneLevelDefense.enabled = true;
        this.TwoLevelDefense.enabled = true;
        this.ThreeLevelDefense.enabled = true;
        //判断运数开启相应的拳的按钮
        if (this.MyYun >= 3) {
            this.OneLevelPunch.enabled = true;
            this.TwolevelPunch.enabled = true;
            this.ThreeLevelPunch.enabled = true;
        }
        else if (this.MyYun == 2) {
            this.OneLevelPunch.enabled = true;
            this.TwolevelPunch.enabled = true;
        }
        else if (this.MyYun == 1) {
            this.OneLevelPunch.enabled = true;
        }
    };
    //关闭所有按钮
    GamePlay.prototype.CloseBt = function () {
        //开始时将所有的按钮关闭
        this.yunBT.enabled = false;
        this.OneLevelPunch.enabled = false;
        this.TwolevelPunch.enabled = false;
        this.ThreeLevelPunch.enabled = false;
        this.OneLevelDefense.enabled = false;
        this.TwoLevelDefense.enabled = false;
        this.ThreeLevelDefense.enabled = false;
    };
    //战斗时间事件
    // private GameTime(){
    // 	//每次检测减少时间
    // 	this.GameTimeNumber -= 0.5;
    // 	//当时间小于等于0.2时
    // 	if(this.GameTimeNumber == 0.5){
    // 	}
    // }
    //倒计时完成
    GamePlay.prototype.timerComplete = function () {
        //将遮罩关闭
        this.TimeLabel.visible = false;
        //游戏开始
        this.GamePlaying();
    };
    //倒计时显示方法
    GamePlay.prototype.timerFunc = function () {
        //减少倒计时
        this.TimeNumber--;
        //将倒计时显示出来
        this.TimeLabel.text = this.TimeNumber.toString();
    };
    //初始化数组
    GamePlay.prototype.initGroup = function () {
        this.initimageGroup(this.Myun, this.MyToggleGroup);
        this.initimageGroup(this.Eyun, this.EnemyToggleGroup);
        this.initlabelGroup(this.MyScoreShow, this.MyScore);
        this.initlabelGroup(this.EnemyScoreShow, this.EnemyScore);
    };
    //初始化image组
    GamePlay.prototype.initimageGroup = function (imagegroup, togglegroup) {
        //清空数组
        imagegroup.splice(0, imagegroup.length);
        //将Group里的图片添加到己方的数组中
        for (var i = 0; i < togglegroup.numChildren; i++) {
            var nimage = new eui.Image();
            nimage = togglegroup.getChildAt(i);
            imagegroup.push(nimage);
        }
    };
    //初始化label组
    GamePlay.prototype.initlabelGroup = function (labelgroup, togglegroup) {
        //清空数组
        labelgroup.splice(0, labelgroup.length);
        //将Group里的文字添加到敌方的数组中
        for (var t = 0; t < togglegroup.numChildren; t++) {
            var nlabel = new eui.Label();
            nlabel = togglegroup.getChildAt(t);
            nlabel.visible = false;
            labelgroup.push(nlabel);
        }
    };
    //设置己方yun的ui显示
    GamePlay.prototype.SetMyYun = function () {
        //关闭所有可点击事件
        this.CloseBt();
        //执行人机操作
        if (this.isAI) {
            this.AIout();
        }
        else {
            //不是人机的话发送招式到服务器
            this.SentSocket(this.MyTouch, "Gaming", "0");
        }
        this.SetYUN(this.MyTime, this.MyTouch, this.MyTouchShow, this.MyYun, this.MyToggleGroup, this.Myun, this.MyYunShow, this.MyYunLabel, "Myyun");
        //执行回合判断操作
        if (this.EnemyTouch != "") {
            this.GameJudge();
        }
    };
    //根据招式进行操作
    GamePlay.prototype.TouchAndYun = function (str, number, name) {
        switch (str) {
            case "Yun":
                //先加一个运		
                number++;
                break;
            case "Punch1":
                //先减一个运		
                number -= 1;
                break;
            case "Punch2":
                //先减两个运		
                number -= 2;
                break;
            case "Punch3":
                //先减三个运
                number -= 3;
                break;
        }
        if (name == "Myyun") {
            this.MyYun = number;
        }
        else {
            this.EnemyYun = number;
        }
        return number;
    };
    //设置出招显示
    GamePlay.prototype.setTouchlabel = function (str, label) {
        var touchlabel;
        switch (str) {
            case "Yun":
                touchlabel = "运";
                break;
            case "Punch1":
                touchlabel = "拳1";
                break;
            case "Punch2":
                touchlabel = "拳2";
                break;
            case "Punch3":
                touchlabel = "拳3";
                break;
            case "defense1":
                touchlabel = "防1";
                break;
            case "defense2":
                touchlabel = "防2";
                break;
            case "defense3":
                touchlabel = "防3";
                break;
        }
        label.text = touchlabel;
        label.visible = true;
    };
    //设置yun
    GamePlay.prototype.SetYUN = function (tImage, touch, touchshow, Yun, togglegroup, yImage, yShowGroup, Ylabel, name) {
        //停止时间格的移动
        egret.Tween.removeTweens(tImage);
        //设置招式显示   
        this.setTouchlabel(touch, touchshow);
        //根据招式操作运
        Yun = this.TouchAndYun(touch, Yun, name);
        //当运数小于6个时用图片表示    
        if (Yun < 6) {
            //如果组关闭了，则开启		
            if (togglegroup.visible == false) {
                yShowGroup.visible = false;
                togglegroup.visible = true;
            }
            var number = Yun;
            for (var i = 0; i < yImage.length; i++) {
                if (number > 0) {
                    yImage[i].source = this.ManImage;
                    number--;
                }
                else {
                    yImage[i].source = this.KongImage;
                }
            }
        }
        else {
            if (yShowGroup.visible == false) {
                yShowGroup.visible = true;
                togglegroup.visible = false;
            }
            //给敌方的yun文字显示赋值
            Ylabel.text = Yun.toString();
        }
    };
    //人机输出
    GamePlay.prototype.AIout = function () {
        //先把招式数组清空
        this.AItouch.splice(0, this.AItouch.length);
        //判断己方有多少运，从而判断人机可以执行哪些操作
        this.AItouch.push("Yun");
        if (this.EnemyYun == 1) {
            this.AItouch.push("Punch1");
        }
        if (this.EnemyYun == 2) {
            this.AItouch.push("Punch2");
        }
        if (this.EnemyYun >= 3) {
            this.AItouch.push("Punch3");
        }
        if (this.MyYun >= 3) {
            this.AItouch.push("defense1");
            this.AItouch.push("defense2");
            this.AItouch.push("defense3");
        }
        else if (this.MyYun == 2) {
            this.AItouch.push("defense1");
            this.AItouch.push("defense2");
        }
        else if (this.MyYun == 1) {
            this.AItouch.push("defense1");
        }
        //随机获得数组内的一个招式
        var number = Math.floor(Math.random() * this.AItouch.length);
        //记录出招
        this.EnemyTouch = this.AItouch[number];
        //出招操作
        this.SetYUN(this.EnemyTime, this.EnemyTouch, this.EnemyTouchShow, this.EnemyYun, this.EnemyToggleGroup, this.Eyun, this.EnemyYunShow, this.EnemyYunLabel, "Enemyyun");
    };
    //进行判定双方的招式
    GamePlay.prototype.GameJudge = function () {
        if (this.MyTouch == "Yun") {
            if (this.EnemyTouch == "Punch1"
                || this.EnemyTouch == "Punch2"
                || this.EnemyTouch == "Punch3") {
                //输了
                this.Result = "Shule";
            }
            else {
                //平了
                this.Result = "Pingle";
            }
        }
        else if (this.MyTouch == "defense1") {
            if (this.EnemyTouch == "Punch2"
                || this.EnemyTouch == "Punch3") {
                //输了
                this.Result = "Shule";
            }
            else {
                //平了
                this.Result = "Pingle";
            }
        }
        else if (this.MyTouch == "defense2") {
            if (this.EnemyTouch == "Punch1"
                || this.EnemyTouch == "Punch3") {
                //输了
                this.Result = "Shule";
            }
            else {
                //平了
                this.Result = "Pingle";
            }
        }
        else if (this.MyTouch == "defense3") {
            if (this.EnemyTouch == "Punch2"
                || this.EnemyTouch == "Punch1") {
                //输了
                this.Result = "Shule";
            }
            else {
                //平了
                this.Result = "Pingle";
            }
        }
        else if (this.MyTouch == "Punch1") {
            if (this.EnemyTouch == "Punch2"
                || this.EnemyTouch == "Punch3") {
                //输了
                this.Result = "Shule";
            }
            else if (this.EnemyTouch == "defense1" ||
                this.EnemyTouch == "Punch1") {
                //平了
                this.Result = "Pingle";
            }
            else {
                //赢了	
                this.Result = "Yingle";
            }
        }
        else if (this.MyTouch == "Punch2") {
            if (this.EnemyTouch == "Punch3") {
                //输了
                this.Result = "Shule";
            }
            else if (this.EnemyTouch == "defense2" ||
                this.EnemyTouch == "Punch2") {
                //平了
                this.Result = "Pingle";
            }
            else {
                //赢了	
                this.Result = "Yingle";
            }
        }
        else if (this.MyTouch == "Punch3") {
            if (this.EnemyTouch == "defense3"
                || this.EnemyTouch == "Punch3") {
                //平了
                this.Result = "Pingle";
            }
            else {
                //赢了	
                this.Result = "Yingle";
            }
        }
        this.SetResult();
    };
    //根据对局结果进行操作
    GamePlay.prototype.SetResult = function () {
        //播放动画	
        //出现胜负结果	
        switch (this.Result) {
            case "Pingle":
                break;
            case "Shule":
                //添加败局
                this.CurrentLose++;
                this.EndSetText("输");
                break;
            case "Yingle":
                //添加胜局
                this.CurrentWin++;
                this.EndSetText("赢");
                break;
        }
        //如果已经大于三局
        if (this.CurrentWin == 2) {
            if (this.isAI) {
                this.setScoreText("你赢了！");
            }
            else {
                this.SentSocket("0", "Selfshuju", "ying");
            }
        }
        else if (this.CurrentLose == 2) {
            if (this.isAI) {
                this.setScoreText("你输了！");
            }
            else {
                this.SentSocket("0", "Selfshuju", "shu");
            }
        }
        else if (this.CurrentPing == 2) {
            if (this.isAI) {
                this.setScoreText("平了！");
            }
            else {
                this.SentSocket("0", "Selfshuju", "ping");
            }
        }
        else {
            //执行回合操作	
            var timer = new egret.Timer(2000, 1);
            timer.addEventListener(egret.TimerEvent.TIMER, this.delayResult, this);
            timer.start();
        }
    };
    //延迟重置回合操作
    GamePlay.prototype.delayResult = function () {
        if (this.Result == "Pingle") {
            this.GamePlaying();
        }
        else if (this.Result == "Shule" || this.Result == "Yingle") {
            this.Allinit();
        }
    };
    //设置成绩栏的显示
    GamePlay.prototype.setScoreText = function (str) {
        //定义最终成绩的文字
        this.FinalScoreShow.text = str;
        //显示结束面板	
        this.OverPanel.visible = true;
        //移除所有按钮事件	
        this.RemoveBTFunction();
    };
    //对胜负显示的操作
    GamePlay.prototype.EndSetText = function (text) {
        //显示全局的胜负
        this.ScoreTime.text = text;
        this.ScoreTime.visible = true;
        //显示小的胜负关系
        //设置己方胜负
        this.MyScoreShow[this.CurrentGame].text = text;
        this.MyScoreShow[this.CurrentGame].visible = true;
        //设置敌方胜负
        var Etext;
        if (text == "赢") {
            Etext = "输";
        }
        else if (text == "平") {
            Etext = "平";
        }
        else {
            Etext = "赢";
        }
        this.EnemyScoreShow[this.CurrentGame].text = Etext;
        this.EnemyScoreShow[this.CurrentGame].visible = true;
        //记录当前第几局
        this.CurrentGame++;
    };
    return GamePlay;
}(eui.Component));
__reflect(GamePlay.prototype, "GamePlay", ["eui.UIComponent", "egret.DisplayObject"]);
