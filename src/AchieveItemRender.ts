class AchieveItemRender extends eui.Component implements  eui.IItemRenderer{
	//成就完成按钮
	public AchieveBT:eui.Button;
	//成就标题
	public AchieveTitle:eui.Label;
	//成就进度
	public Achievejincheng:eui.Label;

	private pipei:Array<number> = [10,20,40,70,110,170,260,370,500];
	private shengli:Array<number> = [10,20,30,50,80,130,210,340,550];
	private fangyu:Array<number> = [20,40,80,120,180,240,320,400,500];

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
		console.log("添加成就");
		let istrue:boolean = false;
		var fenmu:number;
		var fenzi:number;
		switch(data.type){
			case "pipei":
			if(data.pipei > this.pipei.length){
				fenmu = this.pipei[this.pipei.length - 1];
			}else{
				fenmu = this.pipei[data.pipei];
			}
			fenzi = data.times;
			this.AchieveTitle.text = "进行"+fenmu+"场匹配对战";
			break;
			case "shengli":
			if(data.shengli > this.shengli.length){
				fenmu = this.shengli[this.shengli.length-1];
			}else{
				fenmu = this.shengli[data.shengli];
			}
			fenzi = data.win;
			this.AchieveTitle.text = "取得"+fenmu+"场匹配胜利";
			break;
			case "fangyu":
			if(data.fangyu > this.fangyu.length){
				fenmu = this.fangyu[this.fangyu.length-1];
			}else{
			fenmu = this.fangyu[data.fangyu];
			}
			fenzi = data.defense;
			this.AchieveTitle.text = "匹配对战中成功防御"+ fenmu +"次";
			break;
		}
		this.Achievejincheng.text = fenzi.toString() + "/" + fenmu.toString();
		this.AchieveBT.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
			this.Sendsocket("set",this._data.type);
		},this);
		if(fenzi >= fenmu){
			this.AchieveBT.label = "可领取";
			this.AchieveBT.enabled = true;
		}else{
			this.AchieveBT.label = "未完成";
			this.AchieveBT.enabled = false;
		}
	}
	
	private Sendsocket(start:string,achieve:string){
		var cmd = '{"id":"'+SceneManager.instance().myid+'","type":"Achieve","start":"'+start+'","achieve":"'+achieve+'"}';
		SceneManager.instance().webSocket.writeUTF(cmd);
	}
}