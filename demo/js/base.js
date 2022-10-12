// 全局变量
var baseURL = 'http://159.75.89.136:3000';
// 获取当前用户登录
var TOKEN = window.localStorage.getItem('token');

// 验证登录状态
(function() {

	var oLoginBtn = document.querySelector('.login-btn');
	var oRegBtn = document.querySelector('.reg-btn');
	var oWelcome = document.querySelector('.welcome');
	var oLoginOut = document.querySelector('.login-out');
	var oCartBtn = document.querySelector('.cart-btn');

	loginStatus();

	function loginStatus() {
		// 获取本地存储
		var TOKEN = window.localStorage.getItem('token');
		var USERNAME = window.localStorage.getItem('username');

		if (!TOKEN) {
			oLoginBtn.style.display = 'block';
			oRegBtn.style.display = 'block';
			oWelcome.style.display = 'none';
			oLoginOut.style.display = 'none';
		} else {
			oLoginBtn.style.display = 'none';
			oRegBtn.style.display = 'none';
			oWelcome.style.display = 'block';
			oWelcome.innerHTML = '欢迎，' + USERNAME;
			oLoginOut.style.display = 'block';
		};
	};

	// 点击退出
	oLoginOut.onclick = function() {
		// 清除本地存储
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		//loginStatus();
		// 跳转到登录
		window.location.href = 'login-user.html';
	};

	// 点击购物车
	oCartBtn.onclick = function() {
		var TOKEN = window.localStorage.getItem('token');
		if (TOKEN) {
			window.location.href = 'shop_cart.html';
		} else {
			alert('请登录');
		};
	};

	// 点击 登录
	oLoginBtn.onclick = function() {
		// 获取当前页面地址栏参数 goodsId catId
		var goodsId = getUrlVal('goodsId');
		var catId = getUrlVal('catId');
		if (goodsId) {
			location.href = 'login-user.html?goodsId=' + goodsId;
		} else if (catId) {
			location.href = 'login-user.html?catId=' + catId;
		} else {
			location.href = 'login-user.html';
		}
	}
})();

// 分类导航板块
(function() {
	var oSubstorel = document.querySelector('.substore-l');

	var oNavTem = document.querySelector('#nav-template').innerHTML;
	// 发起请求，请求导航分类的数据
	myAjax.get(baseURL + '/api_cat', {}, function(res) {
		// 验证数据
		if (res.code != 0) {
			console.log(res);
			return;
		};
		//代码运行到这一行，证明数据获取成功；
		var str = '';
		// 拿到数据拼装渲染到页面
		for (var i = 0; i < res.data.length; i++) {
			str +=
				`<li class="substore-l-1"><img class="substore-l-2" src="${res.data[i].cat_img}" alt=""><a class="jiaju" href="classify.html?catId=${res.data[i].cat_id}"  target="_blank">${res.data[i].cat_name}</a></li>`;
		};
		// 添加到页面
		oSubstorel.innerHTML = str;
	})
})();

// 返回顶部
(function() {
	var oFanhui = document.querySelector('.fanhui');
	// 监听页面卷动事件
	document.onscroll = function() {
		var scrollTop = document.documentElement.scrollTop;
		if (scrollTop >= 500) {
			// 显示按钮
			oFanhui.style.display = 'block';
		} else {
			oFanhui.style.display = 'none';
		};
	};
	var timer;
	// 点击 返回顶部 
	oFanhui.onclick = function() {
		// 闪现
		document.documentElement.scrollTop = 0;
	};
})();


headCart();
// 封装头部购物车方法
function headCart() {
	var oSubshop = document.querySelector('.subshop');
	var oSubshopUp = document.querySelector('.subshop-up');
	var oAddshop = document.querySelector('.add-shop');
	myAjax.post(baseURL + '/api_cart', {
		status: 'viewcart',
		userId: TOKEN
	}, function(res) {
		// console.log(res);
		if (res.code != 0) {
			console.log(res);
			return;
		};
		var cartList = res.data;
		if (cartList.length != 0) {
			var str7 = '';
			for (var i = 0; i < cartList.length; i++) {
				str7 += `<div class="subshop-down">
								<div class="down-1">
									<a href="" ">
										<img src="${cartList[i].goods_thumb}" alt="">
									</a>
									<div class="down-2">
										<p><a href="pro_center.html?goodsId=${cartList[i].goods_id}">${cartList[i].goods_name}</a></p>
										<p class="size">尺寸:200*230cm;款式:夏季轻薄款;</p>
										<div class="number-1">
											数量：${cartList[i].goods_number}
											<p class="price-1">¥${cartList[i].goods_number * cartList[i].price}</p>
										</div>
									</div>
								</div>
							</div>
							`;
			};
			oSubshop.innerHTML = str7 +
				'<a class="chakan-shop" href="shop_cart.html" target="_blank">查看我的购物车</a>';
			oSubshopUp.style.display = 'none';
			oAddshop.style.display = 'none';
			return;
		};
	})
};
