
/**
 * 图片还原
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CRecover = CGame.extend({
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
		////////////////////////////////////////////////////////////
		// 图片的宽度和高度
		this.m_imageWidth = 400;
		this.m_imageHeight = 300;
		// 图片路径
		this.m_imageUrl = "./img/1.gif";
		// 每个格子的宽度和高度
		this.m_clipWidth = 0;
		this.m_clipHeight = 0;
		// 图片被分成的片段[[0,12,12,0],[]] (其中[0,12,12,0]分别标识Top, right, bottom, and left)
		this.m_clips = [];
		// 第一次点击的格子[row, column]
		this.m_firstCell = [];
		// 第二次点击的格子[row, column]
		this.m_secondCell = [];
		// 移动的步数
		this.m_moveCount = 0;
		
		this._initGameLevel();
		
		$('baseImage').addEvent('change', this._onBaseImageChange.bindWithEvent(this));
	},
	
	// 基础图片变化
	_onBaseImageChange: function(evt)
	{
		this._setBaseImage();
		this._initGameLevel();
	},
	
	_setBaseImage: function()
	{
		var imageNumber = $('baseImage').value.toInt();
		
		switch(imageNumber)
		{
			case 1:
				this.m_imageWidth = 400;
				this.m_imageHeight = 300;
				this.m_imageUrl = "./img/1.gif";
				break;
			case 2:
				this.m_imageWidth = 264;
				this.m_imageHeight = 367;
				this.m_imageUrl = "./img/2.gif";
				break;
			case 3:
				this.m_imageWidth = 400;
				this.m_imageHeight = 298;
				this.m_imageUrl = "./img/3.gif";
				break;
			case 4:
				this.m_imageWidth = 400;
				this.m_imageHeight = 344;
				this.m_imageUrl = "./img/4.gif";
				break;
		}
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
				this._renderGamePanel();
				$('moveCount').innerHTML = "0步";
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
		this._clearFirstCell();
		this._clearSecondCell();
		
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
		// 设置图片
		this._setBaseImage();
		// 格子的宽度和高度
		this.m_clipWidth = this.m_imageWidth / this.m_columnCount;
		this.m_clipHeight = this.m_imageHeight / this.m_columnCount;
		
		this._initClips();
		
		// 初始化 this.m_matrix 中各个位置放置那一种 clip
		this._initMatrix();
		
		this._initGamePanel();
	},
	
	// 初始化this.m_cellCount个小格子的clip位置 
	_initClips: function()
	{
		this.m_clips = [];
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				var clip = [];
				// 加上2是为了在clip之间增加空隙
				clip[0] = this.m_clipHeight * i + 2;
				clip[1] = this.m_clipWidth * (j + 1);
				clip[2] = this.m_clipHeight * (i + 1);
				clip[3] = this.m_clipWidth * j + 2;
				
				this.m_clips.push(clip);
			}
		}
	},
	
	// 在this.m_matrix中存放this.m_clips的序号
	_initMatrix: function()
	{
		this.g_initMatrix();
		
		for(var i=0; i<this.m_cellCount; i++)
		{
			this.g_insertMatrixRandomNullCell(i);
		}
		
		if(this._testInOrder())
		{
			this._initMatrix();
		}
	},
	
	// 如果this.m_matrix中是按顺序排放的，也就是没有变化
	_testInOrder: function()
	{
		var index = 0;
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				if(this.m_matrix[i][j] != index)
				{
					return false;
				}
				index++;
			}
		}
		return true;
	},
	
	// 初始化游戏面板
	_initGamePanel: function()
	{
		var reval = new CStringBuilder();
		// border:5px solid #D7D7D7; -> 上下边界总共 10px
		// padding:2px; ->上下总共 4px
		var extraPixel = 4;
		var widthHeightStr = 'width="'+ (this.m_imageWidth + extraPixel) +'px" '+
			'height="'+ (this.m_imageHeight + extraPixel) +'px"';
		reval.append('<table id="gameTable" '+ widthHeightStr +' cellspacing="0" cellpadding="0" border="0"');
		reval.append('<tr><td align="center" valign="middle">');
		reval.append('<div style="position:relative;left:0px;top:0px;">');
		reval.append('<div class="clip" style="position:absolute;left:0px;top:0px;" id="gameTableInner">');
		reval.append('<img src="'+ this.m_imageUrl +'" />');
		reval.append('</div>');
		reval.append('</div>');
		reval.append('</td></tr>');
		reval.append('</table>');
		$('main').innerHTML = reval.toString();	
		
		$('gameTable').addEvent('click', this._onGameTableClick.bindWithEvent(this));
		$('gameTable').addEvent('selectstart', this._onGameTableSelectstart.bindWithEvent(this));
	},
	
	// 游戏开始，显示游戏内容
	_renderGamePanel: function()
	{
		var reval = new CStringBuilder();
				
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				reval.append('<div class="clip" id="'+ this.g_getCellId(i, j) +'" '+ this._getClipCellStyle(i, j) +'>');
				reval.append('<img src="'+ this.m_imageUrl +'" />');
				reval.append('</div>');
			}
		}
		
		$('gameTableInner').innerHTML = reval.toString();
	},
	
	// 取得this.m_matrix中[row, column]处的div的style
	_getClipCellStyle: function(row, column)
	{
		var clip = this.m_clips[this.m_matrix[row][column]];
		var clipStr = 'clip:rect('+clip[0]+'px '+clip[1]+'px '+clip[2]+'px '+clip[3]+'px);';
		// 加上2是为了在clip之间产生2px所造成的偏移
		var leftStr = 'left:'+ ( column * this.m_clipWidth - clip[3] + 2) +'px;';
		var topStr = 'top:'+ ( row * this.m_clipHeight - clip[0] + 2) +'px;';
		return 'style="'+ clipStr + leftStr + topStr +'position:absolute;"';
	},
	_updateClipCellStyle: function(node, row, column)
	{
		var clip = this.m_clips[this.m_matrix[row][column]];
		node.style.clip = 'rect('+clip[0]+'px '+clip[1]+'px '+clip[2]+'px '+clip[3]+'px)';
		
		node.style.left = ( column * this.m_clipWidth - clip[3] + 2) +'px';
		node.style.top = ( row * this.m_clipHeight - clip[0] + 2) +'px';
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
		if(target.getTag() === 'img')
		{	
			// 点击即开始游戏
			this.g_startGame();
			
			if(!target.parentNode)
			{
				return;
			}
			
			target = $(target.parentNode);
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			if(this.m_firstCell.length === 0)
			{
				this.m_firstCell[0] = row;
				this.m_firstCell[1] = column;
				target.addClass('alpha');
			}
			else if(this.m_secondCell.length === 0)
			{
				if(this.m_firstCell[0] == row && this.m_firstCell[1] == column)
				{
					this._clearFirstCell();
					return;
				}
				this.m_secondCell[0] = row;
				this.m_secondCell[1] = column;
				target.addClass('alpha');
				
				//window.setTimeout(this._processSecondCellClick.bind(this), 100);
				this._processSecondCellClick.delay(100, this);
			}
		}
		
	},
	
	// 点击了第二个单元格，要交换两个的位置
	_processSecondCellClick: function()
	{
		this.m_moveCount++;
		$('moveCount').innerHTML = this.m_moveCount + "步";
		
		var firstCellRow = this.m_firstCell[0];
		var firstCellColumn = this.m_firstCell[1];
		var secondCellRow = this.m_secondCell[0];
		var secondCellColumn = this.m_secondCell[1];
		
		var firstCellNode = this.g_getCellNode(firstCellRow, firstCellColumn);
		var secondCellNode = this.g_getCellNode(secondCellRow, secondCellColumn);
		/*
		firstCellNode.removeClassName('alpha');
		secondCellNode.removeClassName('alpha');
		this.m_firstCell = [];
		this.m_secondCell = [];
		*/
		this._clearFirstCell();
		this._clearSecondCell();
		
		// 交换 this.m_matrix 
		var temp = this.m_matrix[firstCellRow][firstCellColumn];
		this.m_matrix[firstCellRow][firstCellColumn] = this.m_matrix[secondCellRow][secondCellColumn];
		this.m_matrix[secondCellRow][secondCellColumn] = temp;
		
		// 更新页面元素
		this._updateClipCellStyle(firstCellNode, firstCellRow, firstCellColumn);
		this._updateClipCellStyle(secondCellNode, secondCellRow, secondCellColumn);
		
		// 如果是按顺序排放的，则完成
		if(this._testInOrder())
		{
			this.g_pauseGame();
			alert('恭喜，您赢了！');
			this.g_stopGame();
		}
	},
	
	// 清空第一个选中的单元格
	_clearFirstCell: function()
	{
		if(this.m_firstCell.length !== 0)
		{
			var firstCellNode = this.g_getCellNode(this.m_firstCell[0], this.m_firstCell[1]);
			firstCellNode.removeClass('alpha');
			this.m_firstCell = [];
		}
	},
	
	// 清空第二个选中的单元格
	_clearSecondCell: function()
	{
		if(this.m_secondCell.length !== 0)
		{
			var secondCellNode = this.g_getCellNode(this.m_secondCell[0], this.m_secondCell[1]);
			secondCellNode.removeClass('alpha');
			this.m_secondCell = [];
		}
	},
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CRecover();