
/**
 * 数字排序
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CPaixu = CGame.extend({
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
		// 移动次数
		this.m_moveCount = 0;
		////////////////////////////////////////////////////////////
		// 二维数组（存放1,2,3,4,... 0表示此处为空）
		//this.m_matrix = [];
		
		this._initGameLevel();
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('moveCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('moveCount').innerHTML = "0次";
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
		// 点击次数
		this.m_moveCount = 0;
		
		this._initMatrix();
		
		this._initGamePanel();
	},
	
	_initMatrix: function()
	{
		this.g_initMatrix();
		
		if(this.m_cellCount == 4)
		{
			// 如果是2*2的矩阵，需要特殊处理，因为并不是每种情况都能出结果的
			this._initTwoPlusTwoMatrix($random(0, 2));
		}
		else
		{
			for(var j=0; j<this.m_cellCount; j++)
			{
				this.g_insertMatrixRandomNullCell(j);
			}
		}
		
		// 如果初始化的就是有序的，则重新初始化
		if(this._isComplete())
		{
			this._initMatrix();
		}
	},
	
	// 初始化2*2的矩阵，有三种可能(type=0,1,2)
	_initTwoPlusTwoMatrix: function(type)
	{
		switch(type)
		{
			case 0:
				this.m_matrix[0][0] = 3;
				this.m_matrix[0][1] = 1;
				this.m_matrix[1][0] = 0;
				this.m_matrix[1][1] = 2;
				break;
			case 1:
				this.m_matrix[0][0] = 0;
				this.m_matrix[0][1] = 3;
				this.m_matrix[1][0] = 2;
				this.m_matrix[1][1] = 1;
				break;
			case 2:
				this.m_matrix[0][0] = 2;
				this.m_matrix[0][1] = 0;
				this.m_matrix[1][0] = 1;
				this.m_matrix[1][1] = 3;
				break;
		}
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
				if(this.m_matrix[i][j] == 0)
				{
					reval.append('<td class="empty" id="'+ this.g_getCellId(i, j) +'">&nbsp;</td>');
				}
				else
				{
					reval.append('<td class="filled" id="'+ this.g_getCellId(i, j) +'">');
					reval.append(this.m_matrix[i][j]);
					reval.append('</td>');
				}
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
			
			var holeRowColumn = this._getHoleRowColumn();
			if(row == holeRowColumn[0] || column == holeRowColumn[1])
			{
				// 移动次数
				this.m_moveCount++;
				$('moveCount').innerHTML = this.m_moveCount + "次";
				
				this._moveBlock(row, column, holeRowColumn[0], holeRowColumn[1]);
				
				if(this._isComplete())
				{
					this.g_pauseGame();
					alert('恭喜，您赢了！');
					this.g_stopGame();
				}
			}
			else
			{
				// 点击的行或列中没有空格
			}	
		}
	},
	
	// 移动方块，其中holeRow, holeColumn是空格的位置
	_moveBlock: function(row, column, holeRow, holeColumn)
	{
		// 同一行
		if(row == holeRow)
		{
			// 空格在右侧
			if(column < holeColumn)
			{
				for(var i=holeColumn-1; i>=column; i--)
				{
					this.m_matrix[row][i+1] = this.m_matrix[row][i];
					this.m_matrix[row][i] = 0;
					
					var node0 = this.g_getCellNode(row, i+1);
					node0.removeClass('empty');
					node0.addClass('filled');
					node0.innerHTML = this.m_matrix[row][i+1];
					
					var node1 = this.g_getCellNode(row, i);
					node1.removeClass('filled');
					node1.addClass('empty');
					node1.innerHTML = "&nbsp;";
				}
			}
			else
			{
				// 空格在左侧
				for(var i=holeColumn+1; i<=column; i++)
				{
					this.m_matrix[row][i-1] = this.m_matrix[row][i];
					this.m_matrix[row][i] = 0;
					
					var node0 = this.g_getCellNode(row, i-1);
					node0.removeClass('empty');
					node0.addClass('filled');
					node0.innerHTML = this.m_matrix[row][i-1];
					
					var node1 = this.g_getCellNode(row, i);
					node1.removeClass('filled');
					node1.addClass('empty');
					node1.innerHTML = "&nbsp;";
				}
			}
		}
		else
		{
			// 同一列
			// 空格在下侧
			if(row < holeRow)
			{
				for(var i=holeRow-1; i>=row; i--)
				{
					this.m_matrix[i+1][column] = this.m_matrix[i][column];
					this.m_matrix[i][column] = 0;
					
					var node0 = this.g_getCellNode(i+1, column);
					node0.removeClass('empty');
					node0.addClass('filled');
					node0.innerHTML = this.m_matrix[i+1][column];
					
					var node1 = this.g_getCellNode(i, column);
					node1.removeClass('filled');
					node1.addClass('empty');
					node1.innerHTML = "&nbsp;";
				}
			}
			else
			{
				// 空格在左侧
				for(var i=holeRow+1; i<=row; i++)
				{
					this.m_matrix[i-1][column] = this.m_matrix[i][column];
					this.m_matrix[i][column] = 0;
					
					var node0 = this.g_getCellNode(i-1, column);
					node0.removeClass('empty');
					node0.addClass('filled');
					node0.innerHTML = this.m_matrix[i-1][column];
					
					var node1 = this.g_getCellNode(i, column);
					node1.removeClass('filled');
					node1.addClass('empty');
					node1.innerHTML = "&nbsp;";
				}
			}
		}
	},
	
	// 取得空格的位置
	_getHoleRowColumn: function()
	{
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				if(this.m_matrix[i][j] == 0)
				{
					return [i, j];
				}
			}
		}
		return [0, 0];
	},
	
	// 判断是否完成游戏
	_isComplete: function()
	{
		var number = 1;
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				if(i == this.m_rowCount - 1 && j == this.m_columnCount - 1)
				{
					if(this.m_matrix[i][j] != 0)
					{
						return false
					}
				}
				else if(this.m_matrix[i][j] != number)
				{
					return false;
				}
				number++;
			}
		}
		return true;
	},
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CPaixu();