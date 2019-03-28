require("launcher/native_require.js");

egret_native.egtMain = function () {
    egret_native.nativeType = "native";

    egret_native.egretInit();
    egret_native.egretStart();

    var wid = egret_native.EGTView.getFrameWidth();
    var hei = egret_native.EGTView.getFrameHeight();

    egret_native.EGTView.setDesignSize(wid,hei);
    context.stage = new egret.Stage(wid,hei);
};
