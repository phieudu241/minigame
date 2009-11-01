

var CGame = new Class({
	// 构造函数
	initialize: function() 
	{
		// private,游戏状态（1：游戏终止 2：游戏进行中 3：游戏暂停 ）
		this.m_gameStatus = 1;
		// private,游戏的上一个状态
		this.m_lastGameStatus = 0;
		// 毫秒定时器
		this.m_interval = null;
		// 定时器调用间隔（毫秒）
		this.m_intervalMilliseconds = 100;
		// 逝去的时间（毫秒）
		this.m_elapsedMilliseconds = 0;
		// 单元格前缀
		this.m_cellPrefix = 'gameCell_';
		// 二维矩阵
		this.m_matrix = [];
		// 缓存的图片(在每个游戏中填充)
		this.m_imageCaches = [];
		
		window.addEvent('domready', this.g_onWindowLoad.bind(this));
	},
	
	//////页面事件处理///////////////////////////////////////////////////////////
	// 载入全部网页资源后执行
	g_onWindowLoad: function() 
	{	
		$('start').addEvent('click', this.g_onStartClick.bindWithEvent(this));
		$('stop').addEvent('click', this.g_onStopClick.bindWithEvent(this));
		$('pause').addEvent('click', this.g_onPauseClick.bindWithEvent(this));
		$('level').addEvent('change', this.g_onLevelChange.bindWithEvent(this));
		// 鼠标右键
		document.addEvent('contextmenu', this.g_onDocumentContextmenu.bindWithEvent(this));
		// 键盘
		document.addEvent('keydown', this.g_onDocumentKeydown.bindWithEvent(this));
		
		// 点击在线游戏
		/*
		if($defined($('aOnlineGame')))
		{
			$('aOnlineGame').addEvent('click', this._onOnlineGameClick.bindWithEvent(this));
		}
       
        // 初始化提示框
        this._initTooltips();
		*/ 
		this._onWindowLoad();
	}
	
});

// [枚举]游戏的状态
var GameStatus = {Stop:1, Start:2, Pause:3};
// [枚举]游戏级别
var GameLevel = {Hello:1, Easy:2, Middle:3, Hard:4, Expert:5};
// [枚举]方向(使用键盘的上下左右的值)
var Direction =  {Left:1, Up:2, Right:3, Down:4};
// [枚举]按键值
//var KeyCode =  {Left:37, Up:38, Right:39, Down:40, Enter:13, Space:32, Esc:27, Q:81, W:87, A:65, S:83};
