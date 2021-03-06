class SceneManager extends egret.Sprite {

	//设计成单类
	private static _instance:SceneManager;
	public static instance():SceneManager{
		if(!SceneManager._instance){
			SceneManager._instance=new SceneManager();
		}
		return SceneManager._instance;
	}
	//网络连接
	public webSocket:egret.WebSocket;
	//连接的网络IP
	private hostname:string = "192.168.0.21";
	//连接的网络端口
	private port:number = 8080;
	//储存信息
	public json:any;
	//开始场景
	public beginScene:BeginPage;
	//游戏场景
	public gameScene:GamePlay;
	//是否时人机对战
	public isAI:boolean = false;
	//本机id
	public mynickName:string = "";
	public myCode:string = "";
	public myOpenId:string = "";
	public avatarUrl:any = "";
	public isRestart:boolean = false;
	public constructor() {
		super();
		this.init();
	}
	
	//初始化
	private init(){
		//实例化场景界面
		this.beginScene=new BeginPage();
		this.gameScene=new GamePlay();
		//初始化网络连接
		this.webSocket = new egret.WebSocket;
		//设置传输的值的格式为二进制
		this.webSocket.type = egret.WebSocket.TYPE_STRING;
		//添加连接完成监听
		this.webSocket.addEventListener(egret.Event.CONNECT,
		this.onSocketOpen,this);
		//添加连接断开时的监听
		this.webSocket.addEventListener(egret.Event.CLOSE,
		this.onSocketClose,this);
		//添加异常监听
		this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR,
		this.onSocketError,this);
		//数据接收的监听
		this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA,this.onReceiveMessage,this);
		//连接服务器
		this.webSocket.connect(this.hostname,this.port);
	}
	//数据接收
	private onReceiveMessage(){
		//拿到服务端发送的数据
		var msg = this.webSocket.readUTF();
		try{
	        //将数据转换成json格式
	        var obj = JSON.parse(msg);
			this.myOpenId = obj.data.Openid;
			console.log(this.myOpenId);
			this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA,this.onReceiveMessage,this);
			//默认添加开始场景
			this.addChild(this.beginScene);
		}
		catch(e){
			console.log(e);
		}
	}
	//连接完成时的方法
	private onSocketOpen(){
		this.Sendsocket("Login");
		console.log("连接成功");
	}
	//异常接收
	private onSocketError(){
	}
	//断开监听
	private onSocketClose(){
		console.log('服务器断开了');
		console.log("尝试连接");
		this.webSocket.connect(this.hostname,this.port);
	}
	//发送信息到服务端
	public Sendsocket(type:string = "",start:string = "",skin:string = "",Button:number = -1,award:string = "",achieve:string = "",skinType:string = ""){
		var cmd = '{"id":"' + this.myOpenId + '","code":"' + this.myCode + '","name":"' + this.mynickName + '","head":"' + this.avatarUrl +'","type":"'+type+'",'+
		'"start":"'+start+'","skin":"'+skin+'","Button":"' + Button + '","award":"' + award + '","achieve":"' + achieve + '","skinType":"' + skinType + '"}';
		this.webSocket.writeUTF(cmd);
	}
	//切换场景
	/**
	 * type gameScene/beginScene 
	 */
	public changeScene(type:string){
		//移除所有界面	
		this.removeChildren();
		//初始化场景
		if(type == "gameScene"){ 
			this.gameScene = new GamePlay(); 
			this.addChild(this.gameScene);
		}else if(type == "beginScene"){
			//添加下一个场景
			this.beginScene = new BeginPage();
			this.addChild(this[type]);
		}
	}
}