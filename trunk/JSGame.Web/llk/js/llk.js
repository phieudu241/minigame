
/**
 * 连连看
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CLLK = CGame.extend({
	// 构造函数
	initialize: function() 
	{
		// 调用CGame的initialize方法
		this.parent();
	},
	
	// [required]载入全部网页资源后执行
	_onWindowLoad: function() 
	{
		// 行数
		this.m_rowCount = 0;
		// 列数
		this.m_columnCount = 0;
		// 单元格总个数
		this.m_cellCount = 0;
		// 单元格中有Animal的个数
		this.m_leftAnimalCount = 0;

		// 总共动物的个数
		this.m_animalCount = 34;
		// 二维数组，记录每个单元格中动物的Id
		//this.m_matrix = [];
		
		// 洗牌次数
		this.m_xipaiCount = 0;
		
		// 需要比对的第一个动物的位置[row,column]
		this.m_firstAnimalPosition = null;
		// 需要比对的第二个动物的位置[row,column]
		this.m_secondAnimalPosition = null;
		
		
		// 预加载所有图片
		this._preLoadImages();
		// 加载游戏面板
		this._initGameLevel();
		
		// 点击洗牌按钮	
		$('xipai').addEvent('click', this._onXipaiClick.bindWithEvent(this));
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('leftCount').innerHTML = "-";
			$('xipaiCount').innerHTML = '-';
			//$('xipai').disabled = true;
			$('xipai').addClass('disabled');
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				this._renderGamePanel();
				$('leftCount').innerHTML = this.m_leftAnimalCount / 2 + "对";
				$('xipaiCount').innerHTML = this.m_xipaiCount + '次';
				
				$('xipai').removeClass('disabled');
				//$('xipai').disabled = false;
			}
			else
			{
				// 继续游戏
				$('xipai').removeClass('disabled');
				//$('xipai').disabled = false;
			}
			
		}
		else if(gameStatus == GameStatus.Pause)
		{
			// 暂停游戏
			$('xipai').addClass('disabled');
			//$('xipai').disabled = true;
		}
	},
	
	// [required]一个参数：定时器调用间隔
	_onTimeInterval: function(intervalMilliseconds)
	{
		
	},
	
	// [required]点击鼠标右键，只有在游戏进行中才会调用此函数
	_onDocumentContextmenu: function(evt)
	{
		if(this.m_firstAnimalPosition)
		{
			this._setFirstAnimalNotSelected();
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
				this.m_rowCount = 4;
				this.m_columnCount = 6;
				break;
			case GameLevel.Easy:
				this.m_rowCount = 5;
				this.m_columnCount = 8;
				break;	
			case GameLevel.Middle:
				this.m_rowCount = 6;
				this.m_columnCount = 9;
				break;	
			case GameLevel.Hard:
				this.m_rowCount = 7;
				this.m_columnCount = 10;
				break;	
			case GameLevel.Expert:
				this.m_rowCount = 8;
				this.m_columnCount = 12;
				break;	
		}
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 单元格中有Animal的个数
		this.m_leftAnimalCount = this.m_cellCount;
		// 洗牌次数
		this.m_xipaiCount = 0;
		
		// 初始化Matrix
		this.g_initMatrix();
		// 初始化Table中的图片
		this._initAnimalBlocks(gameLevel);
		
		this._initGamePanel();
	},

	// 预加载所有图片
	_preLoadImages: function()
	{
		var imageCaches = [];
		// 第一幅为空白图片
		var imagesCount = this.m_animalCount + 1;
		// 总共有35*2幅图片，由于有规律，所以可以循环预加载
		for(var i=0; i<imagesCount; i++)
		{
			imageCaches[i] = new Image();
			imageCaches[i].src = "./img/1/"+i+".gif";
			
			imageCaches[i+imagesCount] = new Image();
			imageCaches[i+imagesCount].src = "./img/1/"+i+"_over.gif";	
		}
	},
	
	// 初始化所有格子中的动物
	_initAnimalBlocks: function(gameLevel)
	{
		// 使用过的Animal，记录使用次数（每样使用次数都不得超过三次）
		var usedAnimalIds = {};
		
		//Logger.log('start _initAnimalBlocks');
		var halfCellCount = this.m_cellCount / 2;
		for(var i=0; i<halfCellCount; i++)
		{
			// 从 1...this.m_animalCount 中随机一个数字
			// 注意，游戏级别越高，选取的图片种类就越多
			var maxAnimalCount = Math.floor((this.m_animalCount + 1) * (gameLevel / GameLevel.Expert));
			var randomId = -1;
			
			// 保证同一样动物最多出现三对
			do
			{
				randomId = $random(1, maxAnimalCount-1);
			}
			while(this._isAnimalIdMoreThan3(usedAnimalIds, randomId));
			
			this.g_insertMatrixRandomNullCell(randomId);
			this.g_insertMatrixRandomNullCell(randomId);
		}
		//Logger.log('end _initAnimalBlocks');
	},
	
	// 判断randomId是否使用次数超过三次，是则返回true，
	// 否则加入usedAnimalIds并返回false
	_isAnimalIdMoreThan3: function(usedAnimalIds, randomId)
	{
		var count = usedAnimalIds[randomId];
		if(!$defined(count))
		{
			usedAnimalIds[randomId] = 1;
			return false;
		}
		else
		{
			if(count >= 3)
			{
				return true;
			}
			else
			{
				usedAnimalIds[randomId] += 1;
				return false;
			}
		}
	},
	
	// 初始化游戏面板
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
				//reval.append('&nbsp;');
				reval.append('<img class="bottom" src="./img/1/0.gif" />');
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
	
	// 显示游戏面板的内容
	_renderGamePanel: function()
	{	
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				this.g_getCellNode(i, j).innerHTML = '<img class="bottom" src="./img/1/'+ this.m_matrix[i][j] +'.gif" />';
			}
		}
	},
	
	// 点击洗牌按钮
	_onXipaiClick: function(e)
	{
		e.stop();
		$('xipai').blur();
		
		//alert(this.g_getGameStatus());
		// 当游戏处于停止或暂停状态，点击洗牌不响应
		if(this.g_getGameStatus() == GameStatus.Stop 
			|| this.g_getGameStatus() == GameStatus.Pause)
		{
			return;
		}
		
		this._xipai();
	},
	
	// 执行一次洗牌操作
	_xipai: function()
	{
		this.m_xipaiCount++;
		$('xipaiCount').innerHTML = this.m_xipaiCount + '次';
		
		this._xipaiMatrix();
		this._renderGamePanel();
	},
	
	// 洗牌，重新分配 m_matrix 
	_xipaiMatrix: function()
	{
		// 将m_matrix导入到数组tempArray中，并清空m_matrix
		var tempArray = [];
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				tempArray.push(this.m_matrix[i][j]);
				this.m_matrix[i][j] = null;
			}
		}
		// 将tempArray中的值随机的添加到m_matrix中
		for(var i=0; i<tempArray.length; i++)
		{
			this.g_insertMatrixRandomNullCell(tempArray[i]);
		}
	},
	
	// 点击表格
	_onGameTableClick: function(evt)
	{
		var target = $(evt.target);
		// 首先判断是单元格，而不是边框
		if(target.getTag() === 'img')
		{
			// 点击即开始游戏
			if(this.g_getGameStatus() != GameStatus.Start)
			{
				this.g_startGame();
				return;
			}
			
			target = target.parentNode;
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			// 如果点击空图标，不做任何反应
			if(this.m_matrix[row][column] == 0)
			{
				if(this.m_firstAnimalPosition)
				{
					this._setFirstAnimalNotSelected();
				}
				return;
			}
			
			// 如果还没有设置第一个需要比对的Animal
			// 注意，这里有个BUG，不能用 this.m_firstAnimalPosition[0] 判断是否存在，因为 0 也为false
			if(!this.m_firstAnimalPosition)
			{
				this._setFirstAnimalSelected(row, column);
			}
			else
			{
				// 如果再次选中 this.m_firstAnimalPosition，则表示取消选中
				if(this.m_firstAnimalPosition[0] == row && this.m_firstAnimalPosition[1] == column)
				{
					this._setFirstAnimalNotSelected();
				}
				else
				{
					// 如果选中第二个Animal，先选中然后处理
					this._setSecondAnimalSelected(row, column);
					
					// 处理选中第二个Animal的行为，延时提醒
					//this._processSelectSecondAnimal();
					//window.setTimeout(this._processSelectSecondAnimal.bind(this), 100);
					//this._processSelectSecondAnimal(row, column);	
					this._processSelectSecondAnimal.delay(100, this);
				}
			}
		}
	},
	
	// 选中第二个Animal
	_processSelectSecondAnimal: function()
	{
		var firstRow = this.m_firstAnimalPosition[0];
		var firstColumn = this.m_firstAnimalPosition[1];
		var secondRow = this.m_secondAnimalPosition[0];
		var secondColumn = this.m_secondAnimalPosition[1];
		
		Logger.log('start find path from ['+ firstRow + 
			',' + firstColumn + '] to [' + secondRow + ',' + secondColumn +']');
		
		var isPathFind = false;
		
		// 如果第二个Animal和第一个选中的Animal不一样，则明显不匹配，直接取消第一个选中，选中第二个
		if(this.m_matrix[firstRow][firstColumn] != this.m_matrix[secondRow][secondColumn])
		{
			this._setFirstAnimalNotSelected();
			this._setSecondAnimalNotSelected();
			
			//this._setFirstAnimalSelected(secondRow, secondColumn);
		}
		else
		{
			// 两个单元格选中的Animal相同，现在查找是否有通路
			if(this._checkPathBetweenTwoAnimal())
			{
				this._setFirstAnimalClear();
				this._setSecondAnimalClear();	
				isPathFind = true;
				
				this.m_leftAnimalCount -= 2;
				$('leftCount').innerHTML = this.m_leftAnimalCount / 2 + "对";
				
				if(this.m_leftAnimalCount <= 0)
				{
					// 本局游戏结束
					this.g_pauseGame();
					alert('恭喜，您赢了！');
					this.g_stopGame();
				}
			}
			else
			{
				this._setFirstAnimalNotSelected();
				this._setSecondAnimalNotSelected();
			}
		}
		
		Logger.log('end path finded, isPathFind:'+isPathFind);
	},
	
	// 检查两个Animal之间是否有通路
	_checkPathBetweenTwoAnimal: function()
	{
		return this._checkAnimalPath(
			this.m_firstAnimalPosition,
			this.m_secondAnimalPosition
		);
	},
	
	// 检查到第一个节点是否有路径，
	// 如果指定 secondPosition ，返回bool
	// 如果不指定  secondPosition ， 返回找到的第一个匹配的节点，否则返回null
	_checkAnimalPath: function(firstPosition, secondPosition)
	{
		// 需要扩展的节点列表
		var queue = new CQueue();
		// 已经遍历过的节点列表，每个节点保存 row column turnCount baseRow baseColumn
		// 其中turnCount是此节点已经折的次数，baseRow/baseColumn是和本节点row或column相同的第一个父节点
		// 每个处理过的节点都会保存在此列表中，turnCount=-1 表示此位置不通过
		var usedNodeList = [];
		
		var firstNode = {};
		firstNode['row'] = firstPosition[0];
		firstNode['column'] = firstPosition[1];
		firstNode['turnCount'] = 0;
		firstNode['baseRow'] = firstNode['row'];
		firstNode['baseColumn'] = firstNode['column'];
		
		queue.enqueue(firstNode);
		usedNodeList.push(firstNode);
		
		while(queue.getLength() != 0)
		{
			// 从队列中取节点(parentNode)
			var parNode = queue.dequeue();
			
			Outer:
			// 当前节点的上下左右四个方向
			for(var i=0; i<4; i++)
			{
				var row = parNode['row'];
				var column = parNode['column'];
				// 上下左右四种情况
				if(i == 0)	row -= 1;
				else if(i == 1) row += 1;
				else if(i == 2) column -= 1;
				else if(i == 3) column += 1;
				
				// 当前节点(currentNode)
				var curNode = {};
				curNode['row'] = row;
				curNode['column'] = column;
				curNode['turnCount'] = parNode['turnCount'];
				curNode['baseRow'] = parNode['baseRow'];
				curNode['baseColumn'] = parNode['baseColumn'];
				
				// 1.如果此节点在矩阵外两层或两层以外，则舍弃
				if(row <= -2 || row >= (this.m_matrix.length + 1) 
					|| column <= -2 || column >= (this.m_matrix[0].length + 1))
				{
					continue;
				}
				
				// 2.如果本节点弯折大于等于3次，则舍弃
				if(row == parNode['baseRow'] || column == parNode['baseColumn'])
				{
					// 本节点和parNode在一条直线上
				}
				else
				{
					curNode['turnCount'] += 1;
					curNode['baseRow'] = parNode['row'];
					curNode['baseColumn'] = parNode['column'];
				}
				
				if(curNode['turnCount'] >= 3)
				{
					continue;
				}
				
				// 3.如果本节点已经在usedNodeList，则舍弃
				for(var j=0; j<usedNodeList.length; j++)
				{
					var currentUsedNode = usedNodeList[j];
					if(currentUsedNode['row'] == row && currentUsedNode['column'] == column)
					{
						// 如果本次Path的此节点的转折数较小，则更新此节点数据，并重新加入队列中
						// 如果队列中存在此节点，则更新就行了
						// 注意：这个地方的BUG，当覆盖turnCount时，也要把baseRow，baseColumn也覆盖
						if(curNode['turnCount'] < currentUsedNode['turnCount'])
						{
							currentUsedNode['turnCount'] = curNode['turnCount'];
							currentUsedNode['baseRow'] = curNode['baseRow'];
							currentUsedNode['baseColumn'] = curNode['baseColumn'];
							
							/*
							var isQueueUpdate = false;
							for(var k=queue.m_startIndex; k<queue.m_endIndex; k++)
							{
								var currentValue = queue.m_buffer[k];
								if(currentValue['row'] == row && currentValue['column'] == column)
								{
									currentValue['turnCount'] = curNode['turnCount'];
									currentValue['baseRow'] = curNode['baseRow'];
									currentValue['baseColumn'] = curNode['baseColumn'];
									isQueueUpdate = true;
									break;
								}
							}
							if(!isQueueUpdate)
							{
								queue.enqueue(currentUsedNode);
							}
							*/
								
							queue.enqueue(currentUsedNode);
							continue Outer;
						}
						else if(curNode['turnCount'] == currentUsedNode['turnCount'])
						{
							// 如果当前节点的baseRow/baseColumn 和 usedList中的相同，则当前节点没必要扩展
							if(curNode['baseRow'] == currentUsedNode['baseRow']
								&& curNode['baseColumn'] == currentUsedNode['baseColumn'])
							{
								continue Outer;
							}
							else
							{
								// 虽然本节点转折数相同，但是可能下一节点转折数就不同了
								continue;
							}
						}
						else
						{
							continue Outer;
						}
					}
				}
				
				// 4.如果此节点在矩阵外一层
				if(row <= -1 || row >= this.m_matrix.length
					|| column <= -1 || column >= this.m_matrix[0].length)
				{
					queue.enqueue(curNode);
					usedNodeList.push(curNode);
					continue;
				}
				
				// 5.如果此处有图片（0为空图片）
				if(this.m_matrix[row][column] != 0)
				{
					// 此处的图片和firstPosition图片相同
					if(this.m_matrix[row][column] == this.m_matrix[firstPosition[0]][firstPosition[1]])
					{
						// 指定需要精确匹配的位置
						if(secondPosition)
						{
							// 找到精确匹配的位置
							if(secondPosition[0] == row && secondPosition[1] == column)
							{
								return true;
							}
							else
							{
								// 没有找到精确匹配的位置，此位置不通过
								curNode['turnCount'] = -1;
								continue;
							}
						}
						else
						{
							return curNode;
						}
					}
					else
					{
						// 此处不通，并且不是目的图片，不加入队列
						curNode['turnCount'] = -1;
						continue;	
					}
				}
				else
				{
					// 此处没有图片，添加到队列和usedNodeList
					queue.enqueue(curNode);
					usedNodeList.push(curNode);
				}
				
			}
		}
		
	},
	
	// 设置单元格中的图片为选中状态（第二个Animal）
	_setSecondAnimalSelected: function(row, column)
	{
		this.m_secondAnimalPosition = [];
		
		this.m_secondAnimalPosition[0] = row;
		this.m_secondAnimalPosition[1] = column;
			
		var animalId = this.m_matrix[row][column];
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/' + animalId + '_over.gif';
	},
	
	// 设置单元格中的图片为不选中状态（第二个Animal）
	_setSecondAnimalNotSelected: function()
	{
		var row = this.m_secondAnimalPosition[0];
		var column = this.m_secondAnimalPosition[1];
		var animalId = this.m_matrix[row][column];
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/' + animalId + '.gif';
	
		this.m_secondAnimalPosition = null;
	},
	
	// 清空单元格中的图片（第二个Animal）
	_setSecondAnimalClear: function()
	{
		var row = this.m_secondAnimalPosition[0];
		var column = this.m_secondAnimalPosition[1];
		
		this.m_matrix[row][column] = 0;
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/0.gif';
		
		this.m_secondAnimalPosition = null;
	},
	
	// 设置单元格中的图片为选中状态（第一个Animal）
	_setFirstAnimalSelected: function(row, column)
	{
		this.m_firstAnimalPosition = [];
		
		this.m_firstAnimalPosition[0] = row;
		this.m_firstAnimalPosition[1] = column;
			
		var animalId = this.m_matrix[row][column];
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/' + animalId + '_over.gif';
	},
	
	// 设置单元格中的图片为不选中状态（第一个Animal）
	_setFirstAnimalNotSelected: function()
	{
		var row = this.m_firstAnimalPosition[0];
		var column = this.m_firstAnimalPosition[1];
		var animalId = this.m_matrix[row][column];
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/' + animalId + '.gif';
	
		this.m_firstAnimalPosition = null;
	},
	
	// 清空单元格中的图片（第一个Animal）
	_setFirstAnimalClear: function()
	{
		var row = this.m_firstAnimalPosition[0];
		var column = this.m_firstAnimalPosition[1];
		
		this.m_matrix[row][column] = 0;
		
		this.g_getCellNode(row, column).firstChild.src = './img/1/0.gif';
		
		this.m_firstAnimalPosition = null;
	},
	
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CLLK();