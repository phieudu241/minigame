
/**
 * 快速字符串构造器
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CStringBuilder = new Class({
	// 构造函数
	initialize: function(initialValue) 
	{
		this.buffer	= [];
		this.bufferLength = 0;
		
		if(initialValue != null)
		{
			this.append(initialValue);
		}
	},
	
	// 连接一个新字符串
	append: function(appendValue)
	{
		if(appendValue == null)
		{
			return;
		}
		
		this.bufferLength += appendValue.length;
		
		this.buffer.push(appendValue)
	},
	
	// 清空字符串
	clear: function()
	{
		this.buffer = [];
		this.bufferLength = 0;
	},
	
	// 字符串长度
	length: function()
	{
		return this.bufferLength;
	},
	
	// 返回完整的字符串
	toString: function()
	{
		return this.buffer.join("");
	},
	
	empty: function()
	{
		;
	}
}); 