class GamePlay extends eui.Component implements  eui.UIComponent {
	//游戏UI
	public PlayPanel:eui.Group;//游戏界面
    public yunBT:eui.Button;//运招式按钮
    public OneLevelPunch:eui.Button;//一级拳
    public TwolevelPunch:eui.Button;//二级拳
	public ThreeLevelPunch:eui.Button;//三级拳
    public OneLevelDefense:eui.Button;//一级防
    public TwoLevelDefense:eui.Button;//二级防
    public ThreeLevelDefense:eui.Button;//三级防
    public OverPanel:eui.Group;//结束游戏界面
    public MyHead:eui.Image;//己方头像
    public EnemyHead:eui.Image;//敌方头像
    public MyToggleGroup:eui.Group;//己方显示所拥有的运的组
	public EnemyToggleGroup:eui.Group;//敌方显示所拥有的运的组
	public TimeLabel:eui.Label;//显示倒计时的文本
	public TimeImage:eui.Image;//时间条显示
	public EnemyTime:eui.Image;//敌方的时间移动
	public MyTime:eui.Image;//己方的时间移动
	public Bout:eui.Label;//显示当前回合数
	public MyYunShow:eui.Group;//我的运的个数的文字显示
	public EnemyYunShow:eui.Group;//敌方运的个数的文字显示
	public MyYunLabel:eui.Label;//我的运的文字
	public EnemyYunLabel:eui.Label;//敌方运的文字
	public MyTouchShow:eui.Label;//在屏幕中显示己方的出招
	public EnemyTouchShow:eui.Label;//在屏幕中显示敌方的出招
	public MyScore:eui.Group;//显示己方的成绩
	public EnemyScore:eui.Group;//显示敌方成绩
	public ScoreTime:eui.Label;//显示己方的胜负
	public FinalScoreShow:eui.Label;//最终成绩的显示
	public Restart:eui.Button;//再来一局
	public Back:eui.Button;//返回按钮


	//自定义对象
	private Myun:Array<eui.Image> = [];//己方运的数组
	private Eyun:Array<eui.Image> = [];//敌方运的数组
	private AItouch:Array<string> = [];//本轮ai可以进行的出招
	private MyScoreShow:Array<eui.Label> = [];//己方成绩的组
	private EnemyScoreShow:Array<eui.Label> = [];//敌方成绩的数组
	private MyYun:number = 0;//己方拥有运的个数
	private EnemyYun:number = 0;//敌方拥有运的个数
	private TimeNumber:number = 3;//游戏开始倒计时的时间
	private GameTimeNumber:number = 3;//游戏中倒计时的时间
	private CurrentBout:number = 0;//当前回合数
	private MoveX:number = 560;//时间要移动到的位置
	private isDown:boolean = false;//是否到了可以检测的位置
	private KongImage:string = "kong_png";//显示运为空是的图片
	private ManImage:string = "man_png";//显示运为有时的图片
	private MyTouch:string = "";//我的出招
	private EnemyTouch:string =  "";//敌人的出招
	private Result:string = "";//一个回合的最终结果
	private CurrentLose:number = 0;//输的局数
	private CurrentWin:number = 0;//赢的局数
	private CurrentGame:number = 0;//当前时第几局
	private CurrentPing:number = 0;//当前平的局数
	private isAI:boolean = false;//是否时人机对战
	private defense:number = 0;

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
		this.Restart.addEventListener(egret.TouchEvent.TOUCH_TAP,
		this.RestartBT,this);
		this.Back.addEventListener(egret.TouchEvent.TOUCH_TAP,
		this.BackHome,this);
		//执行初始化
		this.init();
	}
//重新匹配
private RestartBT(){
	if(this.isAI){
		this.init();
	}else{
		SceneManager.instance().isRestart = true;
		this.SentSocket("0","Quit","0",0);
	}
}
//返回按钮	
private BackHome(){
	if(this.isAI){
		this.RemoveBTFunction();
		SceneManager.instance().changeScene("beginScene");
	}else{
		SceneManager.instance().isRestart = false;
		this.SentSocket("0","Quit","0",0);
	}
}
//网络监听
private onReceiveMessage(){
	var msg = SceneManager.instance().webSocket.readUTF();
	try{
		var obj = JSON.parse(msg);		
		if(typeof obj == "object"&&obj){
			console.log(obj.message);
			if(obj.message == "个人数据"){
				if(this.CurrentPing == 2){
					this.setScoreText("平了！");
				}else if(this.CurrentLose == 2){
					this.setScoreText("你输了！");
				}else{
					this.setScoreText("你赢了！");
				}
			}else if(obj.message == "退出房间"){
				this.RemoveAll();
				SceneManager.instance().changeScene('beginScene');
			}else if(obj.message == "对方退出"){
				if(this.CurrentGame <= 3){	
					this.SentSocket("0","Selfshuju","ying",this.defense);					
				}
			}else{
				this.EnemyTouch = obj.data;	
				if(this.MyTouch!="")
				{
					this.SetAllYun();
				}
			}			
		}
	}catch(e){
		console.log(e);		
	}
}
//发送网络信息
private SentSocket(touch:string,type:string,start:string,defense:number){
	var id = SceneManager.instance().mynickName;
	var cmd = '{"id":"'+id+'","type":"'+type+'","play":"' + touch + '","start":"'+start+'","def":"'+defense+'"}';
	SceneManager.instance().webSocket.writeUTF(cmd);
}
//初始化
private init(){
	//是否时ai操作
	this.isAI = SceneManager.instance().isAI;
	if(!this.isAI){
		SceneManager.instance().webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA,
		this.onReceiveMessage,this);
	}
	//关闭结束界面
	this.OverPanel.visible = false;
	//初始化当前的局数
	this.CurrentGame = 0;
	//初始化赢的局数
	this.CurrentWin = 0;
	//初始化输的局数
	this.CurrentLose = 0;
	//添加运的方法
	this.AddBTfunction();	
	this.initGroup();
	//对一些公用项目初始化
	this.Allinit();
	//初始化成功防御的次数
	this.defense = 0;
}
//通用项目初始化
private Allinit(){
	//显示倒计时遮罩面板
	this.TimeLabel.text = "3";
	this.TimeLabel.visible = true;
	//关闭所有按钮的功能
	this.CloseBt();
	//初始化回合状态
	this.CurrentBout = 0;
	this.Bout.text = "第"+this.CurrentBout.toString()+"回合";
	//初始化运的状态
	for(var i:number=0;i<this.Myun.length;i++){
		this.Myun[i].source = this.KongImage;
	}
	for(var n:number=0;n<this.Eyun.length;n++){
		this.Eyun[n].source = this.KongImage;
	}
	//敌我的运数
	this.MyYun = 0;
	this.EnemyYun = 0;
	//初始化倒计时
	this.TimeNumber = 3;
	this.GameTimeNumber = 3;
	//通用代码
	this.playInit();
	//设置时间检测
	let timer:egret.Timer = new egret.Timer(1000,3);
	//设置时间中要检测的方法
	timer.addEventListener(egret.TimerEvent.TIMER,
	this.timerFunc,this);
	//设置时间检测结束的方法
	timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,
	this.timerComplete,this);
	//开始时间检测
	timer.start();
}
//剥离出重复代码
private playInit(){
	//重置结果
	this.Result = "";
	//关闭胜负显示
	this.ScoreTime.visible = false;
	//初始化出招
	this.MyTouch = "";
	this.EnemyTouch = "";
	//初始化出招显示
	this.MyTouchShow.visible = false;
	this.EnemyTouchShow.visible = false;
	//将时间格的位置还原
	this.MyTime.x = 890;
	this.EnemyTime.x = 230;
}
//游戏运行
private GamePlaying(){
	//增加回合
	this.CurrentBout++;
	this.Bout.text =  "第"+this.CurrentBout.toString()+"回合";
	if(this.CurrentBout>100){
		//添加局数
		this.CurrentPing++;
		this.EndSetText("平");
		this.SetResult();
		return;
	}
	//通用代码
	this.playInit();
	//设置战斗倒计时
	this.GameTimeNumber = 3;
	// let timer:egret.Timer = new egret.Timer(500,5);
	// timer.addEventListener(egret.TimerEvent.TIMER,
	// this.GameTime,this);
	//战斗倒计时开始
	//timer.start();
	this.OpenBt();
	//初始化对局结果
	this.Result = "";
	//添加tween动画
	egret.Tween.get(this.MyTime).to({
		x:this.MoveX
	},3000
	).call(()=>{
		if(this.MyTouch == ""){
			this.AddYUN();
		}
	});
	egret.Tween.get(this.EnemyTime).to({
		x:this.MoveX
	},3000
	);
}
//添加攻防按钮的方法
private AddBTfunction(){
	this.yunBT.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.AddYUN,this);
	this.OneLevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP,	
	this.SetPunchone,this);
	this.TwolevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP,	
	this.SetPunchtwo,this);	
	this.ThreeLevelPunch.addEventListener(egret.TouchEvent.TOUCH_TAP,
	this.SetPunchthree,this);
	this.OneLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP,	
	this.SetDefenseone,this);
	this.TwoLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP,	
	this.SetDefensetwo,this);
	this.ThreeLevelDefense.addEventListener(egret.TouchEvent.TOUCH_TAP,	
	this.SetDefensethree,this);	
}
//移除剩余的按钮事件
private RemoveAll(){
	if(this.Restart.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.Restart.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.RestartBT,this);
	}
	if(this.Back.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.Back.removeEventListener(egret.TouchEvent.TOUCH_TAP,
		this.BackHome,this);
	}
	if(SceneManager.instance().webSocket.hasEventListener(egret.ProgressEvent.SOCKET_DATA)){
		SceneManager.instance().webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA,
				this.onReceiveMessage,this);
	}
}
//移除所有的按钮事件
private RemoveBTFunction(){
	if(this.yunBT.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.yunBT.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.AddYUN,this);
	}
	if(this.OneLevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.OneLevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetPunchone,this);
	}
	if(this.TwolevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.TwolevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetPunchtwo,this);
	}		
	if(this.ThreeLevelPunch.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.ThreeLevelPunch.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetPunchthree,this);
	}
	if(this.OneLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.OneLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetDefenseone,this);
	}
	if(this.TwoLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.TwoLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetDefensetwo,this);
	}
	if(this.ThreeLevelDefense.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
		this.ThreeLevelDefense.removeEventListener(egret.TouchEvent.TOUCH_TAP,	
		this.SetDefensethree,this);
	}
}
//设置三防的方法
private SetDefensethree(){
	//记录玩家的招式
	this.MyTouch = "defense3";
	//设置运的UI改变
	this.SetMyYun();
}
//设置二防的方法
private SetDefensetwo(){
	//记录玩家的招式
	this.MyTouch = "defense2";
	//设置运的UI改变
	this.SetMyYun();
}
//设置一防的方法
private SetDefenseone(){
	//记录玩家的招式
	this.MyTouch = "defense1";
	//设置运的UI改变
	this.SetMyYun();
}
//设置三拳的方法
private SetPunchthree(){
	//记录玩家的招式
	this.MyTouch = "Punch3";
	//设置运的UI改变
	this.SetMyYun();
}
//设置二拳的方法
private SetPunchtwo(){
	//记录玩家的招式
	this.MyTouch = "Punch2";
	//设置运的UI改变
	this.SetMyYun();
}
//设置一拳的方法
private SetPunchone(){
	//记录玩家的招式
	this.MyTouch = "Punch1";
	//设置运的UI改变
	this.SetMyYun();
}
//执行运的方法
private AddYUN(){
	//记录玩家的招式	
	this.MyTouch = "Yun";	
	//设置运的UI改变	
	this.SetMyYun();
}
//打开一部分按钮
private OpenBt(){
	//开启全部不需要运的按钮
	this.yunBT.enabled = true;
	this.OneLevelDefense.enabled = true;
	this.TwoLevelDefense.enabled = true;
	this.ThreeLevelDefense.enabled = true;
	//判断运数开启相应的拳的按钮
	if(this.MyYun>=3){
		this.OneLevelPunch.enabled = true;
	    this.TwolevelPunch.enabled = true;
	    this.ThreeLevelPunch.enabled = true;
	}else if(this.MyYun == 2){
        this.OneLevelPunch.enabled = true;
	    this.TwolevelPunch.enabled = true;
	}else if(this.MyYun == 1){
		this.OneLevelPunch.enabled = true;
	}
}
//关闭所有按钮
private CloseBt(){
	//开始时将所有的按钮关闭
	this.yunBT.enabled = false;
	this.OneLevelPunch.enabled = false;
	this.TwolevelPunch.enabled = false;
	this.ThreeLevelPunch.enabled = false;
	this.OneLevelDefense.enabled = false;
	this.TwoLevelDefense.enabled = false;
	this.ThreeLevelDefense.enabled = false;
}
//战斗时间事件
// private GameTime(){
// 	//每次检测减少时间
// 	this.GameTimeNumber -= 0.5;
// 	//当时间小于等于0.2时
// 	if(this.GameTimeNumber == 0.5){
		
// 	}
// }
//倒计时完成
private timerComplete(){
	//将遮罩关闭
	this.TimeLabel.visible = false;
	//游戏开始
	this.GamePlaying();
}
//倒计时显示方法
private timerFunc(){
	//减少倒计时
	this.TimeNumber--;
	//将倒计时显示出来
	this.TimeLabel.text = this.TimeNumber.toString();
}
//初始化数组
private initGroup(){
	this.initimageGroup(this.Myun,this.MyToggleGroup);
	this.initimageGroup(this.Eyun,this.EnemyToggleGroup);
	this.initlabelGroup(this.MyScoreShow,this.MyScore);
	this.initlabelGroup(this.EnemyScoreShow,this.EnemyScore);
}
//初始化image组
private initimageGroup(imagegroup:eui.Image[],togglegroup:eui.Group){
	//清空数组
	imagegroup.splice(0,imagegroup.length);
	//将Group里的图片添加到己方的数组中
	for(var i:number=0;i<togglegroup.numChildren;i++){
		let nimage:eui.Image = new eui.Image();
		nimage = <eui.Image>togglegroup.getChildAt(i);
		imagegroup.push(nimage);
	}
}
//初始化label组
private initlabelGroup(labelgroup:eui.Label[],togglegroup:eui.Group){
	//清空数组
	labelgroup.splice(0,labelgroup.length);
	//将Group里的文字添加到敌方的数组中
	for(var t:number=0;t<togglegroup.numChildren;t++){
		let nlabel:eui.Label = new eui.Label();
		nlabel = <eui.Label>togglegroup.getChildAt(t);
		nlabel.visible = false;
		labelgroup.push(nlabel);
	}
}
//设置己方yun的ui显示
private SetMyYun(){
	//关闭所有可点击事件
	this.CloseBt();
	//执行人机操作
	if(this.isAI){
		this.AIout();
	}else{
		//不是人机的话发送招式到服务器
		this.SentSocket(this.MyTouch,"Gaming","0",0);
	}
	//执行回合判断操作
	if(this.EnemyTouch != ""){
		this.SetAllYun();
	}	
}
//设置所有的运
private SetAllYun(){
	//设置人物的运
	this.SetYUN(this.MyTime,this.MyTouch,this.MyTouchShow,
	this.MyYun,this.MyToggleGroup,this.Myun,
	this.MyYunShow,this.MyYunLabel,"Myyun");
	//设置敌人的运
	this.SetYUN(this.EnemyTime,this.EnemyTouch,this.EnemyTouchShow,
	this.EnemyYun,this.EnemyToggleGroup,this.Eyun,this.EnemyYunShow,this.EnemyYunLabel,"Enemyyun");
	//判断胜负	
	this.GameJudge();
}
//根据招式进行操作
private TouchAndYun(str:string,number:number,name:string):number{
	switch(str){			
		case "Yun":		
		//先加一个运		
		number++;		
		break;		
		case "Punch1":		
		//先减一个运		
		number -= 1;		
		break;		
		case "Punch2":		
		//先减两个运		
		number -= 2;		
		break;
		case "Punch3":
		//先减三个运
		number -= 3;
		break;
	}
	if(name == "Myyun"){
		this.MyYun = number;
	}else{
		this.EnemyYun = number;
	}
	return number;
}
//设置出招显示
private setTouchlabel(str:string,label:eui.Label){
	let touchlabel:string;
	switch(str){
		case "Yun":
		touchlabel = "运";
		break;
		case "Punch1":
		touchlabel = "拳1";
		break;
		case "Punch2":
		touchlabel = "拳2";
		break;
		case "Punch3":
		touchlabel = "拳3";
		break;
		case "defense1":
		touchlabel = "防1";
		break;
		case "defense2":
		touchlabel = "防2";
		break;
		case "defense3":
		touchlabel = "防3";
		break;
	}
	label.text = touchlabel;
	label.visible = true;
}
//设置yun
private SetYUN(tImage:eui.Image,touch:string,touchshow:eui.Label,Yun:number,togglegroup:eui.Group,
yImage:eui.Image[],yShowGroup:eui.Group,Ylabel:eui.Label,name:string){
	//停止时间格的移动
	egret.Tween.removeTweens(tImage); 
	//设置招式显示   
	this.setTouchlabel(touch,touchshow);
	//根据招式操作运
	Yun = this.TouchAndYun(touch,Yun,name);
	//当运数小于6个时用图片表示    
	if(Yun < 6){			
		//如果组关闭了，则开启		
		if(togglegroup.visible == false){		
			yShowGroup.visible = false;
			togglegroup.visible = true;
		}	
		let number:number = Yun;	
		for(let i:number=0;i<yImage.length;i++){					
			if(number>0){		
				yImage[i].source = this.ManImage;	
				number--;
			}else{		
				yImage[i].source = this.KongImage;
			}
		}
	}
	else//当大于或等于6个时用文字表示
	{		
		if(yShowGroup.visible == false){		
			yShowGroup.visible = true;
			togglegroup.visible = false;
		}
		//给敌方的yun文字显示赋值
		Ylabel.text = Yun.toString();
	}
}
//人机输出
private AIout(){
	//先把招式数组清空
		this.AItouch.splice(0,this.AItouch.length);
		//判断己方有多少运，从而判断人机可以执行哪些操作
		this.AItouch.push("Yun");
		if(this.EnemyYun == 1){
			this.AItouch.push("Punch1");
		}
		if(this.EnemyYun == 2){
			this.AItouch.push("Punch2");
		}
		if(this.EnemyYun >= 3){
			this.AItouch.push("Punch3");
		}
		if(this.MyYun >= 3){
			this.AItouch.push("defense1");
			this.AItouch.push("defense2");
			this.AItouch.push("defense3");
		}else if(this.MyYun == 2){
			this.AItouch.push("defense1");
			this.AItouch.push("defense2");
		}else if(this.MyYun == 1){
			this.AItouch.push("defense1");
		}
		//随机获得数组内的一个招式
		let number:number = Math.floor(Math.random()*this.AItouch.length);
		//记录出招
		this.EnemyTouch = this.AItouch[number];
		
}		
//进行判定双方的招式
private GameJudge(){
	if(this.MyTouch == "Yun"){
		if(this.EnemyTouch == "Punch1"
		||this.EnemyTouch == "Punch2"
		||this.EnemyTouch == "Punch3"){				
			//输了
			this.Result = "Shule";
		}else{
			//平了
			this.Result = "Pingle";
		}
	}else if(this.MyTouch == "defense1"){
		if(this.EnemyTouch == "Punch2"
		||this.EnemyTouch == "Punch3"){
			//输了
			this.Result = "Shule";
		}else {
			//平了
			this.Result = "Pingle";
			//增加防御成功的次数
			this.defense++;
		}
	}else if(this.MyTouch == "defense2"){
		if(this.EnemyTouch == "Punch1"
		||this.EnemyTouch == "Punch3"){
		//输了
			this.Result = "Shule";
		}else {
			//平了
			this.Result = "Pingle";
			//增加防御成功的次数
			this.defense++;
		}
	}else if(this.MyTouch == "defense3"){
		if(this.EnemyTouch == "Punch2"
		||this.EnemyTouch == "Punch1"){
			//输了
			this.Result = "Shule";
		}else {
			//平了
			this.Result = "Pingle";
			//增加防御成功的次数
			this.defense++;
		}
	}else if(this.MyTouch == "Punch1"){
		if(this.EnemyTouch == "Punch2"
		||this.EnemyTouch == "Punch3"){
			//输了
			this.Result = "Shule";
		}
		else if(this.EnemyTouch ==  "defense1"||
		this.EnemyTouch ==  "Punch1"){
			//平了
			this.Result = "Pingle";
		}
		else 
		{
			 //赢了	
			this.Result = "Yingle";
		}
	}else if(this.MyTouch == "Punch2"){
		if(this.EnemyTouch == "Punch3"){
			//输了
			this.Result = "Shule";
		}
		else if(this.EnemyTouch ==  "defense2"||
		this.EnemyTouch == "Punch2"){
			//平了
			this.Result = "Pingle";
		}
		else 
		{
			 //赢了	
			this.Result = "Yingle";
		}
	}else if(this.MyTouch == "Punch3"){
		if(this.EnemyTouch ==  "defense3"
		||this.EnemyTouch == "Punch3"){
			//平了
			this.Result = "Pingle";
		}
		else 
		{
		    //赢了	
			this.Result = "Yingle";
		}
	}
	this.SetResult();
}
//根据对局结果进行操作
private SetResult(){
	//播放动画	
	//出现胜负结果	
	switch(this.Result){
		case "Pingle":
		break;
		case "Shule":
		//添加败局
		this.CurrentLose++;
		this.EndSetText("输");
		break;
		case "Yingle":
		//添加胜局
		this.CurrentWin++;
		this.EndSetText("赢");
		break;
	}
	//如果已经大于三局
	if(this.CurrentWin == 2){
		if(this.isAI){
			this.setScoreText("你赢了！");
		}else{
			this.SentSocket("0","Selfshuju","ying",this.defense);
		}
	}else if(this.CurrentLose == 2){
		if(this.isAI){
			this.setScoreText("你输了！");
		}else{
			this.SentSocket("0","Selfshuju","shu",this.defense);
		}
	}else if(this.CurrentPing == 2){
		if(this.isAI){
			this.setScoreText("平了！");
		}else{
			this.SentSocket("0","Selfshuju","ping",this.defense);
		}
	}else{
		//执行回合操作	
		let timer:egret.Timer = new egret.Timer(2000,1);	
		timer.addEventListener(egret.TimerEvent.TIMER,	
		this.delayResult,this); 	
		timer.start();
	}
}
//延迟重置回合操作
private delayResult(){
	if(this.Result == "Pingle"){
		this.GamePlaying();
	}else if(this.Result == "Shule"||this.Result == "Yingle"){ 
	this.Allinit();
    }
}
//设置成绩栏的显示
private setScoreText(str:string){
	//定义最终成绩的文字
	this.FinalScoreShow.text = str;	
	//显示结束面板	
	this.OverPanel.visible = true;	
	//移除所有按钮事件	
	this.RemoveBTFunction();
}
//对胜负显示的操作
private EndSetText(text:string){
	//显示全局的胜负
	this.ScoreTime.text = text;
	this.ScoreTime.visible = true;
	//显示小的胜负关系
	//设置己方胜负
	this.MyScoreShow[this.CurrentGame].text = text;
	this.MyScoreShow[this.CurrentGame].visible = true;
	//设置敌方胜负
	let Etext:string;
	if(text == "赢"){
		Etext = "输";
	}else if(text == "平"){
		Etext = "平";
	}else {
		Etext = "赢";
	}
	this.EnemyScoreShow[this.CurrentGame].text = Etext;
	this.EnemyScoreShow[this.CurrentGame].visible = true;
	//记录当前第几局
	this.CurrentGame++;
}
	
}