﻿var óãæ=new Class({initialize:function(){this.ï=[];this.êá=0;this.æá=0;},âàÇ:function(Ý){if(!$defined(Ý)){return;}this.ï[this.æá]=Ý;this.æá++;},Ù:function(){if(this.êá==this.æá){return null;}var ÔÞ=this.ï[this.êá];this.ï[this.êá]=null;this.êá++;return ÔÞ;},clear:function(){this.ÐÝë=[];this.êá=0;this.æá=0;},ËÝó:function(){if(this.êá==this.æá){return null;}return this.ï[this.êá];},Ç:function(){return this.æá-this.êá;},contains:function(ÃÛ){for(var i=this.êá;i<this.æá;i++){if(this.ï[i]==ÃÛ){return true;}}return false;},empty:function(){}});var µÛ=new Class({initialize:function(ýÚÔ){this.ÐÝë=[];this.ù=0;if(ýÚÔ!=null){this.ô(ýÚÔ);}},ô:function(ïØ){if(ïØ==null){return;}this.ù+=ïØ.length;this.ÐÝë.push(ïØ)},clear:function(){this.ÐÝë=[];this.ù=0;},length:function(){return this.ù;},toString:function(){return this.ÐÝë.join("");},empty:function(){;}});var ëØù=new(new Class({initialize:function(){this.çÖº=new Date();this.log("start.");},log:function(ã){var ÞÕ=new Date();var ÚÔ=(ÞÕ-this.çÖº)/1000;this.çÖº=ÞÕ;if(window.console&&console.log){console.log(ÚÔ+"\t"+ã);}else{}}}))();var ÕÓã=new Class({initialize:function(){this.Ð=1;this.àµÀ=0;this.Ü=null;this.Ø=100;this.Òÿ=0;this.Îÿä='gameCell_';this.Êþí=[];this.Æ=[];window.addEvent('domready',this.Áý.bind(this));},Áý:function(){$('start').addEvent('click',this.ªü.bindWithEvent(this));$('stop').addEvent('click',this.üûÎ.bindWithEvent(this));$('pause').addEvent('click',this.ö.bindWithEvent(this));$('level').addEvent('change',this.ò.bindWithEvent(this));document.addEvent('contextmenu',this.îù.bindWithEvent(this));document.addEvent('keydown',this.êùò.bindWithEvent(this));this.åøü();},êùò:function(á){á.stop();switch(á.key){case'enter':if(this.Ýö()!=Ùõ.ÓõÝ){this.Ï();}else{this.Ë();}break;case'esc':this.Æó();break;}this.Âòµ(á.key);},îù:function(á){á.stop();if(this.Ýö()==Ùõ.ÓõÝ){this.µ(á);}},ý:function(status){this.àµÀ=this.Ð;this.Ð=status;},Ýö:function(){return this.Ð;},ªü:function(øð){øð.stop();$('start').blur();if(this.Ð==Ùõ.ÓõÝ||this.Ð==Ùõ.óïâ){return;}this.Ï();},Ï:function(){if(this.Ð!=Ùõ.ÓõÝ){this.ý(Ùõ.ÓõÝ);this.ïïê();}},üûÎ:function(øð){øð.stop();$('stop').blur();this.Æó();},Æó:function(){if(this.Ð==Ùõ.ê){return;}if(this.Ð!=Ùõ.ê){this.ý(Ùõ.ê);this.ïïê();}},ö:function(øð){øð.stop();$('pause').blur();if(this.Ð==Ùõ.ê){return;}if(this.Ð==Ùõ.óïâ){this.Ï();}else if(this.Ð==Ùõ.ÓõÝ){this.Ë();}},Ë:function(){if(this.Ð!=Ùõ.óïâ){this.ý(Ùõ.óïâ);this.ïïê();}},ò:function(){$('level').blur();this.æí($('level').value.toInt());},ïïê:function(){if(this.Ð==Ùõ.ê){this.âí();this.ÞìË();$('start').removeClass('disabled');$('start').addClass('positive');$('pause').addClass('disabled');$('stop').removeClass('negative');$('stop').addClass('disabled');this.Ô();this.Ðê('-');}else if(this.Ð==Ùõ.ÓõÝ){this.Ëéï();this.Çéù();$('start').removeClass('positive');$('start').addClass('disabled');$('pause').removeClass('disabled');$('stop').removeClass('disabled');$('stop').addClass('negative');if(this.àµÀ==Ùõ.óïâ){$('pause').innerHTML="暂停游戏";}else{this.Ðê(0);}this.Ã();}else if(this.Ð==Ùõ.óïâ){this.Ëéï();this.Çéù();$('start').removeClass('positive');$('start').addClass('disabled');$('pause').removeClass('disabled');if(this.àµÀ==Ùõ.ÓõÝ){$('pause').innerHTML="继续游戏";}this.ºç();}this.ýç(this.Ð,this.àµÀ);},Ã:function(){this.Ü=this.ùæÚ.periodical(this.Ø,this);},Ô:function(){this.Òÿ=0;$clear(this.Ü);},ºç:function(){$clear(this.Ü);},ùæÚ:function(){this.Òÿ+=this.Ø;if(this.Òÿ%1000==0){this.Ðê(this.Òÿ/1000);}this.ð(this.Ø);},Ðê:function(ëä){$('elapsedTime').innerHTML=this.çãþ(ëä);},çãþ:function(Ì){if(Ì=='-'){return'-';}if(Ì==0){return"0秒";}var È="";if(Ì>=3600){var ÄÞ=Math.floor(Ì/3600);Ì=Ì-ÄÞ*3600;È+=ÄÞ+"时";}if(Ì>=60){var ºÞÉ=Math.floor(Ì/60);Ì=Ì-ºÞÉ*60;È+=ºÞÉ+"分";}if(Ì!=0){È+=Ì+"秒";}return È;},Ëéï:function(){$('leftzhuangtai').removeClass('gray');},âí:function(){$('leftzhuangtai').addClass('gray');},ÞìË:function(){var þÝÑ=$('leftshezhi').getChildren();þÝÑ.each(function(ú,index){ú.disabled=false;});},Çéù:function(){var þÝÑ=$('leftshezhi').getChildren();þÝÑ.each(function(ú,index){ú.disabled=true;});},õÜ:function(ðÛ){},ýç:function(ìÚõ,è){;},ð:function(ä){;},åøü:function(){;},µ:function(á){;},Âòµ:function(key){;},ßØ:function(ÛØÖ){var ÖÖà=[];var Ñ=ÛØÖ.substr(this.Îÿä.length);var ÍÕ=Ñ.lastIndexOf('_');ÖÖà[0]=Ñ.substr(0,ÍÕ).toInt();ÖÖà[1]=Ñ.substr(ÍÕ+1).toInt();return ÖÖà;},ÉÔ:function(ÅÓÁ,À){return this.Îÿä+ÅÓÁ+'_'+À;},Ïµá:function(ÅÓÁ,À){return $(this.ÉÔ(ÅÓÁ,À));},Âÿ:function(value){if(!$defined(value)){value=null;}this.Êþí=[];for(var i=0;i<this.µÿÂ;i++){this.Êþí[i]=[];for(var ýþË=0;ýþË<this.ø;ýþË++){this.Êþí[i][ýþË]=value;}}},óý:function(value){for(var i=0;i<this.µÿÂ;i++){for(var ýþË=0;ýþË<this.ø;ýþË++){if(!$defined(this.Êþí[i][ýþË])){this.Êþí[i][ýþË]=value;}}}},ïü:function(){var ÅÓÁ=$random(0,this.µÿÂ-1);var À=$random(0,this.ø-1);for(;ÅÓÁ<this.µÿÂ;ÅÓÁ++){for(;À<this.ø;À++){var ëüï=this.Êþí[ÅÓÁ][À];if(!$defined(ëüï)){return[ÅÓÁ,À];}}}for(ÅÓÁ=0;ÅÓÁ<this.µÿÂ;ÅÓÁ++){for(À=0;À<this.ø;À++){var ëüï=this.Êþí[ÅÓÁ][À];if(!$defined(ëüï)){return[ÅÓÁ,À];}}}return null;},æ:function(value){var ÖÖà=this.ïü();if(ÖÖà!==null){this.Êþí[ÖÖà[0]][ÖÖà[1]]=value;}},â:function(Þú,ÚùÐ){if(Þú<0||Þú>=this.µÿÂ||ÚùÐ<0||ÚùÐ>=this.ø){return true;}return false;},ÔøÚ:function(value){for(var i=0;i<this.µÿÂ;i++){for(var ýþË=0;ýþË<this.ø;ýþË++){if(this.Êþí[i][ýþË]&&this.Êþí[i][ýþË]==value){return true;}}}return false;},Ìö:function(){var Çõ=Ãõý.º;var þ=$random(0,3);switch(þ){case 0:Çõ=Ãõý.º;break;case 1:Çõ=Ãõý.ùó;break;case 2:Çõ=Ãõý.ôòÞ;break;case 3:Çõ=Ãõý.ðñç;break;}return Çõ;},ë:function(direction){var Çõ=Ãõý.º;switch(direction){case Ãõý.ðñç:Çõ=Ãõý.º;break;case Ãõý.º:Çõ=Ãõý.ùó;break;case Ãõý.ùó:Çõ=Ãõý.ôòÞ;break;case Ãõý.ôòÞ:Çõ=Ãõý.ðñç;break;}return Çõ;},çð:function(ã){alert(ã);this.Æó();},empty:function(){;}});var Ùõ={ê:1,ÓõÝ:2,óïâ:3};var ãïº={ßïÈ:1,Ú:2,Õí:3,Ñí:4,Íìì:5};var Ãõý={º:1,ùó:2,ôòÞ:3,ðñç:4};var ïìè=ÕÓã.extend({initialize:function(){this.parent();},åøü:function(){this.µÿÂ=12;this.ø=12;this.Ûä=this.µÿÂ*this.ø;this.ëìñ=0;this.âê=0;this.Þê=0;this.ÚéÑ=0;this.Ðè=0;this.Ìç=[];this.Çæõ=Ãõý.ðñç;this.Í();},ýç:function(ìÚõ,è){if(ìÚõ==Ùõ.ê){$('eatCount').innerHTML="-";this.Í();}else if(ìÚõ==Ùõ.ÓõÝ){if(è!=Ùõ.óïâ){$('eatCount').innerHTML="0个";}}else if(ìÚõ==Ùõ.óïâ){}},ð:function(Éâ){if(this.Ýö()==Ùõ.ÓõÝ){this.Þê+=Éâ;if(this.Þê>=this.âê){this.Þê=0;this.þä();}}},æí:function(Åá){this.Í(Åá);},µ:function(á){},Âòµ:function(key){switch(key){case'down':this.Ï();if(this.Ìç.length==1||(this.Ìç.length!=1&&this.Çæõ!=Ãõý.ùó)){this.Çæõ=Ãõý.ðñç;}break;case'up':this.Ï();if(this.Ìç.length==1||(this.Ìç.length!=1&&this.Çæõ!=Ãõý.ðñç)){this.Çæõ=Ãõý.ùó;}break;case'left':this.Ï();if(this.Ìç.length==1||(this.Ìç.length!=1&&this.Çæõ!=Ãõý.ôòÞ)){this.Çæõ=Ãõý.º;}break;case'right':this.Ï();if(this.Ìç.length==1||(this.Ìç.length!=1&&this.Çæõ!=Ãõý.º)){this.Çæõ=Ãõý.ôòÞ;}break;}},Í:function(Åá){if(!Åá){Åá=$('level').value.toInt();}else{$('level').value=Åá;}switch(Åá){case ãïº.ßïÈ:this.âê=500;break;case ãïº.Ú:this.âê=400;break;case ãïº.Õí:this.âê=300;break;case ãïº.Ñí:this.âê=200;break;case ãïº.Íìì:this.âê=100;break;}this.Þê=0;this.ÚéÑ=0;this.Ðè=0;this.Ìç=[];this.Çæõ=Ãõý.ðñç;this.ëìñ=0;this.ÁàÅ();this.ùäÖ();this.ôãà();},ùäÖ:function(){this.Ìç[0]=[];this.Ìç[0][0]=$random(0,this.µÿÂ-1);this.Ìç[0][1]=$random(0,this.ø-1);this.Ïµá(this.Ìç[0][0],this.Ìç[0][1]).addClass('snake');},ôãà:function(){this.ÚéÑ=$random(0,this.µÿÂ-1);this.Ðè=$random(0,this.ø-1);if(this.ëâ(this.ÚéÑ,this.Ðè)){this.ôãà();return;}this.Ïµá(this.ÚéÑ,this.Ðè).addClass('food');},ëâ:function(ÅÓÁ,À){var çá=this.Ìç.length;for(var i=0;i<çá;i++){if(this.Ìç[i][0]==ÅÓÁ&&this.Ìç[i][1]==À){return true;}}return false;},ÁàÅ:function(){var ÿ=new µÛ();ÿ.ô('<table id="gameTable" cellspacing="0" cellpadding="0" border="0"');for(var i=0;i<this.µÿÂ;i++){ÿ.ô('<tr>');for(var ýþË=0;ýþË<this.ø;ýþË++){ÿ.ô('<td id="'+this.ÉÔ(i,ýþË)+'">&nbsp;</td>');}ÿ.ô('</tr>');}ÿ.ô('</table>');$('main').innerHTML=ÿ.toString();$('gameTable').addEvent('click',this.û.bindWithEvent(this));$('gameTable').addEvent('selectstart',this.öÞ.bindWithEvent(this));},öÞ:function(á){á.stop();},û:function(á){var target=$(á.target);if(target.id.indexOf(this.Îÿä)>=0){if(this.Ýö()!=Ùõ.ÓõÝ){this.Ï();return;}}},ôý:function(ëüì,ç){var çá=this.Ìç.length;var Þú=this.Ìç[çá-1][0]+ëüì;var ÚùÐ=this.Ìç[çá-1][1]+ç;if(Þú<0){Þú=this.µÿÂ-1;}else if(Þú>=this.µÿÂ){Þú=0;}if(ÚùÐ<0){ÚùÐ=this.ø-1;}else if(ÚùÐ>=this.ø){ÚùÐ=0;}if(this.ëâ(Þú,ÚùÐ)){this.Ë();alert("游戏结束。");this.Æó();return;}if(Þú==this.ÚéÑ&&ÚùÐ==this.Ðè){this.ëìñ++;$('eatCount').innerHTML=this.ëìñ+"个";this.Ìç[çá]=[];this.Ìç[çá][0]=this.ÚéÑ;this.Ìç[çá][1]=this.Ðè;this.Ïµá(this.ÚéÑ,this.Ðè).removeClass('food');this.Ïµá(this.ÚéÑ,this.Ðè).addClass('snake');this.ôãà();}else{this.Ïµá(this.Ìç[0][0],this.Ìç[0][1]).removeClass('snake');for(var i=0;i<çá-1;i++){this.Ìç[i][0]=this.Ìç[i+1][0];this.Ìç[i][1]=this.Ìç[i+1][1];}this.Ìç[çá-1][0]=Þú;this.Ìç[çá-1][1]=ÚùÐ;this.Ïµá(Þú,ÚùÐ).addClass('snake');}},þä:function(){switch(this.Çæõ){case Ãõý.ðñç:this.Ò();break;case Ãõý.ùó:this.ãàÁ();break;case Ãõý.º:this.ª();break;case Ãõý.ôòÞ:this.ûÒ();break;}},Ò:function(){this.ôý(1,0);},ãàÁ:function(){this.ôý(-1,0);},ª:function(){this.ôý(0,-1);},ûÒ:function(){this.ôý(0,1);},empty:function(){;}});new ïìè();