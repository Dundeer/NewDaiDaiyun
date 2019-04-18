class ListItem extends eui.Component implements eui.IItemRenderer{
	//排名
	public RankLabel:eui.Label;
	//ID
	public UserName:eui.Label;
	//积分
	public integralLabel:eui.Label;
	//头像
	public headImage:eui.Image;

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
	public constructor() {
		super();
	}

	private updataView(data:any){
		console.log(data);
		this.headImage.source = data.head;
		this.RankLabel.text = data.Rank;
		this.UserName.text = data.ID;
		this.integralLabel.text = data.integral;
	}
}