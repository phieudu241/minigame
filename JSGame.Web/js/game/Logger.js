
/**
 * 记录类，可以在Firefox的FireBug插件中查看
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var Logger = new (new Class({
	// 构造函数
	initialize: function(){
		
		this.m_startTime = new Date();
		
		this.log("start.");
	},
	
	// 记录一条消息
	log: function(msg)
	{
		var now = new Date();
		// 本次距离上次log的时间间隔
		var elapsedTime = (now - this.m_startTime)/1000;
		this.m_startTime = now;
	
		if(window.console && console.log) 
		{
			console.log(elapsedTime + "\t" + msg);
		}
		else
		{
			//$("logResult2").innerHTML += msgType + "\t" + elapsedTime + "\t" + msg + "<br/>";
		}
	}
}))();
