class SkinListItem extends eui.Component implements  eui.IItemRenderer {
	
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