// 请求当前购物车商品 查看购物车
(function() {
	// var oMain = document.querySelector('.main');
	var oTable = document.querySelector('.table');

	myAjax.post(baseURL + '/api_cart', {
		status: 'viewcart',
		userId: TOKEN
	}, function(res) {
		console.log(res);
		if (res.code != 0) {
			console.log(res);
			return;
		};
		var cartList = res.data;
		if (cartList.length == 0) {
			headCart();
			oTable.innerHTML = '<div class="cartmei">' + '<img src="images/23450.png" alt="">' +
				'<div id = "no_goods" >' + '您的购物车还是空的' + ' </div>' + '</div > ';
			return;
		};

		for (var i = 0; i < cartList.length; i++) {
			var tr = document.createElement('tr');
			var str = `
				<td>
					<input class="check" data-goods="${cartList[i].goods_id}" type="checkbox"/>
					<img src="${cartList[i].goods_thumb}"/>
				</td>
				<td class="td">${cartList[i].goods_name}</td>
				<td>
					<span class="reduce" data-goods="${cartList[i].goods_id}">-</span>
					<span class="count">${cartList[i].goods_number}</span>
					<span class="add" data-goods="${cartList[i].goods_id}">+</span>
				</td>
				<td>${cartList[i].price}</td>
				<td>${cartList[i].goods_number * cartList[i].price}</td>
				<td>
					<a href="javascript:;" class="del" data-goods="${cartList[i].goods_id}">删除</a>
				</td>		
			`;
			tr.innerHTML = str;
			oTable.appendChild(tr);
		};

		// 用户操作
		oTable.onclick = function(event) {
			var targetClassName = event.target.className;

			// 验证
			// 点击全选
			if (targetClassName == 'check-all') {
				// 选择所有单选，进行设置
				var aCheck = document.querySelectorAll('.table .check');
				for (var i = 0; i < aCheck.length; i++) {
					aCheck[i].checked = event.target.checked;
				};
				// 调用总价
				getPriceAll();
			};

			// 点击单选
			if (targetClassName == 'check') {
				// 调用总价
				getPriceAll();
			};

			// 点击加减
			if (targetClassName == 'add' || targetClassName == 'reduce') {
				var prevN = null;
				var count = 0;
				if (targetClassName == 'add') {
					prevN = event.target.previousElementSibling;
					count = parseInt(prevN.innerHTML);
					count++;
				} else if (targetClassName == 'reduce') {
					prevN = event.target.nextElementSibling;
					count = parseInt(prevN.innerHTML);
					count--;
				};
				if (count > 10) {
					count = 10;
					return;
				};
				if (count < 1) {
					count = 1;
					return;
				}
				myAjax.post(baseURL + '/api_cart', {
					status: 'addcart',
					userId: TOKEN,
					goodsId: event.target.getAttribute('data-goods'),
					goodsNumber: count
				}, function(res) {
					if (res.code != 0) {
						console.log(res);
						return;
					};

					//dom结构更新 数量
					prevN.innerHTML = count;
					//dom结构更新 小计
					var unitDom = event.target.parentNode.nextElementSibling;
					var subtotalDom = event.target.parentNode.nextElementSibling
						.nextElementSibling;
					subtotalDom.innerHTML = parseFloat(unitDom.innerHTML) * count;

					// 调用总价方法
					getPriceAll();
					headCart();
				})

			};

			// 点击删除
			if (targetClassName == 'del') {
				//调用删除接口
				myAjax.post(baseURL + '/api_cart', {
					status: 'delcart',
					userId: TOKEN,
					goodsId: event.target.getAttribute('data-goods'),
				}, function(res) {
					if (res.code != 0) {
						console.log(res);
						return;
					};
					var trs = event.target.parentNode.parentNode;
					trs.parentNode.removeChild(trs);
					getPriceAll();
					headCart();
				})
			};

		};

		//点击结算按钮
		var oCalculate = document.querySelector('.calculate');
		oCalculate.onclick = function() {
			var aCheck = document.querySelectorAll('.table .check');
			// 使用一个对象存储一下选中的商品
			var goodsArr = [];
			for (var i = 0; i < aCheck.length; i++) {
				if (aCheck[i].checked) {
					goodsArr.push(aCheck[i].getAttribute('data-goods'));
				};
			};
			console.log(goodsArr);
			// 存储到本地
			window.localStorage.setItem('goods', goodsArr.join('&'));
			// 跳转到地址页面
			if (goodsArr.length == 0) {
				alert('请最少选择一件商品');
				return;
			};
			window.location.href = 'settle.html';
		};


	});

	// 封装求总价的方法
	function getPriceAll() {
		//拿到所有的被选择的元素，进行小计之和
		var aCheck = document.querySelectorAll('.table .check');
		var oPriceSum = document.querySelector('.price-sum');
		//console.log();
		var priceAll = 0;
		for (var i = 0; i < aCheck.length; i++) {
			if (aCheck[i].checked) {
				//节点查找，获取小计元素 内容
				priceAll += parseFloat(aCheck[i].parentNode.nextElementSibling.nextElementSibling.nextElementSibling
					.nextElementSibling.innerHTML);
			};
		};
		// 设置总价
		oPriceSum.innerHTML = '良品总价:' + '<span class="line">/</span>' + '<span class="priceNo">' + '￥' +
			'<font id="show_price">' + priceAll + '</font>' + '</span>';
	};
})();
