
var CMain = new Class({
    // 构造函数
    initialize: function()
    {
        window.addEvent('domready', this._onDomready.bind(this));
    },
    
    _onDomready: function()
    {
        // 点击在线游戏
//        $('aOnlineGame').addEvent('click', this._onOnlineGameClick.bindWithEvent(this));
        
        // 初始化提示框
        //this._initTooltips();
        
        /*
        // notice特效
        var fx = new Fx.Style("noticeColumn", "opacity", {duration:500});
        fx.start(1, 0.2).chain(function(){
            fx.start(0.2, 1);
        });
        
        // 关闭notice（注意，有传递fx进入）
        $("closeNoticeColumn").addEvent("click", this._onCloseNoticeColumn.bindWithEvent(this, fx));
        */
    },
    
    // 点击在线游戏
    _onOnlineGameClick: function(evt)
    {
        evt.stop();
    	
        // 随机导航到一个游戏
        window.location.href = $('ulGameList').getChildren().getRandom().getChildren()[0].href;
    },
	
    /*
    // 初始化提示框
    _initTooltips: function()
    {
         
        var tooltip = new Tips($$('.tooltip'),{
            initialize:function(){
                this.fx = new Fx.Style(this.toolTip, 'opacity', {duration: 500, wait: false}).set(0);
            },
            onShow: function(toolTip) {
                this.fx.start(1);
            },
            onHide: function(toolTip) {
                this.fx.start(0);
            }
        });
    },
   
    // 关闭notice
    _onCloseNoticeColumn: function(evt, fx)
    {
        evt.stop();
        
        // 可以这样修改fx的options参数
        $extend(fx.options, {duration:1000});
        // 先隐藏再折叠
        fx.start(1, 0).chain(function(){
            new Fx.Slide("noticeColumn", {duration:1000, mode:'vertical'}).slideOut();
        });
    },*/
    
    _empty: function(ele)
    {
        
    }
});

new CMain();
