/* VIA 仿夸克浏览器
 * name     via-quark-homepage
 * author   BigLop
 * version  1.1
 */
function FnVia() {
	var Storage = [];
	var This = this;
	/*
	 * 加载主程序
	 */
	This.Init = function () {
		if (!localStorage.length) {
			var a = ["book", "set"],
			b = [[["https://www.zhihu.com", "./img/zhihu.com.png", "知乎"],["http://www.163.com", "./img/163.com.png", "网易"], ["http://m.shouhu.com", "./img/sohu.com.png", "搜狐"], ["http://www.youku.com", "./img/youku.com.png", "优酷"], ["http://m.bilibili.com", "./img/bilibili.com.png", "Bilibili"], ["https://m.weibo.com", "./img/weibo.com.png", "微博"], ["https://m.taobao.com", "./img/taobao.com.png", "淘宝"], ["https://sina.cn", "./img/sina.cn.png", "新浪"], ["http://portal.3g.qq.com", "./img/qq.com.png", "腾讯"], ["https://www.google.com/ncr", "./img/google.ru.png", "Google"]], [["engines", "baidu"], ["transition", 0], ["wallpaper", ""], ["logo", "./img/logo.png"], ["bookcolor", "black"],["textshadow","0"]]];
			for (var i = a.length - 1; i > -1; i--)
				localStorage.setItem(a[i], JSON.stringify(b[i]));
			$.post("http://www.liumingye.cn/tools/via/log.php?s=activate via-quark-homepage 1.1 " + navigator.userAgent); //激活统计
		}
		Storage.book = JSON.parse(localStorage.getItem('book'));
		var Html = "";
		for (var i = 0; i < Storage.book.length; i++) {
			Html += '<li><div value="' + Storage.book[i][0] + '"><div class="imgbook" style="background-image:url(' + Storage.book[i][1] + ')"></div><p>' + Storage.book[i][2] + "</p></div></li>";
		}
		$("#book").html(Html);
		This.Size(0);

		Storage.set = JSON.parse(localStorage.getItem('set'));
		for (var i = Storage.set.length - 1; i > -1; i--)
			Storage.set[Storage.set[i][0]] = Storage.set[i][1];
		$("body").css("background-image", "url(" + Storage.set.wallpaper + ")");
		$("#logo").css("background-image", "url(" + Storage.set.logo + ")");
		if(Storage.set.bookcolor=="white" && Storage.set.logo=="./img/logo.png"){
			$("#logo").css("filter", "Invert()");
		}
		$("#book").css('color', Storage.set.bookcolor);
		if(!Storage.set.textshadow){
			if(Storage.set.bookcolor=="white")
			{
				$("#book p").css('text-shadow','0px 0px 4px black');
			}else{
				$("#book p").css('text-shadow','0px 0px 4px white');
			}
		}
		$("#edit").click(function () {
			//主页
			$("#edit,#book").css('animation', 'down .3s');
			//搜索页初始化
			$(".suggestion").html("");
			$(".close").html("取消");
			$(".shortcut1").show();
			$(".shortcut2,.shortcut3,.back").hide();
			$(".s-temp").focus();
			//搜索页
			$("#search").css('animation', 'fadeIn .3s').show();
			setTimeout(function () {
				$(".div-input,.shortcut").show();
				$(".input").focus().val("");
			}, 200);
		});
		$("#search").click(function (e) {
			if (e.target.parentNode.className === "suggestion") {
				var s = e.target.innerText;
				if (s)
					return This.SearchText(s)
			}
			if (e.target.className === "box") {	
				//主页
				$("#edit,#book").css('animation', 'up .3s');
				//搜索页
				$("#search").css('animation', 'fadeOut .3s');
				setTimeout(function () {
					$("#search,.shortcut,.div-input").hide();
				}, 200);
			}
		});
		$("#book").on("click", "li", function (e) {
			e.stopPropagation();
			if (!$(this).find(".delbook").length) {
				var t = $(this).find('div').attr("value");
				switch (t) {
				case "addbook()":
					$(".addbook-input").val('');
					$("#addbook-upload").html('点击选择图标');
					$(".addbook-shade").show();
					$(document).click();
					break;
				case void 0:
					break;
				default:
					!Storage.set.transition && $(".transition").show();
					self.location = t;
				}
			}
		});

		$("#addbook-upload").click(function () {
			$("#addbook-pick").click();
		})

		$("#addbook-pick").on("change", function (e) {
			var files = $(this).prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.addEventListener("load", function (e) {
				$("#addbook-upload").html('<img src="' + e.target.result + '"></img><div>' + files[0].name + '</div>');
			})
		})

		$(".addbook-btn0").click(function () {
			var t = $(".addbook-input").eq(0).val(),
			u = $(".addbook-input").eq(1).val(),
			p = $("#addbook-upload img").attr('src');
			if (t.length && u.length && p.length) {
				u = u.match(/^(ht|f)tp(s?):\/\//) ? u : "http://" + u;
				Storage.book.push([u, p, t]);
				localStorage.setItem("book", JSON.stringify(Storage.book));
				$(".addbook-btn1").click();
				var i = Storage.book.length - 1;
				$("#book").append('<li><div value="' + u + '"><div class="imgbook" style="background-image:url(' + p + ')"></div><p>' + t + "</p></div></li>");
				$("#book li").eq(i).find('div').eq(0).css('margin-top', '84px').animate({
					marginTop: 0
				}, 200, function () {
					This.Size(1);
				});
				This.BookLongPress();
			}
		})

		$(".addbook-btn1").click(function () {
			$(".addbook-shade").css("animation", "fadeOut .2s");
			$(".addbook-from").css("animation", "down .2s");
			setTimeout(function () {
				$(".addbook-shade").hide();
				$(".addbook-shade,.addbook-from").removeAttr("style");
			}, 170);

		})

		$("#book").on("click", ".delbook", function (e) {
			e.stopPropagation();
			var i = $(this).parents('li').index();
			$("#book li").eq(i).find('.delbook').remove();
			$("#book li").eq(i).find('div').eq(0).animate({
				marginTop: 84
			}, 200, function () {
				$("#book li").eq(i).remove();
				This.Size(1);
			});
			Storage.book.splice(i, 1);
			localStorage.setItem("book", JSON.stringify(Storage.book));
		});

		$(".addbook-shade").click(function (e) {
			if (e.target.className === "addbook-shade")
				$(".addbook-btn1").click();
		})

		$(document).click(function () {
			if ($(".delbook").length) {
				$(".delbook").css('animation', 'scale2 .2s');
				setTimeout(function () {
					$(".delbook").remove();
					This.Size(1);
				}, 150);
				$(".addbook").remove();
			}
		});

		$(".input").on("input", function () {
			This.Inputchange();
		});

		$(".back").click(function () {
			$(".input").focus().val("");
			This.Inputchange();
		});

		$(".shortcut1").click(function (e) {
			$(".input").focus().val($(".input").val() + e.target.innerText);
			This.Inputchange();
		});

		$(".shortcut2").click(function (e) {
			$(".input").focus().val($(".input").val() + e.target.innerText);
			This.Inputchange();
		});

		$(".shortcut3 li").click(function () {
			var t;
			switch ($(this).index()) {
			case 1:
				t = "http://s.weibo.com/weibo/";
				break;

			case 2:
				t = "https://www.zhihu.com/search?type=content&q=";
				break;

			case 3:
				t = "http://www.soku.com/m/y/video?q=";
				break;

			case 4:
				t = "https://m.douban.com/search?query=";
				break;

			case 5:
				t = "http://weixin.sogou.com/weixin?type=2&query=";
				break;
			}
			t && (!Storage.set.transition && $(".transition").show(), self.location = t + $(".input").val());
		});
		$(".close").click(function () {
			This.Search();
		});
		$(".input").keydown(function (e) {
			e.keyCode === 13 && This.Search();
		});
		$("#logo").click(function () {
			self.location = "folder://";
		});
		$("#logo").longPress(function () {
			$(".set-from").animate({
				opacity: 1,
				marginTop: 0
			}, 200).show();
			for (var i = Storage.set.length - 1; i > -1; i--) {
				if (Storage.set[Storage.set[i][0]] === 0) {
					$(".set-option").eq(i).find('.set-switch').addClass('set-active');
				} else {
					$(".set-option").eq(i).find('select').val(Storage.set[Storage.set[i][0]]);

				}
			}
		});

		$(".set-back").click(function () {
			$(".set-from").animate({
				opacity: 0,
				marginTop: 40
			}, 200, function () {
				$(".set-from").hide();
			});
		});

		$(".set-option").click(function () {
			var i = $(this).index(),
			v;
			if ($(".set-option").eq(i).find('.set-switch').length) {
				if (Storage.set[i][1] === 0) {
					$(".set-option").eq(i).find('.set-switch').removeClass('set-active');
					v = 1;
				} else {
					$(".set-option").eq(i).find('.set-switch').addClass('set-active');
					v = 0;
				}
				Storage.set[i][1] = Storage.set[Storage.set[i][0]] = v;
				localStorage.setItem("set", JSON.stringify(Storage.set));
				This.Msg('OK，设置已保存');
			} else if ($(".set-option").eq(i).find('.set-upload').length) {
				$('#set-upload').click().attr('option', i);
			} else if ($(".set-option").eq(i).find('p').html() === "恢复壁纸和LOGO") {
				Storage.set[2][1] = Storage.set[Storage.set[2][0]] = ""
				Storage.set[3][1] = Storage.set[Storage.set[3][0]] = "./img/logo.png";
				Storage.set[4][1] = Storage.set[Storage.set[4][0]] = "black"
				localStorage.setItem("set", JSON.stringify(Storage.set));
				location.reload();
			} else if ($(".set-option").eq(i).find('p').html() === "初始化") {
				localStorage.clear();
				location.reload();
			}
		});

		$("#set-upload").change(function () {
			var i = $(this).attr('option');
			var files = $('#set-upload').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.addEventListener("load", function (e) {
				Storage.set[i][1] = Storage.set[Storage.set[i][0]] = e.target.result;
				localStorage.setItem("set", JSON.stringify(Storage.set));
				$("body").css("background-image", "url(" + Storage.set.wallpaper + ")");
				$("#logo").css("background-image", "url(" + Storage.set.logo + ")");
			})
		});

		$(".set-select").change(function () {
			var _this = $(this),
			i = _this.parent().index(),
			v = _this.val();
			Storage.set[i][1] = Storage.set[Storage.set[i][0]] = v;
			localStorage.setItem("set", JSON.stringify(Storage.set));
			$("#book").css('color', Storage.set.bookcolor);
			This.Msg('OK，设置已保存');
		})
		This.BookLongPress();
		$(function () {
			var x,
			y,
			_this,
			w,
			h,
			p,
			left,
			top,
			wid,
			pos,
			status = 0,
			$this = $("#book")[0];
			$this.addEventListener("touchstart", function (e) {
				var t = $(e.target).parents('li');
				if (!t.is('li') || !$(".delbook").length || t.is('.addbook') || e.target.className === 'delbook' || status)
					return;
				_this = t;
				pos = _this.index();
				w = _this.width();
				h = _this.height();
				p = _this.offset();
				left = p.left;
				top = p.top;
				_this.css({
					"width": w,
					"height": h,
					"position": "fixed",
					opacity: .8,
					left: left,
					top: top
				}).before('<li class="holder"></li>');
				wid = $(".holder");
				var thouch = e.targetTouches[0];
				x = thouch.pageX;
				y = thouch.pageY;
				w /= 2;
				h /= 2;
				status = 1;
				_this.find('.delbook').remove();
			}, {
				passive: true
			});

			$this.addEventListener("touchmove", function (e) {
				if (status) {
					var thouch = e.targetTouches[0];
					var l = left + thouch.pageX - x;
					var t = top + thouch.pageY - y;
					_this.css({
						"left": l,
						"top": t
					});
					l += w;
					t += h;
					$($this).children().not(_this).not(wid).not('.addbook').each(function (i) {
						var obj = $(this),
						p = obj.offset();
						if (p.left < l && l < p.left + obj.width() && p.top < t && t < p.top + obj.height())
							return obj.next(".holder").length ? wid.insertBefore(this) : wid.insertAfter(this), !1;
					});
				}
			}, {
				passive: true
			});

			$this.addEventListener("touchend", function () {
				if (status) {
					var p = wid.offset();
					_this.animate({
						"left": p.left,
						"top": p.top
					}, 200, function () {
						if ($(".holder").length) {
							_this.removeAttr("style");
							wid.replaceWith(_this);
							var pos2 = _this.index();
							Storage.book.splice(pos2 + (pos - pos2 < 0 && 1), 0, Storage.book[pos]);
							Storage.book.splice(pos + (pos - pos2 > 0 && 1), 1);
							localStorage.setItem("book", JSON.stringify(Storage.book));
							status = 0;
							_this.find('.imgbook').append('<div class="delbook"></div>'); 
						}
					});
				}
			}, {
				passive: true
			});
		})
		
	}
	This.Size = function (e) {
		var t = ($("body").height() - $("#main").height())/2;
		e ? $("#main").animate({
			top: t
		}, 200) : $("#main").css('top',t);
		
	}
	This.Inputchange = function () {
		var t = $(".input").val();
		$(".shortcut1,.shortcut2,.shortcut3").hide();
		if (!t) {
			$(".back").hide();
			$(".close").html("取消");
			$(".shortcut1").show();
		} else {
			$(".back").show();
			$(".close").html(/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t) ? "进入" : "搜索");
			escape(t).indexOf("%u") < 0 ? $(".shortcut2").show() : $(".shortcut3").show();
		}
		$.ajax({
			url: "http://suggestion.baidu.com/su",
			type: "GET",
			dataType: "jsonp",
			data: {
				wd: t,
				cb: "Via.Su"
			},
			timeout: 5e3
		});
	}
	This.Search = function () {
		var t = $(".input").val();
		if (!t) {
			$("#search").click();
		} else {
			This.SearchText(t);
		}
	}
	
	This.SearchText = function (t) {
		!Storage.set.transition ? $(".transition").show() : $(".suggestion").click();
		var u;
		switch (Storage.set.engines) {
		case 'baidu':
			u = "https://www.baidu.com/s?wd=";
			break;
		case 'google':
			u = "https://www.google.com.hk/search?q=";
			break;
		case 'bing':
			u = "http://cn.bing.com/search?q=";
			break;
		case 'sm':
			u = "http://m.sm.cn/s?q=";
			break;
		case 'haosou':
			u = "https://www.so.com/s?q=";
			break;
		case 'sogou':
			u = "https://www.sogou.com/web?query=";
			break;
		}

		u ? self.location = u + t : window.via.searchText(t);
	}
	This.BookLongPress = function () {
		$("#book li").longPress(function () {
			if (!$(".addbook").length && !$(".delbook").length) {
				for (var i = $(".imgbook").length; i > -1; i--) {
					$(".imgbook").eq(i).append('<div class="delbook"></div>');
				}
				$("#book li").length < 20 && $("#book").append('<li class="addbook"><div value="addbook()"><div class="imgbook" style="background-image:url(./img/addbook.png)"></div><p>添加</p></div></li>');
				This.Size(1);
			}
		});
	}
	This.Msg = function (text){
		$('body').append('<div class="tips"><i></i><p>'+text+'</p></div>');
		var tmp = $('.tips:last-child');
		setTimeout(function () { tmp.css('animation','up2 .3s')}, 3000);
		setTimeout(function () {
			tmp.css('opacity','0');
			setTimeout(function () {
				if($('.tips:last-child').css('opacity')==0)
				{
					$('.tips').remove();
				}
			},250);
		}, 3250);
	}
	$.fn.longPress = function (fn) {
		var timeout = void 0,
		$this = this,
		startPos,
		movePos,
		endPos;
		for (var i = $this.length - 1; i > -1; i--) {
			$this[i].addEventListener("touchstart", function (e) {
				var touch = e.targetTouches[0];
				startPos = {
					x: touch.pageX,
					y: touch.pageY
				};
				timeout = setTimeout(fn, 700);
			}, {
				passive: true
			});
			$this[i].addEventListener("touchmove", function (e) {
				var touch = e.targetTouches[0];
				movePos = {
					x: touch.pageX - startPos.x,
					y: touch.pageY - startPos.y
				};
				Math.abs(movePos.x - startPos.x) > 10 || Math.abs(movePos.y - startPos.y) > 10 && clearTimeout(timeout);
			}, {
				passive: true
			});
			$this[i].addEventListener("touchend", function () {
				clearTimeout(timeout);
			}, {
				passive: true
			});
		}
	};
	This.Su = function (e) {
		var urls = e.s;
		var html = "";
		for (var i = urls.length; i > 0; i--) {
			html += "<li>" + urls[i - 1] + "</li>";
		}
		$(".suggestion").html(html).scrollTop($(".suggestion")[0].scrollHeight);
	}

}
if (typeof Via == "undefined") {
	var Via = new FnVia();
	Via.Init();
}
