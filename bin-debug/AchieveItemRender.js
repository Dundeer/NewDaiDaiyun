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
var AchieveItemRender = (function (_super) {
    __extends(AchieveItemRender, _super);
    function AchieveItemRender() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pipei = [10, 20, 40, 70, 110, 170, 260, 370, 500];
        _this.shengli = [10, 20, 30, 50, 80, 130, 210, 340, 550];
        _this.fangyu = [20, 40, 80, 120, 180, 240, 320, 400, 500];
        return _this;
    }
    Object.defineProperty(AchieveItemRender.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
            this.updataView(data);
        },
        enumerable: true,
        configurable: true
    });
    AchieveItemRender.prototype.updataView = function (data) {
        console.log("添加成就");
        var istrue = false;
        var fenmu;
        var fenzi;
        switch (data.type) {
            case "pipei":
                if (data.pipei > this.pipei.length) {
                    fenmu = this.pipei[this.pipei.length - 1];
                }
                else {
                    fenmu = this.pipei[data.pipei];
                }
                fenzi = data.times;
                this.AchieveTitle.text = "进行" + fenmu + "场匹配对战";
                break;
            case "shengli":
                if (data.shengli > this.shengli.length) {
                    fenmu = this.shengli[this.shengli.length - 1];
                }
                else {
                    fenmu = this.shengli[data.shengli];
                }
                fenzi = data.win;
                this.AchieveTitle.text = "取得" + fenmu + "场匹配胜利";
                break;
            case "fangyu":
                if (data.fangyu > this.fangyu.length) {
                    fenmu = this.fangyu[this.fangyu.length - 1];
                }
                else {
                    fenmu = this.fangyu[data.fangyu];
                }
                fenzi = data.defense;
                this.AchieveTitle.text = "匹配对战中成功防御" + fenmu + "次";
                break;
        }
        this.Achievejincheng.text = fenzi.toString() + "/" + fenmu.toString();
        this.AchieveBT.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.Sendsocket("set", this._data.type);
        }, this);
        if (fenzi >= fenmu) {
            this.AchieveBT.label = "可领取";
            this.AchieveBT.enabled = true;
        }
        else {
            this.AchieveBT.label = "未完成";
            this.AchieveBT.enabled = false;
        }
    };
    AchieveItemRender.prototype.Sendsocket = function (start, achieve) {
        var cmd = '{"id":"' + SceneManager.instance().myid + '","type":"Achieve","start":"' + start + '","achieve":"' + achieve + '"}';
        SceneManager.instance().webSocket.writeUTF(cmd);
    };
    return AchieveItemRender;
}(eui.Component));
__reflect(AchieveItemRender.prototype, "AchieveItemRender", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
