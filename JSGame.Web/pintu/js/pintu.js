
/**
 * 记忆拼图
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CPintu = CGame.extend({
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
		// 剩余多少个格子
		this.m_leftCount = 0;
		// 点击次数
		this.m_clickCount = 0;
		////////////////////////////////////////////////////////////
		// 第一次点击的图片的位置
		this.m_firstIndex = 0;
		this.m_firstRowColumn = [];
		// 第二次点击的图片的位置
		this.m_secondIndex = 0;
		this.m_secondRowColumn = [];
		// 当前第几套图片
		this.m_imageNumber = 1;
		
		// 预加载所有图片
		this._preLoadImages();
		
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
				this.m_imageNumber = 1;
				break;
			case 2:
				this.m_imageNumber = 2;
				break;
		}
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
				$('leftCount').innerHTML = this.m_leftCount / 2  + "对";
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
		this._hideFirstSecond();
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
	
	// 预加载所有图片
	_preLoadImages: function()
	{
		this.m_imageCaches = [];
		
		// 第一套图片（13个）
		this.m_imageCaches[0] = [];
		for(var i=1; i<=12; i++)
		{
			this.m_imageCaches[0][i] = new Image();
			this.m_imageCaches[0][i].src = "./img/1/"+i+".gif";
		}
		this.m_imageCaches[0][0] = new Image();
		this.m_imageCaches[0][0].src = "./img/1/hide.gif";
		
		// 第二套图片（13个）
		this.m_imageCaches[1] = [];
		for(var i=1; i<=12; i++)
		{
			this.m_imageCaches[1][i] = new Image();
			this.m_imageCaches[1][i].src = "./img/2/"+i+".gif";
		}
		this.m_imageCaches[1][0] = new Image();
		this.m_imageCaches[1][0].src = "./img/2/hide.gif";
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
		
		this._setBaseImage();
		
		switch(gameLevel)
		{
			case GameLevel.Hello:
				if(this.m_imageNumber === 1)
				{
					this.m_rowCount = 3;
					this.m_columnCount = 2;
				}
				else if(this.m_imageNumber === 2)
				{
					this.m_rowCount = 2;
					this.m_columnCount = 3;
				}
				break;
			case GameLevel.Easy:
				if(this.m_imageNumber === 1)
				{
					this.m_rowCount = 4;
					this.m_columnCount = 3;
				}
				else if(this.m_imageNumber === 2)
				{
					this.m_rowCount = 3;
					this.m_columnCount = 4;
				}
				break;	
			case GameLevel.Middle:
				this.m_rowCount = 4;
				this.m_columnCount = 4;
				break;	
			case GameLevel.Hard:
				if(this.m_imageNumber === 1)
				{
					this.m_rowCount = 5;
					this.m_columnCount = 4;
				}
				else if(this.m_imageNumber === 2)
				{
					this.m_rowCount = 4;
					this.m_columnCount = 5;
				}
				break;	
			case GameLevel.Expert:
				if(this.m_imageNumber === 1)
				{
					this.m_rowCount = 6;
					this.m_columnCount = 4;
				}
				else if(this.m_imageNumber === 2)
				{
					this.m_rowCount = 4;
					this.m_columnCount = 6;
				}
				break;	
		}
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 空的单元格个数
		this.m_leftCount = this.m_cellCount;
		// 点击次数
		this.m_clickCount = 0;		
		
		this._initMatrix(gameLevel);
		
		this._initGamePanel();
	},
	
	_initMatrix: function(gameLevel)
	{
		this.g_initMatrix();
		
		// 将1,2,3,4... 分对添加到this.m_matrix中去
		var maxPicIndex = this.m_cellCount / 2 ;
		for(var j=1; j<=maxPicIndex; j++)
		{
			this.g_insertMatrixRandomNullCell(j);
			this.g_insertMatrixRandomNullCell(j);		
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
				reval.append('<td id="'+ this.g_getCellId(i, j) +'">');
				reval.append('<img class="bottom" src="./img/'+ this.m_imageNumber +'/hide.gif" />');
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
		if(target.getTag() === 'img')
		{	
			// 点击即开始游戏
			this.g_startGame();
			// 点击次数
			this.m_clickCount++;
			
			target = target.parentNode;
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			// 如果点击关闭的牌，则要展示背面的牌
			if(this.g_getCellNode(row, column).firstChild.src.lastIndexOf("hide.gif") >= 0)
			{
				var index = this.m_matrix[row][column];
				if(this.m_firstIndex == 0)
				{
					// 第一次点击
					this.m_firstIndex = index;
					this.m_firstRowColumn[0] = row;
					this.m_firstRowColumn[1] = column;
					this.g_getCellNode(row, column).firstChild.src = './img/'+ this.m_imageNumber +'/'+ index +'.gif';
				}
				else if(this.m_secondIndex == 0)
				{
					// 第二次点击
					this.m_secondIndex = index;
					this.m_secondRowColumn[0] = row;
					this.m_secondRowColumn[1] = column;
					this.g_getCellNode(row, column).firstChild.src = './img/'+ this.m_imageNumber +'/'+ index +'.gif';
					
					if(this.m_firstIndex == this.m_secondIndex)
					{
						this.m_leftCount -= 2;
						$('leftCount').innerHTML = this.m_leftCount / 2 + "对";
						
						this.m_firstIndex = 0;
						this.m_secondIndex = 0;	
					}
				}
				else
				{
					// 第三次一定是两个不同的
					if(this.m_firstIndex != this.m_secondIndex)
					{
						// 隐藏第一张，第二张
						this._hideFirstSecond();
						// 选中当前
						this.m_firstIndex = index;
						this.m_firstRowColumn[0] = row;
						this.m_firstRowColumn[1] = column;
						this.g_getCellNode(row, column).firstChild.src = './img/'+ this.m_imageNumber +'/'+ index +'.gif';
					}				
				}
			}
			else
			{
				// 点击的是已经打开的牌
				// 如果第一张，第二张牌都已经打开，并且两张不一样，则隐藏
				if((this.m_firstIndex != this.m_secondIndex)
					&& this.m_firstIndex != 0 && this.m_secondIndex != 0)
				{
					this._hideFirstSecond();
				}	
			}
						
			if(this.m_leftCount == 0)
			{
				this.g_pauseGame();
				alert('恭喜，您赢了！');
				this.g_stopGame();
			}
		}
		
	},
	
	// 隐藏已经打开的牌
	_hideFirstSecond: function()
	{
		if(this.m_firstIndex != 0)
		{
			this.m_firstIndex = 0;
			this.g_getCellNode(this.m_firstRowColumn[0], this.m_firstRowColumn[1]).firstChild.src = './img/'+ this.m_imageNumber +'/hide.gif';
		}
		if(this.m_secondIndex != 0)
		{
			this.m_secondIndex = 0;	
			this.g_getCellNode(this.m_secondRowColumn[0], this.m_secondRowColumn[1]).firstChild.src = './img/'+ this.m_imageNumber +'/hide.gif';
		}			
	},
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CPintu();