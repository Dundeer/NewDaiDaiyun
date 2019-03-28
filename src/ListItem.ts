class ListItem extends eui.Component implements eui.IItemRenderer{
	//排名
	public RankLabel:eui.Label;
	//ID
	public IDLabel:eui.Label;
	//积分
	public integralLabel:eui.Label;

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
		this.RankLabel.text = data.Rank;
		this.IDLabel.text = data.ID;
		this.integralLabel.text = data.integral;
	}
}