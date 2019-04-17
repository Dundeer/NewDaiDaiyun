class AwardBt extends eui.Component implements  eui.IItemRenderer {
	//抽奖按钮
    public Bt:eui.Button;
	//奖池
	public jackpot:Array<string> = [];

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
		this.SetJackpot(data);
		this.Bt.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ButtonF,this);
		let OpenNumber = data["a"+this.itemIndex.toString()];
		if(OpenNumber == 0){
			this.Bt.enabled = false;
		}else{
			this.Bt.enabled = true;
		}
	}

	private ButtonF(){
		var gold:number = this._data.gold;
		if(gold >= 5){
			this.Bt.enabled = false;
			var number:number = Math.floor(Math.random() * this.jackpot.length);
			var prizeStr:string;
			var jackpotStr:string = this.jackpot[number];
			var nowtime = (new Date()).valueOf();
			switch(jackpotStr){
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
			this.Sendsocket(this.itemIndex,jackpotStr);
		}else{
			SceneManager.instance().beginScene.OpenGoldHint();
		}
		
	}

	//设置奖池
	private SetJackpot(Data){
		this.jackpot.splice(0,this.jackpot.length);
		let gold1:number = Data.gold1;
		for(let i = 0;i < gold1;i++){
			this.jackpot.push("gold1");
		}
		let gold5:number = Data.gold5;
		for(let j = 0;j < gold5;j++){
			this.jackpot.push("gold5");
		}
		let gold10:number = Data.gold10;
		if(gold10 == 1){
			this.jackpot.push("gold10");
		}
		for(let n = 1;n < 4;n++){
			if(Data['skin'+n.toString()] != null){
				this.jackpot.push("skin"+n.toString());
			}
		}
		for(let m = 1;m < 4;m++){
			if(Data['subskin'+m.toString()] != null){
				this.jackpot.push('subskin'+m.toString());
			}
		}
	}

	private Sendsocket(Button:number,award:string){
		var cmd = '{"id":"'+SceneManager.instance().mynickName+'","type":"Award","start":"set","Button":"'+Button+'","award":"'+award+'"}';
		SceneManager.instance().webSocket.writeUTF(cmd);
	}
	
}