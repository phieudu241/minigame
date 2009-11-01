
/**
 * 俄罗斯方块
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CELuoSi = CGame.extend({
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
		this.m_rowCount = 16;
		// 列数
		this.m_columnCount = 10;
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 消去的行数
		this.m_deleteCount = 0;
		// 下坠的时间间隔(毫秒)
		this.m_dropInterval = 0;
		// 逝去的时间(毫秒)
		this.m_elapsedDropInterval = 0;
		////////////////////////////////////////////////////////////
		// 方块的类型（6中），每种包含的个数（最多4个）
		this.m_blocks  = [];
		// 二维数组，记录每个单元格中元素的类型（不包括当前正在移动的单元格）
		// 有两种类型，0：空的 1：有元素
		//this.m_matrix = [];
		////////////////////////////////////////////////////////////
		// 当前方块的类型
		this.m_blockTypeIndex = 0;
		// 方块所在的4*4矩阵左上角的行号和列号
		this.m_blockRow = 0;
		this.m_blockColumn = 3;
		// 上次方块的位置
		//this.m_blockLastRow = 0;
		//this.m_blockLastColumn = 3;
		// 方块旋转序号
		this.m_blockRotateIndex = 0;
		// 当前方块的位置字符串信息（相对于4*4矩阵）
		this.m_blockStr = "";
		
		// 初始化方块的类型，以及每个类型的个数
		// 每局游戏都不会变化的参数可以在此初始化
		this._initBlocks();
		
		this._initGameLevel();
	},
	
	// 初始化方块的类型，以及每个类型的个数
	_initBlocks: function()
	{
		// #
		this.m_blocks[0] = [];
		this.m_blocks[0][0] = "00011011";
		
		// |
		this.m_blocks[1] = [];
		this.m_blocks[1][0] = "00102030";
		this.m_blocks[1][1] = "00010203";
		
		// S
		this.m_blocks[2] = [];
		this.m_blocks[2][0] = "00101121";
		this.m_blocks[2][1] = "01021011";
		
		// Z
		this.m_blocks[3] = [];
		this.m_blocks[3][0] = "01101120";
		this.m_blocks[3][1] = "00011112";
		
		// T
		this.m_blocks[4] = [];
		this.m_blocks[4][0] = "00101120";
		this.m_blocks[4][1] = "00010211";
		this.m_blocks[4][2] = "01101121";
		this.m_blocks[4][3] = "01101112";
		
		// 7
		this.m_blocks[5] = [];
		this.m_blocks[5][0] = "00011121";
		this.m_blocks[5][1] = "02101112";
		this.m_blocks[5][2] = "00102021";
		this.m_blocks[5][3] = "00010210";
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('deleteCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('deleteCount').innerHTML = "0行";
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
			this.m_elapsedDropInterval += intervalMilliseconds;
			
			if(this.m_elapsedDropInterval >= this.m_dropInterval)
			{
				this.m_elapsedDropInterval = 0;
				// down
				this._moveBlockDown();
			}
		}
	},
	
	// [required]点击鼠标右键，只有在游戏进行中才会调用此函数
	_onDocumentContextmenu: function(evt)
	{
		this._notSelectAllCells();
	},
	
	// [required]一个参数：按下的键值（key）
	_onDocumentKeydown: function(key)
	{	
		switch(key)
		{
			case 'down':	// down
				// 开始游戏
				this.g_startGame();
				this._moveBlockDown();
				break;
			case 'up':	// up
				this.g_startGame();
				this._rotateBlock();
				break;
			case 'left':	// left
				this.g_startGame();
				this._moveBlockLeft();
				break;
			case 'right':	// right
				this.g_startGame();
				this._moveBlockRight();
				break;
			case 'space':	// Space
				this.g_startGame();
				this._moveBlockDownDirectly();
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
				this.m_dropInterval = 1200;
				break;
			case GameLevel.Easy:
				this.m_dropInterval = 1000;
				break;	
			case GameLevel.Middle:
				this.m_dropInterval = 800;
				break;	
			case GameLevel.Hard:
				this.m_dropInterval = 600;
				break;	
			case GameLevel.Expert:
				this.m_dropInterval = 500;
				break;	
		}
		// 消去的行数
		this.m_deleteCount = 0;
		
		this.g_initMatrix(0);
		
		// 初始化GameTable
		this._initGamePanel();
		
		// 初始化 第一个方块
		this._createABlock();
		
	},
	
	// 初始化GameTable
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
	
	// 点击表格
	_onGameTableClick: function(evt)
	{
		var target = $(evt.target);
		// 首先判断是单元格，而不是边框
		if(target.id.indexOf(this.m_cellPrefix) >= 0)
		{
			// 点击即开始游戏
			if(this.g_getGameStatus() != GameStatus.Start)
			{
				this.g_startGame();
				return;
			}
		}
	},
	
	// 创建一个Block
	_createABlock: function()
	{
		this.m_blockTypeIndex = $random(0, this.m_blocks.length-1);
		this.m_blockRow = 0;
		this.m_blockColumn = 3;
		this.m_blockRotateIndex = $random(0, this.m_blocks[this.m_blockTypeIndex].length-1);
	
		this.m_blockStr = this.m_blocks[this.m_blockTypeIndex][this.m_blockRotateIndex];
		
		var canMove = this._moveBlock(0, 0);
		
		if(!canMove)
		{
			this.g_pauseGame();
			alert("游戏结束。");
			this.g_stopGame();
		}
	},
	
	// 移动方块
	_moveBlock: function(offsetRow, offsetColumn)
	{
		var blockLastRow = this.m_blockRow;
		var blockLastColumn = this.m_blockColumn;
		
		this.m_blockRow += offsetRow;
		this.m_blockColumn += offsetColumn;
		
		var canMove = true;
		
		for(var i=0; i<8; i+=2)
		{
			var row = this.m_blockRow + this.m_blockStr.charAt(i).toInt();
			var column = this.m_blockColumn + this.m_blockStr.charAt(i+1).toInt();
			
			if(row < 0 || row >= this.m_rowCount 
				|| column <0 || column >= this.m_columnCount)
			{
				canMove = false;
				break;
			}
			
			if(this.m_matrix[row][column] == 1)
			{
				canMove = false;
				break;
			}
		}
		
		// 不通过，返回false，同时还原参数m_blockRow、m_blockColumn
		if(!canMove)
		{
			this.m_blockRow = blockLastRow;
			this.m_blockColumn = blockLastColumn;
			return false;
		}
		else
		{
			// 清空原来的
			for(var i=0; i<8; i+=2)
			{
				var row = blockLastRow + this.m_blockStr.charAt(i).toInt();
				var column = blockLastColumn + this.m_blockStr.charAt(i+1).toInt();
				
				var cellNode = this.g_getCellNode(row, column);
				cellNode.removeClass("filled");
			}
			// 填充当前的
			for(var i=0; i<8; i+=2)
			{
				var row = this.m_blockRow + this.m_blockStr.charAt(i).toInt();
				var column = this.m_blockColumn + this.m_blockStr.charAt(i+1).toInt();
				
				var cellNode = this.g_getCellNode(row, column);
				cellNode.addClass("filled");
			}
			return true;
		}
	},
	
	// 向下移动（直接下降到底部）
	_moveBlockDownDirectly: function()
	{
		var canMove = this._moveBlockDown();
		
		if(canMove)
		{
			//window.setTimeout(this._moveBlockDownDirectly.bind(this), 20);
			this._moveBlockDownDirectly.delay(20, this);
		}
	},
	
	// 向下移动
	_moveBlockDown: function()
	{
		var canMove = this._moveBlock(1, 0);
		
		// 如果不能下移，则说明已经到底
		if(!canMove)
		{
			var maxRow = 0;
			// 首先修改当前方块的颜色，填充this.m_matrix
			for(var i=0; i<8; i+=2)
			{
				var row = this.m_blockRow + this.m_blockStr.charAt(i).toInt();
				var column = this.m_blockColumn + this.m_blockStr.charAt(i+1).toInt();
				
				var cellNode = this.g_getCellNode(row, column);
				cellNode.removeClass("filled");
				cellNode.addClass("fixed");
				
				this.m_matrix[row][column] = 1;
				
				if(row > maxRow)
				{
					maxRow = row;
				}
			}
			
			// 检查是否能消去行(从maxRow向上开始检查)
			for(var i=maxRow; i>=0; i--)
			{
				if(this._canRowDelete(i))
				{
					this._deleteRow(i);
					i++;
					
					// 消去一行了
					this.m_deleteCount++;
					$('deleteCount').innerHTML = this.m_deleteCount + "行";
				}
			}

			// 创建新的方块
			this._createABlock();
		}
		
		return canMove;
	},
	
	// 消去此行
	_deleteRow: function(row)
	{
		for(var i=row-1; i>=0; i--)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				var cellNode0 = this.g_getCellNode(i, j);
				cellNode0.removeClass("fixed");
				
				this.m_matrix[i+1][j] = this.m_matrix[i][j];
				var cellNode1 = this.g_getCellNode(i+1, j);
				if(this.m_matrix[i+1][j] == 1)
				{
					cellNode1.addClass("fixed");
				}
				else
				{
					cellNode1.removeClass("fixed");
				}
			}
		}
		
	},
	
	// 此行能否消去
	_canRowDelete: function(row)
	{
		for(var i=0; i<this.m_columnCount; i++)
		{
			if(this.m_matrix[row][i] == 0)
			{
				return false;
			}
		}
		return true;
	},
	
	_moveBlockLeft: function()
	{
		this._moveBlock(0, -1);
	},
	
	_moveBlockRight: function()
	{
		this._moveBlock(0, 1);
	},
	
	// 旋转方块
	_rotateBlock: function()
	{
		var lastBlockRotateIndex = this.m_blockRotateIndex;
		var lastBlockStr = this.m_blockStr;
				
		this.m_blockRotateIndex++;
		if(this.m_blockRotateIndex >= this.m_blocks[this.m_blockTypeIndex].length)
		{
			this.m_blockRotateIndex = 0;
			if(this.m_blockRotateIndex == lastBlockRotateIndex)
			{
				return false;
			}
		}
		this.m_blockStr = this.m_blocks[this.m_blockTypeIndex][this.m_blockRotateIndex];
		
		var canRotate = true;
		for(var i=0; i<8; i+=2)
		{
			var row = this.m_blockRow + this.m_blockStr.charAt(i).toInt();
			var column = this.m_blockColumn + this.m_blockStr.charAt(i+1).toInt();
			
			if(row < 0 || row >= this.m_rowCount 
				|| column <0 || column >= this.m_columnCount)
			{
				canRotate = false;
				break;
			}
			
			if(this.m_matrix[row][column] == 1)
			{
				canRotate = false;
				break;
			}
		}
		
		// 不能旋转，返回false，同时还原参数m_blockRotateIndex、m_blockStr
		if(!canRotate)
		{
			this.m_blockRotateIndex = lastBlockRotateIndex;
			this.m_blockStr = lastBlockStr;
			return false;
		}
		else
		{
			// 清空原来的
			for(var i=0; i<8; i+=2)
			{
				var row = this.m_blockRow + lastBlockStr.charAt(i).toInt();
				var column = this.m_blockColumn + lastBlockStr.charAt(i+1).toInt();
				
				var cellNode = this.g_getCellNode(row, column);
				cellNode.removeClass("filled");
			}
			// 填充当前的
			for(var i=0; i<8; i+=2)
			{
				var row = this.m_blockRow + this.m_blockStr.charAt(i).toInt();
				var column = this.m_blockColumn + this.m_blockStr.charAt(i+1).toInt();
				
				var cellNode = this.g_getCellNode(row, column);
				cellNode.addClass("filled");
			}
			return true;
		}
	},

	
	// 空函数
	empty: function()
	{
		;
	}
});

new CELuoSi();