//获取地址栏属性参数的值 
var keywords = getUrlVal('keywords');

(function() {
	//获取点击跳转到login
	var oLogin = document.querySelector('.login');
	oLogin.onclick = function() {
		location.href = `login-user.html?keywords=${keywords}`;
	}
})();

//人气良品
(function() {
	//获取节点
	var productList = document.querySelector("#product-list");
	var goodsTemplateStr = document.querySelector("#product-template").innerHTML;
	var more = document.querySelector("#product-other");
	//获取地址栏属性参数的值 
	var keyWords = decodeURIComponent(getUrlVal('keywords'));
	//商品数量
	var page = 1;
	var pagesize = 9;
	//刷新页面默认加载第1页的数据
	getHotData(page);
	//调用获取总页数方法
	getMaxCount(keyWords, function(maxCount) {
		//调用分页器
		getPagination(maxCount);
	});

	//获取总页数的方法
	function getMaxCount(keywords, callback) {
		myAjax.ajax({
			type: 'get',
			url: baseURL + '/api_search',
			data: {
				page: page,
				pagesize: pagesize,
				keywords: keywords
			},
			success: function(res) {
				//打印后台数据
				//console.log(res);
				//验证状态码
				if (res.code != 0) {
					console.log('请求错误');
					return;
				};
				//获取当前分类的总页数
				var maxCount = Math.ceil(res.count / pagesize);
				//调用分页器
				callback(maxCount);
			}
		});
	}

	//封装分页器
	function getPagination(maxCount) {
		//调用分页器
		$('.classify-pagination').pagination({
			pageCount: maxCount, //总页数
			current: 1, //当前第几页
			coping: true, //是否开启首页和末页，值为boolean
			mode: 'fixed', //unfixed不固定页码按钮数量，fixed固定数量
			count: 5, //mode为unfixed时显示当前选中页前后页数，mode为fixed显示页码总数
			homePage: '首页',
			endPage: '末页',
			prevContent: '上一页', //上一页
			nextContent: '下一页', //下一页
			keepShowPN: false, //是否一直显示上一页下一页
			isHide: true, //总页数为0或1时隐藏分页控件
			jump: true, //是否开启跳转到指定页数，值为boolean类型
			jumpBtn: '确认', //跳转按钮文本内容
			callback: function(p) {
				//使用实例上的方法
				//p.getCurrent();//获取当前页
				//p.getPageCount();获取总页数
				//p.setPageCount(10);设置总页数
				//调用当前页的请求渲染
				getHotData(p.getCurrent());
			}
		});
		//键盘抬起就把大于总页码输入的页码值永远等于总页码
		/*document.querySelector('.pagination .jump-ipt').onkeyup = function(){
			if(this.value>9){
				this.value=9;
			}
		}*/
	}

	//请求热门商品数据
	function getHotData(page) {
		myAjax.ajax({
			type: 'get',
			url: baseURL + '/api_search',
			data: {
				page: page,
				pagesize: pagesize,
				keywords: keyWords
			},
			success: function(res) {
				//打印后台数据
				//console.log(res);
				//验证状态码
				if (res.code != 0) {
					console.log('请求错误');
					return;
				};
				//获取res对象里面的data对象
				var goodsData = res.data;
				if (goodsData.length == 0) {
					//商品正在上新的路上
					productList.innerHTML = '<img class="nullImage" src="images/nullImg1.jpg" />';
					return;
				}
				//渲染DOM数据页面
				for (var i = 0; i < goodsData.length; i++) {
					var oli = document.createElement('li');
					oli.innerHTML = myCompile(goodsTemplateStr, goodsData[i]);
					//添加到页面去
					productList.appendChild(oli);
				};
				//调用图片预加载方法
				myLoading('.product-image');
			}
		});
	}
	//滚动到底部加载更多
})();
