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
var AwardBt = (function (_super) {
    __extends(AwardBt, _super);
    function AwardBt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //奖池
        _this.jackpot = [];
        return _this;
    }
    Object.defineProperty(AwardBt.prototype, "data", {
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
    AwardBt.prototype.updataView = function (data) {
        this.SetJackpot(data);
        this.Bt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ButtonF, this);
        var OpenNumber = data["a" + this.itemIndex.toString()];
        if (OpenNumber == 0) {
            this.Bt.enabled = false;
        }
        else {
            this.Bt.enabled = true;
        }
    };
    AwardBt.prototype.ButtonF = function () {
        var gold = this._data.gold;
        if (gold >= 5) {
            this.Bt.enabled = false;
            var number = Math.floor(Math.random() * this.jackpot.length);
            var prizeStr;
            var jackpotStr = this.jackpot[number];
            var nowtime = (new Date()).valueOf();
            switch (jackpotStr) {
                case "gold1":
                    prizeStr = "一金币！";
                    break;
                case "gold5":
                    prizeStr = "五金币！";
                    break;
                case "gold10":
                    prizeStr = "十金币！";
                    break;
                case "skin1":
                    prizeStr = this._data.skin1;
                    break;
                case "skin2":
                    prizeStr = this._data.skin2;
                    break;
                case "skin3":
                    prizeStr = this._data.skin3;
                    break;
                case "subskin1":
                    prizeStr = this._data['subskin1'];
                    break;
                case "subskin2":
                    prizeStr = this._data['subskin2'];
                    break;
                case "subskin3":
                    prizeStr = this._data['subskin3'];
                    break;
            }
            SceneManager.instance().beginScene.OpenPrize(prizeStr);
            this.Sendsocket(this.itemIndex, jackpotStr);
        }
        else {
            SceneManager.instance().beginScene.OpenGoldHint();
        }
    };
    //设置奖池
    AwardBt.prototype.SetJackpot = function (Data) {
        this.jackpot.splice(0, this.jackpot.length);
        var gold1 = Data.gold1;
        for (var i = 0; i < gold1; i++) {
            this.jackpot.push("gold1");
        }
        var gold5 = Data.gold5;
        for (var j = 0; j < gold5; j++) {
            this.jackpot.push("gold5");
        }
        var gold10 = Data.gold10;
        if (gold10 == 1) {
            this.jackpot.push("gold10");
        }
        for (var n = 1; n < 4; n++) {
            if (Data['skin' + n.toString()] != null) {
                this.jackpot.push("skin" + n.toString());
            }
        }
        for (var m = 1; m < 4; m++) {
            if (Data['subskin' + m.toString()] != null) {
                this.jackpot.push('subskin' + m.toString());
            }
        }
    };
    AwardBt.prototype.Sendsocket = function (Button, award) {
        var cmd = '{"id":"' + SceneManager.instance().myid + '","type":"Award","start":"set","Button":"' + Button + '","award":"' + award + '"}';
        SceneManager.instance().webSocket.writeUTF(cmd);
    };
    return AwardBt;
}(eui.Component));
__reflect(AwardBt.prototype, "AwardBt", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
