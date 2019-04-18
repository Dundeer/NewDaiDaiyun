//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor(Main:Main) {
        super();
        this.Main = Main;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.createView,this);
    }
    private Main:Main;
    private textField: egret.TextField;
    private BG:egret.Bitmap;//加载大背景
    private loadingBar:eui.ProgressBar;//滚动条
    private Cursor:egret.Bitmap;//滚动条光标
    private StartGame:eui.Button;
    private frame:number = 1;
    private timer:egret.Timer = new egret.Timer(41,100);
    private async createView(){
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;

        //加载大背景
        this.BG = new egret.Bitmap();
        this.BG.texture = RES.getRes('fireBG_jpg');
        this.BG.width = this.width;
        this.BG.height = this.height;
        this.addChild(this.BG);
        //加载进度条
        this.loadingBar = new eui.ProgressBar();
        this.loadingBar.width = this.width * ( 2 / 3 );
        this.loadingBar.height = 120;
        this.loadingBar.y = this.height / 2 - this.loadingBar.height / 2;
        this.loadingBar.x = this.width / 2 - this.loadingBar.width / 2;
        this.loadingBar.maximum = 100;
        this.loadingBar.minimum = 0;
        this.loadingBar.value = 0;
        this.addChild(this.loadingBar);
        //加载光标
        this.Cursor = new egret.Bitmap();
        this.Cursor.texture = RES.getRes('bi1_png');
        this.Cursor.width = this.loadingBar.height * 0.8;
        this.Cursor.height = this.loadingBar.height * 0.8;
        this.Cursor.x = this.loadingBar.x;
        this.Cursor.y = this.loadingBar.y;
        this.addChild(this.Cursor);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.FrameAnima,this);
        this.timer.start();
    }

    public onProgress(current: number, total: number): void {
        var value:number = Math.floor((current / total) * 100);
        this.loadingBar.value = value;
    }

    private FrameAnima(){
        let value:number = this.loadingBar.value / 100;
        if(value == 1)
        {
            this.timer.stop();
            this.Cursor.x = this.loadingBar.x + this.loadingBar.width - ( this.Cursor.width / 2 );
            this.Cursor.texture = RES.getRes('bi1_png');
        }
        else
        {
            this.frame++;
            if(this.frame > 4)
            {
                this.frame = 1;
            }
            var CurX = this.loadingBar.x + (value * this.loadingBar.width);
            this.Cursor.x = CurX;
            this.Cursor.texture = RES.getRes('bi' + this.frame + '_png');
        }
    }
}
