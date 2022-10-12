// 请求当前购物车商品 查看购物车
(function() {
	// var oMain = document.querySelector('.main');
	var oPriceSum = document.querySelector('.price-sum');

	myAjax.post(baseURL + '/api_cart', {
		status: 'viewcart',
		userId: TOKEN
	}, function(res) {

		if (res.code != 0) {
			console.log(res);
			return;
		};
		// 从本地存储goods拿数据
		// 用户选择结算哪个就显示多少价格
		var oPriceNo = document.querySelector('.priceNo');
		var oShowPrice = document.querySelector('#show_price');
		var cartList = res.data;
		var GOODSID = localStorage.getItem('goods');
		var arr = GOODSID.split('&');
		var str = '';
		var priceAll = 0;
		if (GOODSID) {
			for (var i = 0; i < cartList.length; i++) {
				for (var j = 0; j < arr.length; j++) {
					if (arr[j] == cartList[i].goods_id) {
						priceAll += cartList[i].goods_number * cartList[i].price;
						oShowPrice.innerHTML = priceAll;
					};
				};
			};
		};
	});
})();
