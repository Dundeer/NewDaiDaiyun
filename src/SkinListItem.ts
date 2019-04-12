class SkinListItem extends eui.Component implements  eui.IItemRenderer {
	//皮肤的图片
	public SkinImage:eui.Image;
	//皮肤名称
	public skinLabel:eui.Label;
	//皮肤的时间显示
	public skintimelabel:eui.Label;

	//当前单元的样式
	private CurrentType;

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

	}

}