/*js库
作者：潘俊杰
一，运动方法:animate(运动对象，运动目标对象，时间，[缓冲名，回调函数]);
	二，计算后样式：fetchComputedStyle(元素对象，CSS属性)
	三，获取元素子节点方法：getChildren(元素对象，['first' | 'last']);
	四，序列化方法：queryString(对象)
	五、ajax方法 myAjax.get(地址，参数，回调)；
							myAjax.post(地址，参数，回调);
							myAjax.ajax({type, url, data, success});
	六，模板字符串方法：templateString(str, obj)
	七、图片预加载方法 xcLazyload(parent)
	八、获取地址栏数据 getUrlVal(属性)
*/

// 1.运动方法
function run(obj, targetObj, times, tweenName, callback) {
	//只看传递过来的参数！
	//arguments;
	//验证参数
	if (arguments.length == 3 && typeof arguments[0] != 'object' || typeof arguments[1] != 'object' || typeof arguments[
			2] != 'number') {
		// 如果三个参数类型有一个不对，就进来 仍一个错误出去
		throw new Error('必传三个参数，分别为：要运动的元素对象，目标点对象，时间ms')
	} else if (arguments.length == 3) {
		//把缓冲设置为默认linear
		tweenName = 'linear';
		callback = null;
	} else if (arguments.length == 4) {
		switch (typeof arguments[3]) {
			case 'string':
				tweenName = Tween[arguments[3]] ? arguments[3] : 'linear';
				callback = null;
				break;
			case 'function':
				//实参只有四，第四个是 function  arguments[3]
				//默认接收过来是 function arguments[3]
				//arguments[3] //'linear';
				callback = arguments[3];
				tweenName = 'linear';
				break;
		}
	} else if (arguments.length == 5) {
		if (typeof arguments[3] != 'string' || typeof arguments[4] != 'function') {
			throw new Error('第四个参数为string类型的缓冲名，第五个参数为回函数');
		};
		tweenName = Tween[arguments[3]] ? arguments[3] : 'linear';
	};


	// 上锁
	obj.lock = true;

	// 定时器间隔
	var interval = 5;

	// 初始值 起始点
	var startObj = {};
	for (var k in targetObj) {
		startObj[k] = fetchComputedStyle(obj, k);
	};

	//求定时器总次数(总帧数)
	var maxCount = parseInt(times / interval);

	//求步长 (目标点 - 起始点) / 总帧数
	var changeObj = {};
	for (var k in targetObj) {
		changeObj[k] = targetObj[k] - startObj[k];
	};

	//定义定时器
	var timer;

	// 定时器次数累加
	var count = 0;

	timer = setInterval(function() {
		// 累加次数
		count++;

		//遍历验证设置
		for (var k in startObj) {
			if (k == 'opacity') {
				obj.style[k] = Tween[tweenName](count, startObj[k], changeObj[k], maxCount);
			} else {
				obj.style[k] = Tween[tweenName](count, startObj[k], changeObj[k], maxCount) + 'px';
			};
		};

		//验证
		if (count == maxCount) {
			//停止定时器
			clearInterval(timer);
			//设置终点
			for (var k in targetObj) {
				if (k == 'opacity') {
					obj.style[k] = Tween[tweenName](count, startObj[k], changeObj[k], maxCount);
				} else {
					obj.style[k] = Tween[tweenName](count, startObj[k], changeObj[k], maxCount) + 'px';
				};
			};
			//当前运动完毕后开锁
			obj.lock = false;
			//回调
			callback && callback.call(obj);
		};
	}, interval);


};

// 2.计算属性方法
function fetchComputedStyle(obj, property) {
	// 兼容
	if (window.getComputedStyle) {
		//现代浏览器
		return parseFloat(window.getComputedStyle(obj)[property]);
	} else {
		//IE678
		return parseFloat(obj.currentStyle[property]);
	};
};

// 3.元素子节点方法
function getChildren(ele, n) {
	// 定义一个空数组
	var arr = [];
	// 首先拿到所有子节点（元素和空文本节点）,遍历验证 再添加到arr去
	var node = ele.childNodes;
	for (var i = 0; i < node.length; i++) {
		// 验证
		if (node[i].nodeType == 1) {
			arr.push(node[i]);
		};
	};

	if (n) {
		if (n == 'first') {
			return arr[0];
		} else if (n == 'last') {
			return arr[arr.length - 1];
		};
	} else {
		// 返回整个数组
		return arr;
	}
};


// 4.序列化方法
function queryString(obj) {
	var arr = [];
	for (var k in obj) {
		arr.push(k + '=' + encodeURIComponent(obj[k]));
		// decodeURIComponent()
	};
	// 返回序列化 
	return arr.join('&');
};


// 5.ajax方法
var myAjax = {
	get: function(url, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					callback(JSON.parse(xhr.response));
				};
			};
		};
		var str = queryString(data) ? '?' + queryString(data) : '';
		xhr.open('get', url + str);
		xhr.send();
	},

	post: function(url, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					callback(JSON.parse(xhr.response));
				};
			};
		};
		xhr.open('post', url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(queryString(data));
	},

	ajax: function(obj) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					obj.success(JSON.parse(xhr.response));
				};
			};
		};
		if (obj.type == 'get') {
			var str = queryString(obj.data) ? '?' + queryString(obj.data) : '';
			xhr.open('get', obj.url + str);
			xhr.send();

		} else if (obj.type == 'post') {
			xhr.open('post', obj.url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(queryString(obj.data));
		};
	}

};

// 6.字符串模板方法
//封装一个方法
function templateString(str, obj) {
	return str.replace(/@([0-9a-zA-Z_-]+)@/g, function(a, $1) {
		return obj[$1];
	});
};

// 7.图片预加载方法 lazy 懒加载
function xcLazyload(parent) {
	// 获取所有带 xc-lazyload 的属性元素
	var aImgXc = document.querySelectorAll(parent + ' [xc-lazyload]');
	for (var i = 0; i < aImgXc.length; i++) {
		(function(m) {
			var img = new Image();
			var nowSrc = aImgXc[m].getAttribute('xc-lazyload');
			img.src = nowSrc;
			//监听
			img.onload = function() {
				aImgXc[m].src = nowSrc;
			};
		})(i);
	};
};

//8.获取地址栏的属性值 
function getUrlVal(property) {
	var urlStr = window.location.search.replace('?', '');
	//name=xm&age=10&page=5
	var re = new RegExp('(^|&)' + property + '=([^&]*)(&|$)');
	var result = urlStr.match(re);
	if (result == null) {
		return null
	};
	return result[2];
};

//缓冲公式
var Tween = {
	linear: function(t, b, c, d) {
		return c * t / d + b;
	},
	//二次的
	quadEaseIn: function(t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	quadEaseOut: function(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	quadEaseInOut: function(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	//三次的
	qubicEaseIn: function(t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	qubicEaseOut: function(t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	qubicEaseInOut: function(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	//四次的
	quartEaseIn: function(t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	quartEaseOut: function(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	quartEaseInOut: function(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	quartEaseIn: function(t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	quartEaseOut: function(t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	quartEaseInOut: function(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	//正弦的
	sineEaseIn: function(t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	sineEaseOut: function(t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	sineEaseInOut: function(t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	expoEaseIn: function(t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	expoEaseOut: function(t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	expoEaseInOut: function(t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	circEaseIn: function(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	circEaseOut: function(t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	circEaseInOut: function(t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	elasticEaseIn: function(t, b, c, d, a, p) {
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	elasticEaseOut: function(t, b, c, d, a, p) {
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	},
	elasticEaseInOut: function(t, b, c, d, a, p) {
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) +
			b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	//冲过头系列
	backEaseIn: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	backEaseOut: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	backEaseInOut: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	//弹跳系列
	bounceEaseIn: function(t, b, c, d) {
		return c - Tween.bounceEaseOut(d - t, 0, c, d) + b;
	},
	bounceEaseOut: function(t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	bounceEaseInOut: function(t, b, c, d) {
		if (t < d / 2) return Tween.bounceEaseIn(t * 2, 0, c, d) * .5 + b;
		else return Tween.bounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
}
