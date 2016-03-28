jQuery(document).ready( function($) {
	var Sys={};
	var ua=navigator.userAgent.toLowerCase();
	var s;
	(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1]:
	(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari=s[1]:0;
	$('.search-btn').click(function(){
		if($('.action.search').hasClass('active')){
			$('.action.search').removeClass('active');
			$('.action.search').animate({top:'-40px'},'fast','swing',function(){
				$('#search-container').removeClass('tip-hide');
				$("[name='s']").val('');
				if ('webkitSpeechRecognition' in window)
					$('#start_button').show();
				document.all.s.blur();
			});
		}else{
			$('.action.search').addClass('active');
			$('.action.search').animate({top:'0px'},'fast','swing',function(){
				$('#search-container').addClass('tip-hide');
				document.all.s.focus();
			});
		}
	});
	//$("[name='s']").blur(function(){$('.action.search').removeClass('active');$('#search-container').removeClass('tip-hide');}); 
	$("[name='s']").keyup(function(){
		if($("[name='s']").val() == ''){
			if ('webkitSpeechRecognition' in window){
				$('#start_button').show();
			}
		}else{
			$('#start_button').hide();
		}
	});
	var recognizing = false;
	var ignore_onend;
	if (!('webkitSpeechRecognition' in window)) {
		$('#start_button').hide();
	} else {
		$('#start_button').css('display','inline-block');
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
			$("[name='s']").val(' Listening...');
		};
		recognition.onerror = function(event) {
			ignore_onend = true;
		};
		recognition.onend = function() {
			recognizing = false;
			$('#start_button').show();
			if(!ignore_onend && $("[name='s']").val() != '' && $("[name='s']").val() != ' Listening...')
				$("#search-form").submit();
			else
				$("[name='s']").val('');
		};
		recognition.onresult = function(event) {
			if (typeof(event.results) == 'undefined') {
				recognition.onend = null;
				recognition.stop();
				upgrade();
				return;
			}
			var final_transcript = '';
			var intrm_transcript = '';
			$("[name='s']").val('');
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if(event.results[i].isFinal)
				{
					final_transcript += event.results[i][0].transcript;
					$("[name='s']").val(final_transcript);
				}else{
					intrm_transcript += event.results[i][0].transcript;
					$("[name='s']").val(intrm_transcript);
				}
			}
			$('#start_button').hide();
			document.all.s.focus();
		};
	}
	$('#start_button').click(function(){
		if (recognizing) {
			recognition.stop();
			return false;
		}
		final_transcript = '';
		recognition.lang = 'cmn-Hans-CN';
		recognition.start();
		ignore_onend = false;
		return false;
	});

	$(".flexnav").flexNav();
	$('.flexslider').flexslider({directionNav: false});
	$(".fitvid").fitVids();
	$("a:has(img)").fancybox({loop:false});
	function sidebar_toggle(slide){
		if(slide){
			$("#main").toggleClass('fixed');
			$("#main").toggleClass('side-active');
		}else{
			$("#main").toggleClass('main_collapse');
		}
		$(".action.search").toggleClass('side-active');
		$(".site-nav").toggleClass('side-active');
	}
	function slidebar_hide(){
		$("#main").removeClass('fixed');
		$("#main").removeClass('side-active');
		$(".action.search").removeClass('side-active');
		$(".site-nav").removeClass('side-active');
	}
	$("#sidebar").click(function(){
		sidebar_toggle(true);
	});
	$(".drawer-button").click(function(){
		sidebar_toggle(true);
	});
	$(".drawer-button").on('touchend',function(){
		sidebar_toggle(true);
	});
	function hide_plgin(switcher, content){
		switcher.removeClass("on");
		switcher.addClass("off");
		content.fadeOut(500, function(){});
	}
	function show_plgin(switcher, content){
		switcher.removeClass("off");
		switcher.addClass("on");
		content.fadeIn(500, function(){});
	}
	function hide_all_plgin(){
		$(".plgin-item").each(function(){
			if($(this).children("span").children("a").hasClass("on"))
				hide_plgin($(this).children("span").children("a"), $(this).children("div"));
		});
	}
	function load_plugin(container, tip, url, callback){
		hide_all_plgin();
		container.show();
		container.html(tip);
		container.load(url,callback);
	}
	$("#wt").click(function(){
		if($(this).hasClass("on")){
			hide_plgin($(this),$("#plg-ctx2"));
		}else{
			if($(this).hasClass("off")==false){
				load_plugin($("#plg-ctx2"),'<div style="margin-top: 37px;font-size: 13px;">正在联络赛半仙。。。</div>',"/lab #forecast",function(){$("#wt").addClass("off");$("#wt").click(); });
			}else{
				hide_all_plgin();
				show_plgin($(this), $("#plg-ctx2"));
			}
		}
	});
	$("#drop").click(function(){
		if($(this).hasClass("on")){
			hide_plgin($(this),$("#dropinfo"));
		}else{
			hide_all_plgin();
			show_plgin($(this), $("#dropinfo"));
		}
	});
	$("#dropinfo").on('dragover',function(ev){
		ev.preventDefault();
		$("#dropinfo").html("释放以提交...");
	});
	$("#dropinfo").on('drop',function(ev){$("#dropinfo").html("<i class='icon-spin5 animate-spin'></i>正在提交...");
		ev.preventDefault();
		var post=ev.originalEvent.dataTransfer.getData("text/html");
		var a = jQuery(document.createElement("div"));
		a.attr("id","post_cache");
		a.html(post);
		var content_type = "tui";
		var post_title = "转帖";
		if(a.children()[0].tagName.toUpperCase() != 'A'){
			content_type = "link";
			if(a.find(":header").length!=0){
				post_title = a.find(":header").first().text();
			}else if(a.find(".title").length!=0){
				post_title = a.find(".title").first().text();
			}
		}else{
			post_title = a.text();
		}
		a.remove();
		var recommander = "";
		if (typeof(DUOSHUO) != "undefined" && typeof(DUOSHUO.visitor.data) != "undefined" && typeof(DUOSHUO.visitor.data.name) != "undefined" && DUOSHUO.visitor.data.name !="" ) {
			recommander = DUOSHUO.visitor.data.name;
		}else{
			recommander = user_id;
		}
		$.ajax({
			type:'POST',
			url: '/service/gateway/sync_3rd',
			data: {
					raw_content: "---\nstamp:"+content_type+"\ntitle:"+post_title+"\nstatus: public\n---\n"+recommander+" 推荐: \n"+toMarkdown(post).replace(/<\/?[^>]*>/g,'')
		  		},
			success: function(data) {
					$("#dropinfo").html("推荐文章已提交, Thx!");
					setTimeout("$('#dropinfo').hide();$('#dropinfo').html('拖放链接或选中的文章内容至此推荐文章');",1000);
					$("h1.logo a").click();
				},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
					$("#dropinfo").html("推荐文章提交失败, Sorry!");
					setTimeout("$('#dropinfo').hide();$('#dropinfo').html('拖放链接或选中的文章内容至此推荐文章');",1000);
				}
		});
	});
	if(Sys.safari){
		$("#fm").parent().parent().hide();
		$("#ntfy").parent().parent().hide();
		$("#ft").parent().parent().hide();
		$("#light").parent().parent().hide();
	}else{
            $("#fm").hover(
                function () {
                    if($(this).hasClass("on"))
                    {
                        $(this).children("i").removeClass("icon-volume-high");
                        $(this).children("i").addClass("icon-volume-off");
                    }
                },
                function () {
                    if($(this).children("i").hasClass("icon-volume-off"))
                    {
                        $(this).children("i").removeClass("icon-volume-off");
                        $(this).children("i").addClass("icon-volume-high");
                    }
                }
            );
            $("#fm").click(function(){
                if($(this).hasClass("on")){
                    $.cookie("xander-fm", "off", {expires: 1, path: '/'});
                    hide_plgin($(this),$("#plg-ctx0"));
                    $(this).removeClass("off");
                    $(this).children("i").removeClass("icon-volume-high");
                    $(this).children("i").removeClass("icon-volume-off");
                    $(this).children("i").addClass("icon-music-outline");
                    $("#doufm").remove();
                }else{
                    if($(this).hasClass("off")==false){
                        load_plugin($("#plg-ctx0"),'<div style="margin-top: 75px;font-size: 13px;">全球歌手召集中。。。</div>',"/lab #doufm", function(){$("#fm").addClass("off");$("#fm").click();});
                    }else{
                        $.cookie("xander-fm", "on", {expires: 1, path: '/'});
                        hide_all_plgin();
                        show_plgin($(this), $("#plg-ctx0"));
                        $(this).children("i").removeClass("icon-music-outline");
                        $(this).children("i").addClass("icon-volume-high");
                    }
                }
            });
            $("#ft").click(function(){
                if($(this).hasClass("on")){
                    hide_plgin($(this),$("#plg-ctx3"));
                }
                else
                {
                    if($(this).hasClass("off")==false){
                        load_plugin($("#plg-ctx3"),'<div style="margin-top: 95px;font-size: 13px;">请面对摄像头微笑。。。</div>',"/lab #snaper",
                        function(){$("#ft").addClass("off");$("#ft").click(); 
						var canvas = document.getElementById("canvas"),
							context = canvas.getContext("2d"),
							video = document.getElementById("video"),
							videoObj = { "video": true },
							errBack = function(error) {
								console.log("Video capture error: ", error.code); 
							};
						var ratioWidth = canvas.width/video.width;
						var ratioHeight = canvas.height/video.height;
						var ratio = 1;
						var posX = 0;
						var posY = 0;
						if(ratioWidth > ratioHeight)
						{
							ratio = 1/ratioHeight;
							posX = (canvas.width-(video.width/ratio))/2;
						}else{
							ratio = 1/ratioWidth;
							posY = (canvas.height-(video.height/ratio))/2;
						}
						if(navigator.getUserMedia) {
							navigator.getUserMedia(videoObj, function(stream) {
								video.src = stream;
								video.play();
							}, errBack);
						} else if(navigator.webkitGetUserMedia) {
							navigator.webkitGetUserMedia(videoObj, function(stream){
								video.src = window.webkitURL.createObjectURL(stream);
								video.play();
							}, errBack);
						}
						var imgFlush;
						function startDraw(){
							imgFlush = setInterval('canvas.getContext("2d").drawImage(video, '+posX+', '+posY+', '+video.width/ratio+', '+video.height/ratio+');',50);
						}
						function pauseDraw(timeout){
							video.pause();
							clearInterval(imgFlush);
							setTimeout(function(){startDraw();video.play();},timeout);
						}
						function procImage(canvas){
							var ctx = canvas.getContext("2d")
							var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
							for (var i=0;i<imgData.data.length;i+=4)
							{
								imgData.data[i]=255-imgData.data[i];
								imgData.data[i+1]=255-imgData.data[i+1];
								imgData.data[i+2]=255-imgData.data[i+2];
								imgData.data[i+3]=255;
							}
							ctx.putImageData(imgData,0,0);
						}
						startDraw();
						document.getElementById("snap").addEventListener("click", function() {
							pauseDraw(1400);
							jQuery.post('/service/gateway/sync_3rd',
										{
											ext_3rd: 'png',
											base64: canvas.toDataURL("image/png")
										});
							setTimeout(function(){procImage(canvas);},100);
						});}
                        );
                    }else{
                        hide_all_plgin();
                        show_plgin($(this), $("#plg-ctx3"));
                    }
                }
            });
            $("#light").click(function(){
                if($(this).hasClass("on")){
                    $.cookie("xander-spot", "off", {expires: 1, path: '/'});			
                    $(this).removeClass("on");
                    $("#spot-holder").fadeOut(1000, function(){});
                }else{
                    $(this).addClass("on");
                    if($.cookie("xander-spot") == "on")
                    {
                        $("#spot-holder").show();
                    }
                    else
                    {
                        $.cookie("xander-spot", "on", {expires: 1, path: '/'});
                        $("#spot-holder").fadeIn(1000, function(){});
                    }
                }
            });
            if($.cookie("xander-fm") == "on")
            {
                $("#fm").click();
            }
            if($.cookie("xander-spot") == "on")
            {
                $("#light").click();
            }
	}
	$(document).pjax("header a, #page a:not(:has(img)), .site-nav-inner a", "#pjax",{ timeout: 10000, fragment:'#pjax'});
	function toggleDuoshuoComments(container){
		if(typeof DUOSHUO != 'undefined')
		{
			var el = document.createElement('div');
			el.setAttribute('data-thread-key', $('.ds-thread').attr('data-title'));
			el.setAttribute('data-url',window.location.href);
			DUOSHUO.EmbedThread(el);
			$(container).append(el);
		}
	}
	function jiathis(container){
		if(typeof jiathisQuery != 'undefined')
		{
			var ds = document.createElement('script');
			ds.type = 'text/javascript';ds.async = true;
			ds.src = 'http://v3.jiathis.com/code_mini/jia.js?uid='+jiathisQuery;
			ds.charset = 'UTF-8';
			$(container).append(ds);
		}
	}
	$("#pjax").bind("pjax:start",function(){
		slidebar_hide();
		$("#pjax").children(":not(#widget)").hide();
		$("body").scrollTop(0);
		$('#loading').show();
	});
	$("#pjax").bind("pjax:end",function(){
		$('.flexslider').flexslider({directionNav: false});
		$(".fitvid").fitVids();
		jiathis($('#pjax'));
		toggleDuoshuoComments(".ds-thread");
		$("a:has(img)").fancybox({loop:false});
		$("style:contains('MathJax')").remove();
		$('script[src="/service/static_3rd/staticfile/ajax/libs/mathjax/2.3/MathJax.js?config=TeX-AMS_HTML-full.js"]').remove();
		$('#MathJax_Font_Test').remove();
		MathJax = undefined;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "/service/static_3rd/staticfile/ajax/libs/mathjax/2.3/MathJax.js?config=TeX-AMS_HTML-full.js";
		script.innerHTML = 'MathJax.Hub.Config({tex2jax: {inlineMath: [ ["$","$"]]},extensions: ["jsMath2jax.js", "tex2jax.js"], messageStyle: "none"});';
		document.body.appendChild(script);
		$('#loading').hide();
	});
	if($('#favicon')){}else{
		var favicon=new Favico();
		var image=document.getElementById('favicon-image');
		favicon.image(image);
	}
	$("#sync").click(function(){
		$.post('/service/gateway/sync');
	});
});