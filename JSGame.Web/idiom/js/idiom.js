
/**
 * 成语连线
 * 
 * @author      sanshi.ustc
 * @email       sanshi.ustc@gmail.com
 * @minigame    http://code.google.com/p/minigame/
 * @homepage    http://sanshi.cnblogs.com/         
 */
var CIdiom = CGame.extend({
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
		// 找到
		this.m_findCount = 0;
		// 剩余
		this.m_leftCount = 0;
		////////////////////////////////////////////////////////////
		// 存放本局成语答案[{"index":1,"value":"哀兵必胜","path":[[0,0],[0,1],[0,2],[0,3]]},{},{}]
		this.m_idioms = [];
		// 选中的格子列表
		this.m_selectCells = [];
		
		// 提示的次数
		this.m_tishiCount = 0;
		
		this._initGameLevel();
		
		// 点击提示按钮	
		$('tishi').addEvent('click', this._onTishiClick.bindWithEvent(this));
	},
	
	// [required]两个参数:当前游戏状态、上次游戏状态（GameStatus）
	_resetGameStatus: function(gameStatus, lastGameStatus)
	{
		if(gameStatus == GameStatus.Stop)
		{
			// 终止游戏
			$('findCount').innerHTML = "-";
			$('leftCount').innerHTML = "-";
			$('tishiCount').innerHTML = "-";
			//$('tishi').disabled = true;
			$('tishi').addClass('disabled');
			
			this._initGameLevel();
		}
		else if(gameStatus == GameStatus.Start) 
		{
			// 启动游戏
			if(lastGameStatus != GameStatus.Pause)
			{
				this._renderGamePanel();
				
				$('findCount').innerHTML = "0个";
				$('leftCount').innerHTML =  this.m_leftCount + "个";
				$('tishiCount').innerHTML = this.m_tishiCount + "次";
				
				//$('tishi').disabled = false;
				$('tishi').removeClass('disabled');
			}
			else
			{
				// 继续游戏
				//$('tishi').disabled = false;
				$('tishi').removeClass('disabled');
			}
		}
		else if(gameStatus == GameStatus.Pause)
		{
			// 暂停游戏
			//$('tishi').disabled = true;
			$('tishi').addClass('disabled');
		}
	},
	
	// [required]一个参数：定时器调用间隔
	_onTimeInterval: function(intervalMilliseconds)
	{
		
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
				this.m_rowCount = 5;
				this.m_columnCount = 5;
				break;
			case GameLevel.Easy:
				this.m_rowCount = 6;
				this.m_columnCount = 6;
				break;	
			case GameLevel.Middle:
				this.m_rowCount = 7;
				this.m_columnCount = 7;
				break;	
			case GameLevel.Hard:
				this.m_rowCount = 8;
				this.m_columnCount = 8;
				break;	
			case GameLevel.Expert:
				this.m_rowCount = 9;
				this.m_columnCount = 9;
				break;	
		}
		// 单元格总个数
		this.m_cellCount = this.m_rowCount * this.m_columnCount;
		// 次数
		this.m_findCount = 0;
		this.m_idioms = [];
		this.m_tishiCount = 0;
		
		this._initIdioms();
		this._initOtherWords();
		
		this._initGamePanel();
	},
	
	// 初始化本局成语列表，并填充到矩阵中
	_initIdioms: function()
	{
		this.g_initMatrix();
		
		var maxIdiomCount = Math.floor(this.m_cellCount / 4);
		
		// 当前成语个数为[最大数*0.4,最大数*0.7)，对于6*6的矩阵，成语数可能为3、4、5
		var currentIdiomCount = $random(Math.floor(maxIdiomCount * 0.4), Math.floor(maxIdiomCount * 0.6)-1);
		
		this.m_leftCount = currentIdiomCount;
		//$('leftCount').innerHTML =  this.m_leftCount + "个";
		
		for(var i=0; i<currentIdiomCount; i++)
		{
			var idiomObj = {};
			idiomObj["index"] = $random(0, IdiomJson.length-1);
			idiomObj["value"] = IdiomJson[idiomObj["index"]];
			idiomObj["path"] = [];
			
			// 在矩阵中随机定位第一个字符的位置
			var position0 = this.g_getMatrixRandomNullCell();
			//idiomObj["position"][0] = position0;
			//var position1 = this._placeNearPosition(position0);
			// 下面要找出从此位置出发所有可用的路径（最大长度是四）
			var paths = this._findAllUsablePath(position0);
			
			////////////////////////////////////////////////////////////////////////////////
			/*
			var currentPath = [];
			for(j=0; j<paths.length; j++)
			{
				currentPath = paths[j];
				if(!this._conflictWithOtherPath(currentPath))
				{
					isPathFind = true;
					break;
				}
			}
			*/
			// 从这些所有可用路径中任意选取一个路径
			if(paths.length == 0)
			{
				// 以此点开始没有一条可用路径，则重新找
				i--;
				continue;
			}
			else
			{
				var currentPath = paths[$random(0, paths.length-1)];
				idiomObj["path"] = currentPath;
				this.m_idioms.push(idiomObj);
				
				var value = idiomObj["value"];
				// 填充本条路径
				for(var k=0; k<currentPath.length; k++)
				{
					this.m_matrix[currentPath[k][0]][currentPath[k][1]] = value.charAt(k);
				}
			}
					
		}
	},
	
	// 从position0出发的所有可用的路径（4格）
	_findAllUsablePath: function(position0)
	{
		var paths = [];
		////////////////////////////////////////////////////////////////////////////////
		var queue = new CQueue();
		queue.enqueue({"position":position0, "path":[]});
		while(queue.getLength() != 0)
		{
			var curObj = queue.dequeue();
			
			// 这样不行，在循环中由于引用以前的数据导致出错
			//var path = curObj["path"];
			//path.push(curObj["position"]);
			// 必须创建一个新数组
			//var path = Util.cloneArray(curObj["path"]);
			var path = curObj["path"].copy();
			path[curObj["path"].length] = curObj["position"];
			
			if(path.length == 4)
			{
				paths.push(path);
			}
			else
			{
				var row = curObj["position"][0];
				var column = curObj["position"][1];
				// 添加上下左右四个方向
				if(this._testRowColumnUsable(row + 1, column, path))
				{
					queue.enqueue({"position":[row + 1, column], "path": path});
				}
				if(this._testRowColumnUsable(row - 1, column, path))
				{
					queue.enqueue({"position":[row - 1, column], "path": path});
				}
				if(this._testRowColumnUsable(row, column + 1, path))
				{
					queue.enqueue({"position":[row, column + 1], "path": path});
				}
				if(this._testRowColumnUsable(row, column - 1, path))
				{
					queue.enqueue({"position":[row, column - 1], "path": path});
				}
			}
		}
		////////////////////////////////////////////////////////////////////////////////
		return paths;
	},
	
	/*
	// 测试path是否和this.m_idioms中其他成语的路径冲突
	_conflictWithOtherPath: function(path)
	{
		for(var i=0; i<this.m_idioms.length; i++)
		{
			var tmpPath = this.m_idioms[i]["path"];
			for(var j=0; j<tmpPath.length; j++)
			{
				for(var k=0; k<path.length; k++)
				{
					if(tmpPath[j] == path[k])
					{
						return true;
					}
				}
			}
		}
		return false;
	},
	*/
	
	// 如果不存在或者已经被占据或者存在path中，返回false，否则返回true
	_testRowColumnUsable: function(row, column, path)
	{
		// 越界
		if(this.g_testPositionOut(row, column))
		{
			return false;
		}
		// 本点已经被占据
		if(this.m_matrix[row][column])
		{
			return false;
		}
		//本点已经存在路径当中
		for(var i=0; i<path.length; i++)
		{
			if(path[i][0] == row && path[i][1] == column)
			{
				return false;
			}
		}
		
		return true;
	},

	// 初始化除成语外的其他词
	_initOtherWords: function()
	{
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				if(!this.m_matrix[i][j])
				{
					this.m_matrix[i][j] = this._getRandomWord();
				}
			}
		}
	},
	
	// 随机取得一个词（这个词必须是this.m_matrix中不存在的）
	_getRandomWord: function()
	{
		var word = "";
		do
		{
			var idiomStr = IdiomJson[$random(0, IdiomJson.length-1)];
			word = idiomStr.charAt($random(0, 3));
		}
		while(this.g_testValueExist(word))
		
		return word;
	},
	
	// 初始化MainTable
	_initGamePanel: function()
	{
		var reval = new CStringBuilder();
		reval.append('<table id="gameTable" cellspacing="0" cellpadding="0" border="0">');
		for(var i=0; i<this.m_rowCount; i++)
		{
			reval.append('<tr>');
			for(var j=0; j<this.m_columnCount; j++)
			{
				reval.append('<td id="'+ this.g_getCellId(i, j) +'">');
				//reval.append(this.m_matrix[i][j]);
				reval.append("&nbsp;");
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
	
	// 显示游戏面板中的字
	_renderGamePanel: function()
	{
		for(var i=0; i<this.m_rowCount; i++)
		{
			for(var j=0; j<this.m_columnCount; j++)
			{
				this.g_getCellNode(i, j).innerHTML = this.m_matrix[i][j];
			}
		}
	},
	
	
	
	// 点击提示按钮 
	_onTishiClick: function(e)
	{
		e.stop();
		$('tishi').blur();
		
		// 当游戏处于停止或暂停状态，点击洗牌不响应
		if(this.g_getGameStatus() == GameStatus.Stop 
			|| this.g_getGameStatus() == GameStatus.Pause)
		{
			return;
		}
		
		this._tishi();
	},
	
	// 提示
	_tishi: function()
	{
		this.m_tishiCount++;
		$('tishiCount').innerHTML = this.m_tishiCount + "次";
		
		// 首先清空选中的格子
		this._notSelectAllCells();
		
		// 从m_idioms找还没有被点中的格子，激活它
		for(var i=0; i<this.m_idioms.length; i++)
		{
			var rowColumn = this.m_idioms[i]['path'][0];
			var row = rowColumn[0];
			var column = rowColumn[1];
			
			var node = this.g_getCellNode(row, column);
			if(!node.hasClass("fixed"))
			{
				node.addClass("active");
				this.m_selectCells.push([row, column]);
				break;
			}
		}
	},
	
	// 点击GameTable中的一个单元格
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
			
			var rowColumn = this.g_getRowColumnByCellId(target.id);
			
			// 取得当前点击的单元格的row/column
			var row = rowColumn[0];
			var column = rowColumn[1];

			this._processSelectCell(row, column);
			
		}
		
	},
	
	// 处理格子的选中状态
	_processSelectCell: function(row, column)
	{
		// 已经选中的格子
		if(this._isRowColumnSelected(row, column))
		{
			return;
		}
		// 已经fixed的格子
		if(this.g_getCellNode(row, column).hasClass("fixed"))
		{
			return;
		}
		// 不是临近的格子，则取消所有已经选中的格子
		if(!this._isRowColumnNearLastSelected(row, column))
		{
			this._notSelectAllCells();
			return;
		}
		
		// 选中格子
		this.g_getCellNode(row, column).addClass("active");
		this.m_selectCells.push([row, column]);
		
		// 检查是否成语
		if(this.m_selectCells.length == 4)
		{
			// 判断选中的四个格子是不是成语
			//window.setTimeout(this._processSelectFourCell.bind(this), 100);
			this._processSelectFourCell.delay(100, this);
		}
	},
	
	// 判断选中的四个格子是不是成语
	_processSelectFourCell: function()
	{
		if(this.m_selectCells.length != 4)
		{
			return;
		}
		
		if(this._isSelectCellIdiom())
		{
			this._fixAllCells();
			
			this.m_findCount++;
			this.m_leftCount--;
			$('findCount').innerHTML = this.m_findCount + "个";
			$('leftCount').innerHTML = this.m_leftCount + "个";
			
			if(this.m_leftCount == 0)
			{
				this.g_pauseGame();
				alert('恭喜，您赢了！');
				this.g_stopGame();
			}
		}
		else
		{
			this._notSelectAllCells();
		}
	},
	
	// 测试选中的是否成语
	_isSelectCellIdiom: function()
	{
		for(var i=0; i<this.m_idioms.length; i++)
		{
			var path = this.m_idioms[i]["path"];
			if(this.m_selectCells[0][0] == path[0][0] 
				&& this.m_selectCells[0][1] == path[0][1]
				&& this.m_selectCells[1][0] == path[1][0]
				&& this.m_selectCells[1][1] == path[1][1]
				&& this.m_selectCells[2][0] == path[2][0]
				&& this.m_selectCells[2][1] == path[2][1]
				&& this.m_selectCells[3][0] == path[3][0]
				&& this.m_selectCells[3][1] == path[3][1])
			{
				return true;
			}
		}
		return false;
	},
	
	// [row, column]是否临近上次选中的格子
	_isRowColumnNearLastSelected: function(row, column)
	{
		var length0 = this.m_selectCells.length;
		if(length0 == 0)
		{
			return true;
		}
		
		var lastRow = this.m_selectCells[length0 - 1][0];
		var lastColumn = this.m_selectCells[length0 - 1][1];
		
		if((lastRow+1 == row && lastColumn == column)
			|| (lastRow-1 == row && lastColumn == column)
			|| (lastRow == row && lastColumn+1 == column)
			|| (lastRow == row && lastColumn-1 == column))
		{
			return true;
		}
		return false;
	},
	
	// [row, column]是否已经选中
	_isRowColumnSelected: function(row, column)
	{
		for(var i=0; i<this.m_selectCells.length; i++)
		{
			if(this.m_selectCells[i][0] == row 
				&& this.m_selectCells[i][1] == column)
			{
				return true;	
			}
		}
		return false;
	},
	
	// 取消所有选中的格子
	_notSelectAllCells: function()
	{
		for(var i=0; i<this.m_selectCells.length; i++)
		{
			this.g_getCellNode(this.m_selectCells[i][0], this.m_selectCells[i][1]).removeClass("active");
		}
		this.m_selectCells = [];
	},
	
	// 选中所有格子为成语
	_fixAllCells: function()
	{
		for(var i=0; i<this.m_selectCells.length; i++)
		{
			var node = this.g_getCellNode(this.m_selectCells[i][0], this.m_selectCells[i][1]);
			node.removeClass("active");
			node.addClass("fixed");
			
			if(i != this.m_selectCells.length -1 )
			{
			    // 将两个单元格中间的边框变为白色
			    this._resetBorderBetweenTwoCellNode(this.m_selectCells[i], this.m_selectCells[i+1]);
		    }
		}
		this.m_selectCells = [];
	},
	
	// 将两个单元格中间的边框变为白色
    _resetBorderBetweenTwoCellNode: function(node1YX, node2YX)
    {
        var node1 = this.g_getCellNode(node1YX[0], node1YX[1]);
        var node2 = this.g_getCellNode(node2YX[0], node2YX[1]);
        if(node1YX[0] == node2YX[0])
        {
            // 两个节点在同一行
            if(node2YX[1] > node1YX[1])
            {
                // node2在node1节点的右侧
                node1.addClass('brr');
                node2.addClass('blr');
            }
            else
            {
                // node2在node1节点的左侧
                node1.addClass('blr');
                node2.addClass('brr');
            } 
        }
        else
        {
            // 两个节点在同一列
            if(node2YX[0] > node1YX[0])
            {
                // node2在node1节点的下侧
                node1.addClass('bbr');
                node2.addClass('btr');
            }
            else
            {
                // node2在node1节点的上侧
                node1.addClass('btr');
                node2.addClass('bbr');
            } 
        }
    },
	
	// 空函数
	empty: function()
	{
		;
	}
});

new CIdiom();