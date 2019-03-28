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
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        var _this = _super.call(this) || this;
        //连接的网络IP
        _this.hostname = "192.168.0.21";
        //连接的网络端口
        _this.port = 8080;
        //是否时人机对战
        _this.isAI = false;
        //本机id
        _this.myid = "wangshushuo";
        _this.isRestart = false;
        _this.init();
        return _this;
    }
    SceneManager.instance = function () {
        if (!SceneManager._instance) {
            SceneManager._instance = new SceneManager();
        }
        return SceneManager._instance;
    };
    //初始化
    SceneManager.prototype.init = function () {
        //实例化场景界面
        this.beginScene = new BeginPage();
        this.gameScene = new GamePlay();
        //初始化网络连接
        this.webSocket = new egret.WebSocket;
        //设置传输的值的格式为二进制
        this.webSocket.type = egret.WebSocket.TYPE_STRING;
        //添加连接完成监听
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //添加连接断开时的监听
        this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //添加异常监听
        this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //连接服务器
        this.webSocket.connect(this.hostname, this.port);
        //默认添加开始场景
        this.addChild(this.beginScene);
    };
    //连接完成时的方法
    SceneManager.prototype.onSocketOpen = function () {
        console.log("连接成功");
    };
    //异常接收
    SceneManager.prototype.onSocketError = function () {
    };
    //断开监听
    SceneManager.prototype.onSocketClose = function () {
        console.log('服务器断开了');
    };
    //切换场景
    /**
     * type gameScene/beginScene
     */
    SceneManager.prototype.changeScene = function (type) {
        //移除所有界面	
        this.removeChildren();
        //初始化场景
        if (type == "gameScene") {
            this.gameScene = new GamePlay();
            this.addChild(this.gameScene);
        }
        else if (type == "beginScene") {
            //添加下一个场景
            this.beginScene = new BeginPage();
            this.addChild(this[type]);
        }
    };
    return SceneManager;
}(egret.Sprite));
__reflect(SceneManager.prototype, "SceneManager");
