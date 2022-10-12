// 轮播图板块
(function() {
	var oBannerL = document.querySelector('#banner-list');
	// var oNavTem = document.querySelector('#nav-template').innerHTML;
	// 获取轮播图数据
	myAjax.get(baseURL + '/api_banner', {
		bannerId: 1
	}, function(res) {
		if (res.code != 0) {
			console.log(res);
			return;
		};

		// 获取成功
		var str = '';
		// 拿到数据拼装渲染到页面
		for (var i = 0; i < res.data.length; i++) {
			// console.log(res.data);
			str +=
				`<a href="pro_center.html?goodsId=${res.data[i].goods_id}" target="_blank"><li class="active"><img src="${res.data[i].goods_thumb}" alt=""></li></a>`;
			if (i == res.data.length - 1) {
				str +=
					`<a href="pro_center.html?goodsId=${res.data[i].goods_id}" target="_blank"><li class="active"><img src="${res.data[0].goods_thumb}" alt=""></li></a>`;
			};
			// str2 += `<span class="current"></span>`
		}
		oBannerL.innerHTML = str;

		banner();
	});

	//封装一个轮播效果的方法
	function banner() {
		var oBanner = document.getElementById('banner');
		var aLi = oBanner.getElementsByTagName('li');
		var oPrev = document.getElementById('prev');
		var oNext = document.getElementById('next');
		var oNumber = document.getElementById('number');
		var aSpan = oNumber.getElementsByTagName('span');

		//全局信号量
		var n = 0;

		// 点击上一张按钮事件
		oPrev.onclick = function() {
			n--;
			//验证
			n = n < 0 ? aLi.length - 1 : n;
			//调用设置方法
			xc();
		};

		//点击下一张按钮事件
		oNext.onclick = btnNext;

		function btnNext() {
			//自增
			n++;
			//验证
			n = n >= aLi.length ? 0 : n;

			//调用设置方法
			xc();
		};
		//点击小圆点
		for (var i = 0; i < aSpan.length; i++) {
			//编号下标
			aSpan[i].idx = i;
			aSpan[i].onclick = function() {
				// 联动
				n = this.idx;
				//调用设置方法
				xc();
			};
		};
		// 自动播放
		var timer = setInterval(btnNext, 3000);

		oBanner.onmouseover = function() {
			// 清除定时器
			clearInterval(timer);
		};
		oBanner.onmouseout = function() {
			// 清除定时器
			timer = setInterval(btnNext, 3000);
		};
		//封装方法
		function xc() {
			//排它
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].className = '';
				aSpan[i].style.background = 'black';
			};
			//设置
			aLi[n].className = 'active';
			aSpan[n].style.background = 'gray';
		};

	};

})();

// 人气良品板块
(function() {

	var oGoodsList = document.querySelector('.goods-list');
	var oMore = document.querySelector('.more');
	var oLoad = document.querySelector('.load');

	var pageSize = 9;
	var page = 2;

	// 锁
	var lock = false;

	// 封装热门商品方法
	function getHotGoods(pageSize, page) {
		myAjax.get(baseURL + '/api_goods', {
			pagesize: pageSize,
			page: page
		}, function(res) {
			// console.log(res);
			if (res.code != 0) {
				console.log(res);
				return;
			};

			// 验证是不是最后一页
			if (res.data.length == 0) {
				oMore.innerHTML = '暂无更多...';
				oLoad.innerHTML = '暂无更多...';
				oLoad.style.display = 'block';
				// 下面点击 按钮 上锁
				lock = true;
				return;
			};
			// console.log(res);


			// 遍历
			for (var i = 0; i < res.data.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = `<div class="liangpin-2">
								<a href="pro_center.html?goodsId=${res.data[i].goods_id}" target="_blank">
									<div class="liangpin-3">
										<i>
											<h1>￥${res.data[i].price}</h1>
										</i>
									</div>
									<div class="liangpin-4">
										<h3>${res.data[i].goods_desc}</h3>
										<p>${res.data[i].goods_name}</p>
									</div>
								</a>
							</div>
							<a href="pro_center.html?goodsId=${res.data[i].goods_id}" target="_blank"">
								<div class="liangpin-5">
									<img src="images/loading.gif" xc-lazyload="${res.data[i].goods_thumb}">
								</div>
							</a>
						<div class="liangpin-6">
							<div class="liangpin-7">
								<a href="">
								<img src="${res.data[i].brand_thumb}" alt="">
								${res.data[i].brand_name}
								</a>
							</div>
						</div>`;
				oGoodsList.appendChild(li);
			};
			// 调用图片预加载方法
			xcLazyload('.goods-list');

			// 开锁
			lock = false;
			// 隐藏交互
			oLoad.style.display = 'none';
		});
	};
	// 默认调用一次
	getHotGoods(pageSize, page);

	// 点击加载更多
	oMore.onclick = function() {
		// 节流
		if (lock) {
			return
		};
		lock = true;

		// 累加页
		page++;
		getHotGoods(pageSize, page);
	}




	// 滚动到底部加载更多
	window.onscroll = function() {

		var pageH = document.body.clientHeight;
		var windowH = window.innerHeight;
		var scrollTop = document.documentElement.scrollTop;

		if ((windowH + scrollTop) / pageH >= 0.97) {
			if (lock) {
				return
			};
			lock = true;
			page++;
			// console.log(page);
			// 设置交互
			oLoad.innerHTML = '加载中....';
			oLoad.style.display = 'block';
			getHotGoods(pageSize, page);
		};
	};
})();
