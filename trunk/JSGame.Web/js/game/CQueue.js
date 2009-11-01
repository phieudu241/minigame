
/**
 * 队列
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CQueue = new Class({
	// 构造函数
	initialize: function() 
	{
		this.m_buffer	= [];
		this.m_startIndex = 0;
		this.m_endIndex = 0;
	},
	
	// 将对象添加到队列的结尾处
	// 不能添加null或undefined
	enqueue: function(enqueueValue)
	{
		// 队列中不能加入null值
		if(!$defined(enqueueValue))
		{
			return;
		}
		
		this.m_buffer[this.m_endIndex] = enqueueValue;
		
		this.m_endIndex++;
	},
	
	// 移除并返回队列开始处的对象
	dequeue: function()
	{
		// 如果队列为空，则返回null
		if(this.m_startIndex == this.m_endIndex)
		{
			return null;
		}
		
		var dequeueValue = this.m_buffer[this.m_startIndex];
		
		this.m_buffer[this.m_startIndex] = null;
		
		this.m_startIndex++;
		
		return dequeueValue;
	},
	
	// 清空队列
	clear: function()
	{
		this.buffer = [];
		this.m_startIndex = 0;
		this.m_endIndex = 0;
	},
	
	// 返回队列开头处的对象，但不删除
	peek: function()
	{
		// 如果队列为空，则返回null
		if(this.m_startIndex == this.m_endIndex)
		{
			return null;
		}
		
		return this.m_buffer[this.m_startIndex];
	},
	
	// 队列中对象的个数
	getLength: function()
	{
		return this.m_endIndex - this.m_startIndex;
	},
	
	// 队列中是否包含对象
	contains: function(testValue)
	{
		for(var i=this.m_startIndex; i<this.m_endIndex; i++)
		{
			if(this.m_buffer[i] == testValue)
			{
				return true;
			}
		}
		return false;
	},
	
	empty: function()
	{
		
	}
});
