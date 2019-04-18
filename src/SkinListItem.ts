class SkinListItem extends eui.Component implements  eui.IItemRenderer {
	//皮肤的图片
	public SkinImage:eui.Image;
	//皮肤名称
	public skinLabel:eui.Label;
	//皮肤的时间显示
	public skintimelabel:eui.Label;
	//遮罩
	public shade:eui.Rect;
	//切换按钮
	public skinBt:eui.Button;

	//当前单元的样式
	private CurrentType:string;
	//计时器
	private timer:egret.Timer = new egret.Timer(1000,1000);
	//皮肤个数
	private skinNumber:number;
	//起始时间
	private OldTime:number;
	//皮肤样式
	private skinType = SceneManager.instance().beginScene.CurrentSkin;

	private _data:any;
	public set data(data:any){
		this._data = data;
		this.updateView(data);
	}
	public get data():any{
		return this._data;
	}
	public selected:boolean;
	public itemIndex:number;

	//更新显示
	private updateView(data:any)
	{
		this.CurrentType = data['type'];
		let skinname:string = data['display'];
		this.skinLabel.text = skinname;
		if(this.CurrentType != "skin0"&&this.CurrentType != "subskin0"){
			this.skinNumber = data[this.CurrentType];
			if(this.skinNumber > 0){
				this.shade.visible = false;
				let skinTime:string = data[this.CurrentType + 'time'];
				this.OldTime = (new Date(skinTime)).valueOf();
				this.timer = new egret.Timer(1000,0);
			    this.timer.addEventListener(egret.TimerEvent.TIMER,this.ComputationTime,this);
			    this.timer.start();
				if(this.CurrentType == data['CurrentSkin'] || this.CurrentType == data['CurrentSubSkin']){
					this.skinBt.skinName = "BG2";
				}
			}
			else
			{
				this.shade.visible = true;
				this.skintimelabel.text = "";
			}
		}else{
			this.shade.visible = false;
			this.skintimelabel.text = "";
		}
	}

	//发送信息到服务端
    private Sendsocket(start:string,skin:string,skinType:string){
		SceneManager.instance().Sendsocket("Skin",start,skin,-1,"","",skinType);
	}
	
	//计算时间(几天，起始时间)
	private ComputationTime(){
		console.log("计算时间！");
		let AllTime:number = this.skinNumber * 24 * 60 * 60;//皮肤的始场
		let NewTime:number = (new Date()).valueOf();//当前的时间
		let diffValue:number = NewTime - this.OldTime;//到现在位置的时长
		diffValue = diffValue / 1000;
		if(diffValue > AllTime)
		{
			this.skintimelabel.text = "";
			this.shade.visible = true;
			if(this.timer.running)
			{
				this.Sendsocket("set",this.CurrentType,this.skinType);
				console.log("到时间了");
				this.timer.stop();
			}
		}
		else
		{
			diffValue = AllTime - diffValue;
			let timeString:string = "1";//返回一个x天x时x分x秒的一个时间
			let day:number = Math.floor(diffValue / (24 * 3600));//天
			diffValue = diffValue % (24 * 3600);
			let hour:number =  Math.floor(diffValue / 3600);//时
			diffValue = diffValue % 3600;
			let minter:number = Math.floor(diffValue / 60);//分
			diffValue = diffValue % 60;
			let second:number = Math.floor(diffValue);//秒
			if(day > 0){
				timeString = day.toString() + "d";
			}
			if(hour > 0){
				if(timeString == "1"){
					timeString = hour.toString() + "h";
				}else{
					timeString += hour.toString() + "h";
				}
			}
			if(minter > 0){
				if(timeString == "1"){
					timeString = minter.toString() + "m";
				}else{
					timeString += minter.toString() + "m";
				}
			}
			if(timeString == "1"){
				timeString = second.toString() + "s";
			}else{
				timeString += second.toString() + "s";
			}
			console.log(timeString);
			this.skintimelabel.text = timeString;//显示时间
		}
	}

}