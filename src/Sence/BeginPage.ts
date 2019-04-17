class BeginPage extends eui.Component implements  eui.UIComponent {
//音量开关按钮
	public VioceBtn:eui.Button;

	//人机对战按钮
	public AIBtn:eui.Button;
	//好友对战按钮
	public FriBtn:eui.Button;
	//匹配对战按钮
	public MatchingBtn:eui.Button;
	//排行按钮
	public RankBtn:eui.Button;
	//规则按钮
	public RuleBtn:eui.Button;
	//战绩按钮
	public RecordBtn:eui.Button;
	//分享按钮
	public ShareBtn:eui.Button;
	//匹配返回主界面
	public MatchingBack:eui.Button;
	//匹配面板
	public Matching:eui.Group;
	//战绩面板
	public RecordGroup:eui.Group;
	//战斗场次
	public FireNumber:eui.Label;
	//胜率的文字显示
	public shenglv:eui.Label;
	//积分的文字显示
	public jifen:eui.Label;
	//战绩返回主界面
	public RecordBack:eui.Button;
	//规则面板
	public Rule:eui.Group;
	//规则返回主页面
	public RuleBack:eui.Button;
	//排行界面
	public RankingGroup:eui.Group;
	//排行返回主界面按钮
	public RankBack:eui.Button;
	//我的排位
	public MyRankTable:eui.Label;
	//我的头像
	public MyHead:eui.Image;
	//我的ID
	public MyIDLabel:eui.Label;
	//我的积分
	public MyIntegralLable:eui.Label;
	//前二十的人排位列表
	public AllRankList:eui.List;
	//滚动条
	public AllRankScroller:eui.Scroller;
	//抽奖按钮
	public choujiangBT:eui.Button;
	//皮肤按钮
	public pifuBT:eui.Button;
	//最高排位文字
	public highest:eui.Label;
	//成就列表
	public achieveGroup:eui.Group;
	//成就返回按钮
	public achieveBack:eui.Button;
	//抽奖列表
	public AwardGroup:eui.Group;
	//抽奖返回
	public AwardBack:eui.Button;
	//换一盒按钮
	public ChangedBox:eui.Button;
	//皮肤列表
	public SkinGroup:eui.Group;
	//皮肤返回按钮
	public SkinBack:eui.Button;
	//成就按钮
	public AchieveBtn:eui.Button;
	//成就的滚动条
	public AchieveScroller:eui.Scroller;
	//成就的显示列表
	public AchieveList:eui.List;
	//抽奖的列表
	public AwardList:eui.List;
	//抽奖的滚动
	public AwardScroller:eui.Scroller;
	//抽奖中的金币显示
	public goldTable:eui.Label;
	//显示奖励
	public prize:eui.Group;
	//显示奖励的文字
	public prizeTable:eui.Label;
	//显示奖励的图片
	public prizeImage:eui.Image;
	//关闭显示奖励按钮
	public prizeBack:eui.Button;
	//金币不足提示
	public goldhint:eui.Group;
	//金币不足返回按钮
	public goldhintBack:eui.Button;
	//开启奖励视频按钮
	public goldhintConfirm:eui.Button;
	//人物皮肤按钮
	public ManSkin:eui.Button;
	//替身皮肤按钮
	public SubSkin:eui.Button;
	//观看广告按钮
	public adevrt:eui.Button;
	//人物皮肤显示的组
	public skinScoller:eui.Scroller;
	//人物皮肤的列表
	public skinlist:eui.List;

	//发送信息时使用的id
	private id:string;
	//是否开启匹配
	public ismatching = false;
	//当前数据的排位
	private CurrentRankNumber:number = 0;
	//会发送过来的数据长度
	private AllRankLength = 0;
	//防止排行数据的数组
	private let = [];
	//放置成就数据的数组
	private AchieveG = [];
	//皮肤的数组
	private SkinG = [];
	//发送过来的成就的数据的长度
	private AllAchieveLength = 0;
	//皮肤列表的长度
	private SkinLength:number = 0;
	//成就的数据存储
	private AchieveArrayColl:eui.ArrayCollection;
	//排行的数据存储
	private AllRankAchieveArrayColl:eui.ArrayCollection;
	//抽奖的数据储存
	private AwardCollection:eui.ArrayCollection;
	//皮肤数据的储存
	private SkinCollection:eui.ArrayCollection;
	//当前金币个数
	public CurrentGold:number = 0;
	//当前显示皮肤
	public CurrentSkin = "skin";

public constructor() {		
	super();
}

protected partAdded(partName:string,instance:any):void
{
	super.partAdded(partName,instance);
}

protected childrenCreated():void
{
	super.childrenCreated();
	this.init();
}	

//初始化
private init(){
	//添加事件
	this.AddEvent();
	//获取用户id
	this.id = SceneManager.instance().mynickName;
	//关闭皮肤面板
	this.CloseSkin();
	//关闭金币提示面板
	this.CloseGoldHint();
	//关闭抽奖面板
	this.CloseAward();
	//关闭成就面板
	this.CloseAchieve();
	//初始化规则面板
	this.CloseRule();
	//初始化战绩面板
	this.CloseRecord();
	//初始化排行
	this.CloseRank();
	//如果玩家想要立即再匹配一局则打开匹配功能否则关闭匹配面板
	if(SceneManager.instance().isRestart){
		this.matching();
		SceneManager.instance().isRestart = false;
	}else{
		this.Matching.visible = false;
	}
}
//添加的所有事件
private AddEvent(){
	//关闭金币提示按钮
	this.goldhintBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseGoldHint,this);
	//抽奖按钮
	this.choujiangBT.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenAward,this);
	//抽奖返回按钮
	this.AwardBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseAward,this);
	//成就列表返回按钮
	this.achieveBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseAchieve,this);
	//成就按钮
	this.AchieveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenAchieve,this);
	//排行榜返回按钮
	this.RankBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseRank,
	this);
	//排行榜按钮
	this.RankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenRank,
	this);
	//规则返回按钮
	this.RuleBack.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.CloseRule,this);
	//规则按钮
	this.RuleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenRule,
	this);
	//战绩返回按钮
	this.RecordBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseRecord,this);
	//战绩按钮
	this.RecordBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.Record,this);
	//给人机对战按钮绑定点击事件
	this.AIBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.ai,this);
	//给匹配对战按钮绑定点击事件
	this.MatchingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.matching,this);
	//匹配返回按钮
	this.MatchingBack.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.BackBegin,this);
	//服务器数据监听
	SceneManager.instance().webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA,
	this.onReceiveMessage,this);
	//关闭奖励提示按钮
	this.prizeBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ClosePrize,this);
	//换一盒
	this.ChangedBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ChangeNewBox,this);
	//关闭皮肤面板
	this.SkinBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CloseSkin,this);
	//开启皮肤面板
	this.pifuBT.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenSkin,this);
	//替身皮肤按钮
	this.SubSkin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenSubSkin,this);
	//皮肤按钮
	this.ManSkin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenSkin,this);
}
//移除所有事件
private RemoveEvent(){
	if(this.SubSkin.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.SubSkin.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenSubSkin,this);
	}
	if(this.ManSkin.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.ManSkin.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenSkin,this);
	}
	if(this.pifuBT.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.pifuBT.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenSkin,this);
	}
	if(this.SkinBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.SkinBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.CloseSkin,this);
	}
	if(this.ChangedBox.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.ChangedBox.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.ChangeNewBox,this);
	}
	if(this.prizeBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.prizeBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.ClosePrize,this);
	}
	if(this.goldhintBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.goldhintBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.CloseGoldHint,this);
	}
	if(this.choujiangBT.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.choujiangBT.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenAward,this);
	}
	if(this.AwardBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.AwardBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.CloseAward,this);
	}
	if(this.achieveBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.achieveBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.CloseAchieve,this);
	}
	if(this.AchieveBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.AchieveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenAchieve,this);
	}
	if(this.RuleBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.RuleBack.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.CloseRule,this);
	}
	if(this.RuleBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.RuleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP
		,this.OpenRule,this);
	}
	if(this.RecordBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.RecordBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		function(){this.RecordGroup.visible = false;},this);
	}
	if(this.RecordBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.RecordBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.Record,this);
	}
	if(this.AIBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.AIBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.ai,this);
	}
	if(this.MatchingBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.MatchingBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.matching,this);
	}
	if(this.MatchingBack.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.MatchingBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.BackBegin,this);
	}
	if(SceneManager.instance().webSocket.hasEventListener(egret.ProgressEvent.SOCKET_DATA)){
		SceneManager.instance().webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA,
		this.onReceiveMessage,this);
	}
}
//开启分享
private initiativeShare(){
	platform.initiativeShare();
}
//开启替身皮肤面板
private OpenSubSkin(){
	this.CurrentSkin = "subskin";
	SceneManager.instance().Sendsocket("Skin","get","subskin");
}
//开启皮肤面板
private OpenSkin(){
	this.CurrentSkin = "skin";
	SceneManager.instance().Sendsocket("Skin","get","skin");
}
//关闭皮肤界面
private CloseSkin(){
	this.SkinGroup.visible = false;
	this.CurrentSkin = "sub";
	this.SkinG.splice(0,this.SkinG.length);
	this.SkinLength = 0;
}
//开启奖励提示
public OpenPrize(str:string){
	this.prizeTable.text = str;
	this.prize.visible = true;
}
//关闭奖励提示
private ClosePrize(){
	this.prize.visible = false;
}
//打开金币提示
public OpenGoldHint(){
	this.goldhint.visible = true;
}
//关闭金币提示
private CloseGoldHint(){
	this.goldhint.visible = false;
}
//关闭抽奖面板
private CloseAward(){
	this.AwardGroup.visible = false;
}
//打开抽奖面板
private OpenAward(){
	SceneManager.instance().Sendsocket("Award","get","");
}
//关闭成就
private CloseAchieve(){
	this.AchieveG.splice(0,this.AchieveG.length);
	this.AllAchieveLength = 0;
	this.achieveGroup.visible = false;
}
//开启成就
private OpenAchieve(){
	SceneManager.instance().Sendsocket("Achieve","get","");	
}
//关闭排行榜
private CloseRank(){
	this.let.splice(0,this.let.length);
	this.CurrentRankNumber = 0;
	this.AllRankLength = 0;
	this.RankingGroup.visible = false;
}
//展示排行榜
private OpenRank(){
	SceneManager.instance().Sendsocket("SelfRank","0","");
}
//关闭规则面板
private CloseRule(){
	this.Rule.visible = false;
}
//打开规则面板
private OpenRule(){
	this.Rule.visible = true;
}
//关闭战绩
private CloseRecord(){
	this.RecordGroup.visible = false;
}
//展示战绩
private Record(){
	SceneManager.instance().Sendsocket("Selfshuju","cha","");
}
//开始ai对战
private ai(){
	//切换人机对战场景
	SceneManager.instance().isAI = true;
	this.ismatching = false;	
	SceneManager.instance().changeScene('gameScene');
}
//中止匹配返回主界面
private BackBegin(){
	this.Matching.visible = false;
	this.ismatching = false;
	SceneManager.instance().Sendsocket("Quit","0","");	
}
//开始匹配
public matching(){
	//切换匹配对战场景
	SceneManager.instance().isAI = false;
	this.Matching.visible = true;
	this.ismatching = true;	
	SceneManager.instance().Sendsocket("Login","0","");	
}
//使自己的战绩显示到UI中
private ShowSelfShuju(winnumber:number,timesNubmer:number,integral:number){
	//胜率
	var shenglvNumber:number = winnumber/timesNubmer;
	shenglvNumber = Math.floor(shenglvNumber * 100);
	//将战斗场次文字显示
	this.FireNumber.text = timesNubmer.toString();
	if(winnumber == 0)//如果胜场为0，则显示胜率为0%
	{
		this.shenglv.text = "0%";
	}
	else//否则显示计算出的胜率
	{
		var shenglvwenzi:string = shenglvNumber.toString();
		this.shenglv.text = shenglvwenzi +"%";
	}
	//将积分文字显示
    this.jifen.text = integral.toString();
}
//在排行中显示自己的数据
private ShowSelfRank(rank:number,id:string,integral:number){
	this.MyRankTable.text = rank.toString();
	this.MyIDLabel.text = id;
	this.MyIntegralLable.text = integral.toString();
}
//设置排行榜的列表
private SetRankList(){
	//this.AllRankScroller = new eui.Scroller();
	if(this.AllRankList.dataProvider){
		this.AllRankAchieveArrayColl.source = this.let;
		this.AllRankAchieveArrayColl.refresh();
		this.AllRankList.dataProviderRefreshed();
	}else{
		this.AllRankList = new eui.List();
		this.AllRankAchieveArrayColl = new eui.ArrayCollection(this.let);
		this.AllRankList.dataProvider = this.AllRankAchieveArrayColl;
		this.AllRankList.itemRenderer = ListItem;
		this.AllRankScroller.viewport = this.AllRankList;
		this.AllRankScroller.scrollPolicyH = eui.ScrollPolicy.OFF;
		this.AllRankScroller.scrollPolicyV = eui.ScrollPolicy.ON;
	}		
	//this.AllRankList.updateRenderer = this.gameCell.bind(this.let);
	//this.AllRankList.itemRendererSkinName = ListItem;
}
//设置成就列表
private SetAchieveList(){
	let Aarray = this.AchieveG;
	if(this.AchieveList.dataProvider){
		//this.AchieveArrayColl.source = Aarray;
		//this.AchieveArrayColl.refresh();
		//this.AchieveArrayColl.source = null;
		this.AchieveArrayColl.removeAll();
		for(let i = 0;i < Aarray.length;i++){
			this.AchieveArrayColl.addItem(Aarray[i]);
		}
		console.log(this.AchieveArrayColl);
	}else{
		console.log("创建成就列表");
		this.AchieveList = new eui.List();
		this.AchieveArrayColl = new eui.ArrayCollection();
		this.AchieveList.dataProvider = this.AchieveArrayColl;
		this.AchieveArrayColl.replaceAll(Aarray);
		this.AchieveList.itemRenderer = AchieveItemRender;
		this.AchieveScroller.viewport = this.AchieveList;
		this.AchieveScroller.scrollPolicyH = eui.ScrollPolicy.OFF;		
		this.AchieveScroller.scrollPolicyV = eui.ScrollPolicy.ON;
	}
}
//设置抽奖列表
private SetAwardList(awardData){
	this.CurrentGold = awardData.gold;
	this.goldTable.text = this.CurrentGold.toString();
	if(this.AwardList.dataProvider){
		this.AwardCollection.removeAll();
		for(let j = 0;j < 15;j++){
			this.AwardCollection.addItem(awardData);
		}
	}else{
		this.AwardList = new eui.List();
		this.AwardCollection = new eui.ArrayCollection();
	    for(let i = 0;i < 15;i++){
			this.AwardCollection.addItem(awardData);
		}
		this.AwardList.dataProvider = this.AwardCollection;
		this.AwardList.itemRenderer = AwardBt;
		var layout = new eui.TileLayout();
		layout.horizontalGap = 35;
		layout.verticalGap = 5;
		layout.requestedColumnCount = 3;
		layout.requestedRowCount = 5;
		this.AwardList.layout = layout;
		this.AwardScroller.viewport = this.AwardList;
		this.AwardScroller.scrollPolicyH = eui.ScrollPolicy.OFF;
		this.AwardScroller.scrollPolicyV = eui.ScrollPolicy.OFF;
	}
}
//换一盒
private ChangeNewBox(){
	SceneManager.instance().Sendsocket("Award","restart","");
}
//设置皮肤列表
private SetSkinList(){
	if(this.skinlist.dataProvider)//如果皮肤数据存在
	{
		this.SkinCollection.removeAll();
		for(let i = 0;i < this.SkinG.length;i++){
			this.SkinCollection.addItem(this.SkinG[i]);
		}
	}
	else//不存在
	{
		this.skinlist = new eui.List();
		this.SkinCollection = new eui.ArrayCollection();
		for(let i = 0;i < this.SkinG.length;i++){
			this.SkinCollection.addItem(this.SkinG[i]);
		}
		this.skinlist.dataProvider = this.SkinCollection;
		this.skinlist.itemRenderer = SkinListItem;
		var layout = new eui.TileLayout();
		layout.horizontalGap = 60;
		layout.verticalGap = 20;
		layout.paddingTop = 40;
		layout.paddingLeft = 40;
		layout.requestedRowCount = 2;
		layout.requestedColumnCount = Math.round(this.SkinG.length/2);
		this.skinlist.layout = layout;
		this.skinScoller.viewport = this.skinlist;
		this.skinScoller.scrollPolicyV = eui.ScrollPolicy.OFF;
		this.skinScoller.scrollPolicyH = eui.ScrollPolicy.ON;
	}
}
//监听服务器回复
private onReceiveMessage(){
	//拿到服务端发送的数据
	var msg = SceneManager.instance().webSocket.readUTF();
	try{
	//将数据转换成json格式
	var obj = JSON.parse(msg);
	//如果确实转换为json格式且不为空
	if(typeof obj == "object"&&obj){
		switch(obj.message){
			case "通讯中":
			//返回的信息为“通讯中”且开始匹配则向服务端发送加入房间请求	
			if(this.ismatching){
				SceneManager.instance().Sendsocket("Joinin","0","");
			}
			break;
			case "进入房间":
			//如果已经进入房间则向服务端发送开始游戏请求
			this.Matching.visible = true;	
			SceneManager.instance().Sendsocket("Gaming","1","");
			break;
			case "对方已准备":
			//如果对方已经准备开始战斗则跳转到战斗界面
			this.ismatching = false;	
			this.RemoveEvent();
			SceneManager.instance().changeScene('gameScene');	
			break;
			case "退出房间":
			//如果已经退出房间则向服务端发送验证通信请求
			SceneManager.instance().Sendsocket("Login","0","");
			break;
			case "个人数据":
			//接收到个人数据并把数据显示到UI上
			console.log(obj.data);
			//获取到信息中的数据
			var str = obj.data;
			//获取到数据中的胜场
			var winnumber:number = str.win;
			//战斗场次
			var timesNubmer:number = str.times;
			//获取积分
			var integral = str.integral;
			//最高排行
			var zuigao = str.zuigao;
			this.highest.text = zuigao.toString();
			//将数据展示到UI中
			this.ShowSelfShuju(winnumber,timesNubmer,integral);
			//将数据面板打开
			this.RecordGroup.visible = true;
			break;
			case "个人排行":
			//接收个人排行数据并处理
			let selfdata = obj.data;
			let Myrank:number = selfdata.paihang;
			let MyId:string = selfdata.name;
			let Myintegral:number = selfdata.integral;
			
			this.ShowSelfRank(Myrank,MyId,Myintegral);
			SceneManager.instance().Sendsocket("AllRank","0","");
			break;
			case "总排行":
			//记录当前人的排行
			this.CurrentRankNumber++;
			//接收前二十的数据并处理，最后打开排行榜面板
			let Alldata = obj.data;
			if(this.AllRankLength == 0){
				let length:number = obj.status;
				if(length>20){
					this.AllRankLength = 20;
				}else{
					this.AllRankLength = length;
				}
			}
			let RankData = {
				Rank:this.CurrentRankNumber,
				ID:Alldata.name,
				integral:Alldata.integral
			}
			//将数据记录
			this.let.push(RankData);
			console.log(this.AllRankLength);
			//打开排行榜面板
			if(this.CurrentRankNumber == this.AllRankLength){
				this.SetRankList();
				this.RankingGroup.visible = true;
			}
			break;
			case "成就内容":
			let AchieveData = obj.data;
			if(this.AllAchieveLength == 0)
			{
				this.AllAchieveLength = obj.status;
			}
			this.AchieveG.push(obj.data);
			if(this.AchieveG.length == this.AllAchieveLength){
				this.SetAchieveList();
				this.achieveGroup.visible = true;
			}
			break;
			case "成就修改":
			this.CloseAchieve();
			SceneManager.instance().Sendsocket("Achieve","get","");
			break;
			case "抽奖内容":
			this.SetAwardList(obj.data);
			this.AwardGroup.visible = true;
			break;
			case "皮肤内容":
			if(this.SkinLength == 0){
				this.SkinLength = obj.status;
			}
			this.SkinG.push(obj.data);
			if(this.SkinG.length == this.SkinLength){
				this.SkinLength = 0;
				this.SetSkinList();
				this.SkinG.splice(0,this.SkinG.length);
				this.SkinGroup.visible = true;
			}
			break;
		}
	}
	}catch(e){
		console.log(e);
	}
}	

}