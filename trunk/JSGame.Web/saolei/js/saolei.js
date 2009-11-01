
/**
 * 扫雷
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CSaolei = CGame.extend({
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
		// 1：地雷 0：空格子
		//this.m_matrix = [];
		////////////////////////////////////////////////////////////
		// 雷的总个数
		this.m_mineCount = 0;
		// 用户标识数
		this.m_biaoshiCount = 0;
		// 用户找到的雷的个数
		this.m_findMineCount = 0;
		// 地雷矩阵，数字表示周围地雷的个数，-1表示地雷
		this.m_mineMatrix = [];
		
		this._initGameLevel();
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('mineCount').innerHTML = "-";
			$('biaoshiCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('biaoshiCount').innerHTML = "0个";
				$('mineCount').innerHTML = this.m_mineCount + "个";
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
	
	// [required]点击鼠标右键，只有在游戏进行中才会调用此函数
	_onDocumentContextmenu: function(evt)
	{
		var target = $(evt.target);
		// 首先判断是单元格，而不是边框
		if(target.id.indexOf(this.m_cellPrefix) >= 0)
		{
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			var node = this.g_getCellNode(row, column);
			// 如果此格子已经显示了，不能再标识了
			if(node.hasClass('clear'))
			{
				return;
			}
			if(node.hasClass('biaoshi'))
			{
				node.removeClass('biaoshi');
				
				this.m_biaoshiCount--;
				this._updateBiaoshiCount();
				
				if(this.m_mineMatrix[row][column] == -1)
				{
					this.m_findMineCount--;
				}
			}
			else
			{
				node.addClass('biaoshi');
				
				this.m_biaoshiCount++;
				this._updateBiaoshiCount();
				
				if(this.m_mineMatrix[row][column] == -1)
				{
					this.m_findMineCount++;
				}
			}
			
			if(this.m_findMineCount == this.m_mineCount && this.m_findMineCount == this.m_biaoshiCount)
			{
				this.g_pauseGame();
				alert('恭喜，您赢了！');
				this.g_stopGame();
			}
			
		}
	},
	
	// [required]一个参数：按下的键值（key）
	_onDocumentKeydown: function(key)
	{	
		switch(key)
		{
			case 'down':
				break;
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
				this.m_rowCount = 6;
				this.m_columnCount = 6;
				break;
			case GameLevel.Easy:
				this.m_rowCount = 8;
				this.m_columnCount = 8;
				break;	
			case GameLevel.Middle:
				this.m_rowCount = 10;
				this.m_columnCount = 10;
				break;	
			case GameLevel.Hard:
				this.m_rowCount = 12;
				this.m_columnCount = 12;
				break;	
			case GameLevel.Expert:
				this.m_rowCount = 14;
				this.m_columnCount = 14;
				break;	
		}
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		
		var minMineCount = Math.floor(this.m_cellCount * 0.05);
		var maxMineCount = Math.floor(this.m_cellCount * 0.15);
		this.m_mineCount = $random(minMineCount, maxMineCount-1);	
		this.m_findMineCount = 0;
		this.m_biaoshiCount = 0;
		
		this._initMatrix();
		this._initMineMatrix();
		
		this._initGamePanel();
	},
	
	// 初始化this.m_matrix
	_initMatrix: function()
	{
		this.g_initMatrix();
		
		for(var i=0; i<this.m_mineCount; i++)
		{
			this.g_insertMatrixRandomNullCell(1);
		}
		
		this.g_initMatrixNullCell(0);
	},
	
	// 初始化地雷矩阵
	_initMineMatrix: function()
	{
		this.m_mineMatrix = [];
		for(var i=0; i<this.m_rowCount; i++)
		{
			this.m_mineMatrix[i] = [];
			for(var j=0; j<this.m_columnCount; j++)
			{
				this.m_mineMatrix[i][j] = this._getMineMatrixValue(i, j);
			}
		}
	},
	
	// 取得m_mineMatrix中单元格中的值
	_getMineMatrixValue: function(row, column)
	{
		if(this.m_matrix[row][column] == 1)
		{
			return -1;
		}
		
		return this._getMatrixValue(row-1, column)
			+ this._getMatrixValue(row+1, column)
			+ this._getMatrixValue(row, column-1)
			+ this._getMatrixValue(row, column+1)
			+ this._getMatrixValue(row+1, column+1)
			+ this._getMatrixValue(row-1, column+1)
			+ this._getMatrixValue(row+1, column-1)
			+ this._getMatrixValue(row-1, column-1);
	},
	
	// 取得m_matrix中单元格中的值
	_getMatrixValue: function(row, column)
	{
		// 越界，返回0
		if(row <0 || row >= this.m_rowCount
			|| column <0 || column >= this.m_columnCount)
		{
			return 0;
		}
		return this.m_matrix[row][column];
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
				reval.append('<td id="'+ this.g_getCellId(i, j) +'">');
				//reval.append(this.m_mineMatrix[i][j]);
				reval.append('&nbsp;');
				reval.append('</td>');
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
			
			var mineValue = this.m_mineMatrix[row][column];
			var node = $(this.g_getCellId(row, column));
			// 如果此点为标识，则不处理左键点击
			if(node.hasClass('biaoshi'))
			{
				return;
			}
			if(mineValue == -1)
			{
				this._showAllMine();
				this.g_pauseGame();
				alert('^_^，您踩地雷了！');
				this.g_stopGame();
			}
			else if(mineValue == 0)
			{
				this._floodAround(row, column);
			}
			else
			{
				node.innerHTML = mineValue;
				node.addClass('nodilei');
			}
			
		}
		
	},
	
	// 由于当前格子this.m_mineMatrix[row][column] == 0，所以显示周围的所有为0，1
	// 如果有为空的格子被标记了，则去掉标记，显示出来
	_floodAround: function(row, column)
	{
		// 使用过的节点
		var usedList = [];
		
		var queue = new CQueue();
		queue.enqueue([row, column]);
		usedList.push([row, column]);
		
		while(queue.getLength() != 0)
		{
			var rowColumn = queue.dequeue();
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			var node = $(this.g_getCellId(row, column));
			var mineValue = this.m_mineMatrix[row][column];
			if(mineValue == 0)
			{
				// 扩展四个方向
				if(this._isNeedExpand(row+1, column, usedList))
				{
					queue.enqueue([row+1, column]);
					usedList.push([row+1, column]);
				}
				if(this._isNeedExpand(row-1, column, usedList))
				{
					queue.enqueue([row-1, column]);
					usedList.push([row-1, column]);
				}
				if(this._isNeedExpand(row, column+1, usedList))
				{
					queue.enqueue([row, column+1]);
					usedList.push([row, column+1]);
				}
				if(this._isNeedExpand(row, column-1, usedList))
				{
					queue.enqueue([row, column-1]);
					usedList.push([row, column-1]);
				}
				
				// 此节点被标识过,则去掉标识
				if(node.hasClass('biaoshi'))
				{
					node.removeClass('biaoshi');
					this.m_biaoshiCount--;
					this._updateBiaoshiCount();
				}
				
				node.addClass('nodilei');
			}
			else if(mineValue >= 1)
			{
				// 不扩展了
				node.innerHTML = mineValue;
				node.addClass('nodilei');
			}
		}
	},
	
	// 是否需要扩展，
	// 如果在矩阵外面，不扩展，返回false
	// 如果[row, column]在usedList中，不扩展，返回false
	_isNeedExpand: function(row, column, usedList)
	{
		if(this.g_testPositionOut(row, column))
		{
			return false;
		}
		for(var i=0; i<usedList.length; i++)
		{
			if(usedList[i][0] == row && usedList[i][1] == column)
			{
				return false;	
			}
		}
		return true;
	},
	
	// 显示所有地雷
	_showAllMine: function()
	{
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				if(this.m_mineMatrix[i][j] == -1)
				{
					var node = this.g_getCellNode(i, j);
					node.addClass('dilei');
				}
			}
		}
	},
	
	_updateBiaoshiCount: function()
	{
		$('biaoshiCount').innerHTML = this.m_biaoshiCount + "个";
	},
	
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CSaolei();