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
var SkinListItem = (function (_super) {
    __extends(SkinListItem, _super);
    function SkinListItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //计时器
        _this.timer = new egret.Timer(1000);
        return _this;
    }
    Object.defineProperty(SkinListItem.prototype, "data", {
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
    SkinListItem.prototype.updataView = function (data) {
        this.CurrentType = data['type'];
        var skinname = data['display'];
        this.skinLabel.text = skinname;
        if (this.CurrentType != "skin0" && this.CurrentType != "subskin0") {
            this.skinNumber = data[this.CurrentType];
            if (this.skinNumber > 0) {
                this.shade.visible = false;
                var skinTime = data[this.CurrentType + 'time'];
                this.OldTime = (new Date(skinTime)).valueOf();
                this.ComputationTime();
                this.timer = new egret.Timer(1000, 0);
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.ComputationTime, this);
                this.timer.start();
                if (this.CurrentType == data['CurrentSkin'] || this.CurrentType == data['CurrentSubSkin']) {
                    this.skinBt.skinName = "BG2";
                }
            }
            else {
                this.shade.visible = true;
                this.skintimelabel.text = "";
            }
        }
        else {
            this.shade.visible = false;
            this.skintimelabel.text = "";
        }
    };
    //发送信息到服务端
    SkinListItem.prototype.Sendsocket = function (start, skin) {
        var cmd = '{"id":"' + SceneManager.instance().myid + '","type":"Skin","start":"' + start + '","skin":"' + skin + '"}';
        SceneManager.instance().webSocket.writeUTF(cmd);
    };
    //计算时间(几天，起始时间)
    SkinListItem.prototype.ComputationTime = function () {
        console.log("计算时间！");
        var AllTime = this.skinNumber * 24 * 60 * 60; //皮肤的始场
        var NewTime = (new Date()).valueOf(); //当前的时间
        var diffValue = NewTime - this.OldTime; //到现在位置的时长
        diffValue = diffValue / 1000;
        if (diffValue > AllTime) {
            this.Sendsocket("set", this.CurrentType);
            this.skintimelabel.text = "";
            if (this.timer.running) {
                this.shade.visible = true;
                console.log("到时间了");
                this.timer.stop();
            }
        }
        else {
            diffValue = AllTime - diffValue;
            var timeString = "1"; //返回一个x天x时x分x秒的一个时间
            var day = Math.floor(diffValue / (24 * 3600)); //天
            diffValue = diffValue % (24 * 3600);
            var hour = Math.floor(diffValue / 3600); //时
            diffValue = diffValue % 3600;
            var minter = Math.floor(diffValue / 60); //分
            diffValue = diffValue % 60;
            var second = Math.floor(diffValue); //秒
            if (day > 0) {
                timeString = day.toString() + "d";
            }
            if (hour > 0) {
                if (timeString == "1") {
                    timeString = hour.toString() + "h";
                }
                else {
                    timeString += hour.toString() + "h";
                }
            }
            if (minter > 0) {
                if (timeString == "1") {
                    timeString = minter.toString() + "m";
                }
                else {
                    timeString += minter.toString() + "m";
                }
            }
            if (timeString == "1") {
                timeString = second.toString() + "s";
            }
            else {
                timeString += second.toString() + "s";
            }
            console.log(timeString);
            this.skintimelabel.text = timeString; //显示时间
        }
    };
    return SkinListItem;
}(eui.Component));
__reflect(SkinListItem.prototype, "SkinListItem", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
