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
        return _super !== null && _super.apply(this, arguments) || this;
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
        console.log(this.itemIndex);
        this.Bt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.Bt.enabled = false;
        }, this);
    };
    return AwardBt;
}(eui.Component));
__reflect(AwardBt.prototype, "AwardBt", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
