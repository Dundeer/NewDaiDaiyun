class AwardBt extends eui.Component implements  eui.IItemRenderer {
	//抽奖按钮
    public Bt:eui.Button;

	private _data:any;
	public set data(data:any){
		this._data = data;
		this.updataView(data);
	}
	public get data():any{
		return this._data;
	}
	public selected:boolean;
	public itemIndex:number;

	private updataView(data:any){
		this.Bt.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
			this.Bt.enabled = false;
			this.Sendsocket(this.itemIndex);
		},this);
		let OpenNumber = data["a"+this.itemIndex.toString()];
		console.log(OpenNumber);
		if(OpenNumber == 0){
			this.Bt.enabled = false;
		}
	}

	private Sendsocket(Button:number){
		var cmd = '{"id":"'+SceneManager.instance().myid+'","type":"Award","start":"set","Button":"'+Button+'"}';
		SceneManager.instance().webSocket.writeUTF(cmd);
	}
	
}