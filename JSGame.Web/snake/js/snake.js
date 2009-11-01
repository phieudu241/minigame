
/**
 * 贪吃蛇
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CSnake = CGame.extend({
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
		this.m_rowCount = 12;
		// 列数
		this.m_columnCount = 12;
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 点击次数
		this.m_eatCount = 0;
		////////////////////////////////////////////////////////////
		// 移动的时间间隔(毫秒)
		this.m_moveInterval = 0;
		// 逝去的时间(毫秒)
		this.m_elapsedMoveInterval = 0;
		// 食物的位置
		this.m_foodRow = 0;
		this.m_foodColumn = 0;
		// 贪吃蛇数据，数组中每个元素是[row, column]的数组，第一个元素是蛇尾
		this.m_snake = [];
		// 贪吃蛇的长度(长度不会减少)
		//this.m_snakeLength = 0;
		// 蛇行进方向
		this.m_snakeDirection = Direction.Down;
		//this.m_snakeLastDirection = Direction.Down;
		
		this._initGameLevel();
		
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('eatCount').innerHTML = "-";
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				$('eatCount').innerHTML = "0个";
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
			this.m_elapsedMoveInterval += intervalMilliseconds;
			
			if(this.m_elapsedMoveInterval >= this.m_moveInterval)
			{
				this.m_elapsedMoveInterval = 0;
				// move
				this._moveBlockDirection();
			}
		}
	},
	
	// [required]一个参数：游戏级别（GameLevel）
	_onLevelChange: function(gameLevel)
	{
		this._initGameLevel(gameLevel);
	},
	
	// [required]点击鼠标右键，只有在游戏进行中才会调用此函数
	_onDocumentContextmenu: function(evt)
	{
		
	},
	
	// [required]一个参数：按下的键值（key）
	_onDocumentKeydown: function(key)
	{	
		switch(key)
		{
			case 'down':	// down
				// 开始游戏
				this.g_startGame();
				if(this.m_snake.length == 1 || (this.m_snake.length != 1 && this.m_snakeDirection != Direction.Up))
				{
					this.m_snakeDirection = Direction.Down;
				}
				break;
			case 'up':	// up
				this.g_startGame();
				if(this.m_snake.length == 1 || (this.m_snake.length != 1 && this.m_snakeDirection != Direction.Down))
				{
					this.m_snakeDirection = Direction.Up;
				}
				break;
			case 'left':	// left
				this.g_startGame();
				if(this.m_snake.length == 1 || (this.m_snake.length != 1 && this.m_snakeDirection != Direction.Right))
				{
					this.m_snakeDirection = Direction.Left;
				}
				break;
			case 'right':	// right
				this.g_startGame();
				if(this.m_snake.length == 1 || (this.m_snake.length != 1 && this.m_snakeDirection != Direction.Left))
				{
					this.m_snakeDirection = Direction.Right;
				}
				break;
		}
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
				this.m_moveInterval = 500;
				break;
			case GameLevel.Easy:
				this.m_moveInterval = 400;
				break;	
			case GameLevel.Middle:
				this.m_moveInterval = 300;
				break;	
			case GameLevel.Hard:
				this.m_moveInterval = 200;
				break;	
			case GameLevel.Expert:
				this.m_moveInterval = 100;
				break;	
		}
		this.m_elapsedMoveInterval = 0;
		this.m_foodRow = 0;
		this.m_foodColumn = 0;
		this.m_snake = [];
		//this.m_snakeLength = 0;
		this.m_snakeDirection = Direction.Down;
		// 吃掉食物数
		this.m_eatCount = 0;
		
		// 创建游戏面板
		this._initGamePanel();
		
		// 初始化贪吃蛇的位置
		this._initSnake();
		
		// 创建一个食物
		this._createAFood();
	},
	
	// 初始化贪吃蛇的位置
	_initSnake: function()
	{
		this.m_snake[0] = [];
		this.m_snake[0][0] = $random(0, this.m_rowCount-1);
		this.m_snake[0][1] = $random(0, this.m_columnCount-1);
		/*
		this.m_snake[1] = [];
		if(this.m_snake[0][0] + 1 < this.m_rowCount)
		{
			this.m_snake[1][0] = this.m_snake[0][0] + 1;
			this.m_snake[1][1] = this.m_snake[0][1];
		}
		else if(this.m_snake[0][1] + 1 < this.m_columnCount)
		{
			this.m_snake[1][0] = this.m_snake[0][0];
			this.m_snake[1][1] = this.m_snake[0][1] + 1;
		}
		else
		{
			this._initSnake();
			return;
		}
		*/
		
		this.g_getCellNode(this.m_snake[0][0], this.m_snake[0][1]).addClass('snake');
		//$(this.g_getCellId(this.m_snake[1][0], this.m_snake[1][1])).addClassName('snake');
	},
	
	// 创建一个食物
	_createAFood: function()
	{
		this.m_foodRow = $random(0, this.m_rowCount-1);
		this.m_foodColumn = $random(0, this.m_columnCount-1);
		
		if(this._isHitWithSnake(this.m_foodRow, this.m_foodColumn))
		{
			this._createAFood();
			return;
		}
		
		this.g_getCellNode(this.m_foodRow, this.m_foodColumn).addClass('food');
	},
	
	// 点[row, column]是否和贪吃蛇发生碰撞
	_isHitWithSnake: function(row, column)
	{
		var snakeLength = this.m_snake.length;
		for(var i=0; i<snakeLength; i++)
		{
			if(this.m_snake[i][0] == row && this.m_snake[i][1] == column)
			{
				return true;
			}
		}
		return false;
	},
	
	// 创建游戏面板
	_initGamePanel: function()
	{
		var reval = new CStringBuilder();
		reval.append('<table id="gameTable" cellspacing="0" cellpadding="0" border="0"');
		for(var i=0; i<this.m_rowCount; i++)
		{
			reval.append('<tr>');
			for(var j=0; j<this.m_columnCount; j++)
			{
				reval.append('<td id="'+ this.g_getCellId(i, j) +'"></td>');
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
	
	// 移动方块
	_moveBlock: function(offsetRow, offsetColumn)
	{
		var snakeLength = this.m_snake.length;
		
		// 测试的方块
		var testRow = this.m_snake[snakeLength - 1][0] + offsetRow;
		var testColumn = this.m_snake[snakeLength - 1][1] + offsetColumn;
		// 穿墙之术
		if(testRow < 0)
		{
			testRow = this.m_rowCount - 1;
		}
		else if(testRow >= this.m_rowCount)
		{
			testRow = 0;
		}
		if(testColumn < 0)
		{
			testColumn = this.m_columnCount - 1;
		}
		else if(testColumn >= this.m_columnCount)
		{
			testColumn = 0;
		}
			
		// 不能后退
		if(this._isHitWithSnake(testRow, testColumn))
		{
			this.g_pauseGame();
			alert("游戏结束。");
			this.g_stopGame();
			return;
		}
		
		// 如果和食物相撞，吃了它
		if(testRow == this.m_foodRow && testColumn == this.m_foodColumn)
		{
			this.m_eatCount++;
			$('eatCount').innerHTML = this.m_eatCount + "个";
			
			this.m_snake[snakeLength] = [];
			this.m_snake[snakeLength][0] = this.m_foodRow;
			this.m_snake[snakeLength][1] = this.m_foodColumn;
			
			this.g_getCellNode(this.m_foodRow, this.m_foodColumn).removeClass('food');
			this.g_getCellNode(this.m_foodRow, this.m_foodColumn).addClass('snake');
			
			this._createAFood();
		}
		else
		{
			// 设置蛇参数和页面显示
			this.g_getCellNode(this.m_snake[0][0], this.m_snake[0][1]).removeClass('snake');
			for(var i=0; i<snakeLength-1; i++)
			{
				this.m_snake[i][0] = this.m_snake[i+1][0];
				this.m_snake[i][1] = this.m_snake[i+1][1];
			}
			this.m_snake[snakeLength-1][0] = testRow;
			this.m_snake[snakeLength-1][1] = testColumn;
			this.g_getCellNode(testRow, testColumn).addClass('snake');
		}
	},
	
	// 将方块朝一个方向移动
	_moveBlockDirection: function()
	{
		switch(this.m_snakeDirection)
		{
			case Direction.Down:
				this._moveBlockDown();
				break;
			case Direction.Up:
				this._moveBlockUp();
				break;
			case Direction.Left:
				this._moveBlockLeft();
				break;
			case Direction.Right:
				this._moveBlockRight();
				break;
		}
	},
	
	_moveBlockDown: function()
	{
		this._moveBlock(1, 0);
	},
	
	_moveBlockUp: function()
	{
		this._moveBlock(-1, 0);
	},
	
	_moveBlockLeft: function()
	{
		this._moveBlock(0, -1);
	},
	
	_moveBlockRight: function()
	{
		this._moveBlock(0, 1);
	},
	
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CSnake();