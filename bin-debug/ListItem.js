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
var ListItem = (function (_super) {
    __extends(ListItem, _super);
    function ListItem() {
        return _super.call(this) || this;
    }
    Object.defineProperty(ListItem.prototype, "data", {
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
    ListItem.prototype.updataView = function (data) {
        this.RankLabel.text = data.Rank;
        this.IDLabel.text = data.ID;
        this.integralLabel.text = data.integral;
    };
    return ListItem;
}(eui.Component));
__reflect(ListItem.prototype, "ListItem", ["eui.IItemRenderer", "eui.UIComponent", "egret.DisplayObject"]);
