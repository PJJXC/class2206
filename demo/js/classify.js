// 商品菜单板块
(function() {
	var oOsmcls = document.querySelector('.osm-cls');

	var oNavTem = document.querySelector('#nav-template').innerHTML;
	// 发起请求，请求导航分类的数据
	myAjax.get(baseURL + '/api_cat', {}, function(res) {
		// 验证数据
		if (res.code != 0) {
			console.log(res);
			return;
		};

		for (var i = 0; i < res.data.length; i++) {
			var li = document.createElement('li');
			li.innerHTML =
				`<a href="classify.html?catId=${res.data[i].cat_id}">${res.data[i].cat_name}<span></span></a>`;
			oOsmcls.appendChild(li);
		};
	})
})();


// 分页板块
(function() {
	// 获取当前分类ID
	var catId = getUrlVal('catId');

	var oGoodsList = document.querySelector('.goods-list');

	var page = 1;
	var pageSize = 6;

	getMaxCount(page, pageSize, function(n) {
		// 把总页面传递给分页器
		getPagination(n);
	});

	// 默认要先调用一次当前分类渲染
	getData(page, pageSize);

	//又写一个方法，去请求当前分类数据的总页数
	function getMaxCount(pageVal, pageSizeVal, callback) {
		myAjax.get(baseURL + '/api_goods', {
			page: pageVal,
			pagesize: pageSizeVal,
			catId: catId
		}, function(res) {
			console.log(res);
			if (res.code != 0) {
				// console.log(res);
				return
			};
			// 拿到总页面
			callback(res.page);
		});
	};


	// 商品分类板块
	// 封装商品方法
	function getData(pageVal, pageSizeVal) {
		myAjax.get(baseURL + '/api_goods', {
			page: pageVal,
			pagesize: pageSizeVal,
			catId: catId
		}, function(res) {
			console.log(res);
			if (res.code != 0) {
				// console.log(res);
				return;
			};

			// oK的数据遍历
			var str = '';
			for (var i = 0; i < res.data.length; i++) {
				str += `
						<li>
							<div class="liangpin-2">
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
							<a href="pro_center.html?goodsId=${res.data[i].goods_id}" target="_blank">
								<div class="liangpin-5">
									<img src="images/loading.gif" xc-lazyload="${res.data[i].goods_thumb}">
								</div>
							</a>
							<div class="liangpin-6">
								<div class="liangpin-7">
									<a href="">
									<img src="${res.data[i].brand_thumb}" alt="">
									<span>${res.data[i].brand_name}</span>
									</a>
								</div>
							</div>
						</li>`;

			};
			oGoodsList.innerHTML = str;
			// 调用图片预加载方法
			xcLazyload('.goods-list');
		});
	};
	// // 默认调用一次
	// getHotGoods(pageSize, page);
	// 调用分页器
	function getPagination(maxCount) {
		$('.pagination-content').pagination({
			pageCount: maxCount,
			prevContent: '上一页',
			nextContent: '下一页',
			activeCls: 'pagination-active',
			count: 6,
			mode: 'fixed',
			coping: true,
			homePage: '首页',
			endPage: '尾页',
			isHide: true,
			jump: true,
			jumpBtn: '确认',
			callback: function(p) {
				// console.log(p.getCurrent());
				getData(p.getCurrent(), pageSize);
			}
		});
	};
})();
