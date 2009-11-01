
/**
 * 帮助
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var Util = new Class({
	// 构造函数
	initialize: function() 
	{
		this.motive = "祝俺家小师生日快乐!小石头永远爱你！(2007-09-01)";
	},
	
	// 随机一个大于等于min，小于max的整数
	// [废除]
	random: function(min, max)
	{
		var distance = max - min;
		if(distance > 0)
		{
			return Math.floor(Math.random() * distance) + min;
		}
		else
		{
			return 0;
		}
	},
	
	// 返回事件点击的按键代码
	// [废除]
	keyCode: function(evt)
	{
		evt = evt ? evt : window.event;
		return evt.keyCode ? evt.keyCode : evt.which;
	},
	
	// 判断变量是否未定义或为空 undefined/null
	// [废除]
	isEmpty: function(variable)
	{
		// 如果没有声明变量，就不能和undefined比较，但是可以将此变量类型和'undefined'字符串比较
		if(typeof(variable) === 'undefined' || variable === null)
		{
			return true;
		}
		return false;
	},
	
	// 返回秒的字符串表示
	// [废除]
	formatSeconds: function(seconds)
	{
		// 两种特殊情况
		if(seconds == '-')
		{
			return '-';
		}
		if(seconds == 0)
		{
			return "0秒";
		}

		
		var rtStr = "";
		if(seconds >= 3600)
		{
			var hours = Math.floor(seconds/3600);
			seconds = seconds - hours * 3600;
			
			rtStr += hours + "时";
		}
		if(seconds >= 60)
		{
			var minutes = Math.floor(seconds/60);
			seconds = seconds - minutes * 60;
			
			rtStr += minutes + "分";
		}
		if(seconds != 0)
		{
			rtStr += seconds + "秒";
		}
		
		return rtStr;
	},
	
	// [废除]
	cloneArray: function(array)
	{
		var rtArray = [];
		for(var i=0; i<array.length; i++)
		{
			rtArray[i] = array[i];
		}
		return rtArray;
	},
	
	// 空函数
	empty: function()
	{
		;
	}
})();