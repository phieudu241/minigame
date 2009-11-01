
/**
 * 凃格子
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
		this.m_rowCount = 0;
		// 列数
		this.m_columnCount = 0;
		// 单元格总个数
		this.m_cellCount = 0;
		// 空的单元格个数
		this.m_emptyCellCount = 0;
		// 点击次数
		this.m_clickCount = 0;
		////////////////////////////////////////////////////////////
		// 填充/空/鼠标移动上面 的单元格的样式
		//this.m_classNameFilled = 'filled';
		//this.m_classNameEmpty = 'empty';
		
		this._initGameLevel();
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('leftCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('leftCount').innerHTML = this.m_emptyCellCount + "个";
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
				this.m_rowCount = 2;
				this.m_columnCount = 2;
				break;
			case GameLevel.Easy:
				this.m_rowCount = 3;
				this.m_columnCount = 3;
				break;	
			case GameLevel.Middle:
				this.m_rowCount = 4;
				this.m_columnCount = 4;
				break;	
			case GameLevel.Hard:
				this.m_rowCount = 5;
				this.m_columnCount = 5;
				break;	
			case GameLevel.Expert:
				this.m_rowCount = 6;
				this.m_columnCount = 6;
				break;	
		}
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 空的单元格个数
		this.m_emptyCellCount = this.m_cellCount;
		// 点击次数
		this.m_clickCount = 0;
		
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
		if(target.getTag() == 'td' && target.id.contains(this.m_cellPrefix))
		{	
			// 点击即开始游戏
			this.g_startGame();
		
			// 点击次数
			this.m_clickCount++;
			
			
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			// 设置当前单元格样式
			this._updateTableCellValue(row, column);
			
			// 设置周围单元格样式
			// 上
			if(row - 1 >= 0)
			{
				this._updateTableCellValue(row-1, column);
			}
			// 下
			if(row + 1 < this.m_rowCount)
			{
				this._updateTableCellValue(row+1, column);
			}
			// 左
			if(column - 1 >= 0)
			{
				this._updateTableCellValue(row, column-1);
			}
			// 右
			if(column + 1 < this.m_columnCount)
			{
				this._updateTableCellValue(row, column+1);
			}
			
			if(this.m_emptyCellCount == 0)
			{
				this.g_pauseGame();
				this.g_gameover.delay(500, this, '恭喜，您赢了！');
			}
		}
	},
	
	// 更新单元格值（如果选中，则设置为空；如果为空，则设置为选中）
	_updateTableCellValue: function(row, column)
	{
		var cellNode = this.g_getCellNode(row, column);
		if(cellNode.hasClass('filled'))
		{
			cellNode.removeClass('filled');
			cellNode.addClass('empty');
			this.m_emptyCellCount++;
			
			// 过渡效果
			cellNode.effect('background-color', {duration:500}).start('#EC870E', '#F7E9D4');
		}
		else
		{
			cellNode.removeClass('empty');
			cellNode.addClass('filled');
			this.m_emptyCellCount--;
			
			// 过渡效果
			cellNode.effect('background-color', {duration:500}).start('#F7E9D4', '#EC870E');
		}
		$('leftCount').innerHTML = this.m_emptyCellCount + "个";
	},
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CTuGeZi();