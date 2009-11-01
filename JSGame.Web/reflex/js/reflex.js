
/**
 * 反应速度
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CTuGeZi = CGame.extend({
	// 构造函数
	initialize: function() 
	{
		// 调用CGame的initialize方法
		this.parent();
	},
	
	// [required]载入全部网页资源后执行
	_onWindowLoad: function() 
	{
		/////游戏参数，根据游戏级别设置///////////////////////////////////////////////////////
		// 行数
		this.m_rowCount = 9;
		// 列数
		this.m_columnCount = 8;
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 点中次数
		this.m_clickCount = 0;
		// 不中次数
		this.m_missCount = 0;
		// 总共次数
		this.m_totalCount = 0;
		////////////////////////////////////////////////////////////
		// 显示方块的时间间隔(毫秒)
		this.m_showInterval = 0;
		// 逝去的时间(毫秒)
		this.m_elapsedShowInterval = 0;
		// 当前显示的位置
		this.m_showRowColumn = [];
		
		this._initGameLevel();
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('clickCount').innerHTML = "-";
			$('missCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('clickCount').innerHTML = "0次";
				$('missCount').innerHTML = "0次";
			}
			
		}
		else if(gameStatus == GameStatus.Pause)
		{
			// 暂停游戏
		}
	},
	
	// [required]一个参数：定时器调用间隔
	_onTimeInterval: function(intervalMilliseconds)
	{
		if(this.g_getGameStatus() == GameStatus.Start)
		{
			this.m_elapsedShowInterval += intervalMilliseconds;
			
			if(this.m_elapsedShowInterval >= this.m_showInterval)
			{
				this.m_elapsedShowInterval = 0;
				// 显示下一个方块
				this._randomShowBlock();
			}
		}
	},
	
	// [required]一个参数：游戏级别（GameLevel）
	_onLevelChange: function(gameLevel)
	{
		this._initGameLevel(gameLevel);
	},
	
	// 根据游戏级别初始化游戏面板
	_initGameLevel: function(gameLevel)
	{
		if(!gameLevel)
		{
			gameLevel = $('level').value.toInt();
		}
		else
		{
			// 保持级别下拉列表和参数的一致
			$('level').value = gameLevel;
		}
		
		switch(gameLevel)
		{
			case GameLevel.Hello:
				this.m_showInterval = 1400;
				break;
			case GameLevel.Easy:
				this.m_showInterval = 1200;
				break;	
			case GameLevel.Middle:
				this.m_showInterval = 1000;
				break;	
			case GameLevel.Hard:
				this.m_showInterval = 800;
				break;	
			case GameLevel.Expert:
				this.m_showInterval = 600;
				break;	
		}
		// 点击次数
		this.m_clickCount = 0;
		this.m_missCount = 0;
		this.m_totalCount = 0;
		
		this._initGamePanel();
	},
	
	// 初始化MainTable
	_initGamePanel: function()
	{
		var reval = new CStringBuilder();
		reval.append('<table id="gameTable" cellspacing="0" cellpadding="0" border="0"');
		for(var i=0; i<this.m_rowCount; i++)
		{
			reval.append('<tr>');
			for(var j=0; j<this.m_columnCount; j++)
			{
				reval.append('<td id="'+ this.g_getCellId(i, j) +'">&nbsp;</td>');
			}
			reval.append('</tr>');
		}
		reval.append('</table>');
		
		$('main').innerHTML = reval.toString();
		
		$('gameTable').addEvent('click', this._onGameTableClick.bindWithEvent(this));
		$('gameTable').addEvent('selectstart', this._onGameTableSelectstart.bindWithEvent(this));
	},
	
	// 防止IE下按着鼠标左键拖动时选中单元格的内容
	_onGameTableSelectstart: function(evt)
	{
		evt.stop();
	},
	
	// 点击GameTable中的一个单元格
	_onGameTableClick: function(evt)
	{
		var target = $(evt.target);
		// 首先判断是单元格，而不是边框
		if(target.id.indexOf(this.m_cellPrefix) >= 0)
		{	
			// 点击即开始游戏
			this.g_startGame();
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			// 点中
			if(this.m_showRowColumn.length != 0
				&& this.m_showRowColumn[0] == row
				&& this.m_showRowColumn[1] == column)
			{
				var node = this.g_getCellNode(row, column);
				node.removeClass("filled");
				node.addClass("active");
				
				this.m_clickCount++;
				$('clickCount').innerHTML = this.m_clickCount + "次";
			}

		}
	},
	
	// 在随机的位置显示方块
	_randomShowBlock: function()
	{
		if(this.m_showRowColumn.length != 0)
		{
			var node = this.g_getCellNode(this.m_showRowColumn[0], this.m_showRowColumn[1]);
			node.removeClass("filled");
			node.removeClass("active");
		}
		
		var row = $random(0, this.m_rowCount-1);
		var column = $random(0, this.m_columnCount-1);
		
		this.m_showRowColumn = [row, column];
		
		this.g_getCellNode(row, column).addClass("filled");
		
		this.m_totalCount++;
		
		// 减去一，为了延迟一个方块
		this.m_missCount = this.m_totalCount - this.m_clickCount - 1;
		$('missCount').innerHTML = this.m_missCount + "次";
		
		if(this.m_missCount >= 10)
		{
			this.g_pauseGame();
			alert('已经不中10次了，游戏结束。');
			this.g_stopGame();
		}
			
			
	},
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CTuGeZi();