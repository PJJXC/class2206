(function() {
	var goodsId = getUrlVal('goodsId');
	var oTupian = document.querySelector('.tupian');
	var oTulist2 = document.querySelector('.tu-list2');
	var oBig = document.querySelector('.big');
	var oMain2m = document.querySelector('.main-2-m');
	var oMain2r = document.querySelector('.main-2-r');
	var oLucky = document.querySelector('.lucky');
	var oCat1 = document.querySelector('.cat-1');
	// 请求当前商品详情
	myAjax.get(baseURL + '/api_goods', {
		goodsId: goodsId
	}, function(res) {
		console.log(res);
		if (res.code != 0) {
			return;
		};
		// 清除brand数据下的url""
		function clearUrl(str) {
			return str.replace(/url\('([^']+)'\)/g, function(match, $1) {
				return $1;
			});
		};
		// 渲染页面
		// 大图
		var str = '';
		str += `<img class="tu"src="${clearUrl(res.data[0].banner[0])}">
		<div class="slide" style="position: absolute;left: 0 px;top: 0 px;"></div>`;
		// 覆盖商品
		oTupian.innerHTML = str;

		// 轮播小图
		var str2 = '';
		for (var i = 0; i < res.data[0].banner.length; i++) {
			str2 += `
					<li>
						<img class="tu1"src="${clearUrl(res.data[0].banner[i])}" alt="">
					</li>
				`;
		};
		// 覆盖商品
		oTulist2.innerHTML = str2;
		oTulist2.innerHTML += oTulist2.innerHTML;

		// 调用小图轮播方法
		fo();

		// 放大镜大图
		var str6 = '';
		str6 += `<img class="big-img" src="${clearUrl(res.data[0].banner[0])}"/>`;
		// 覆盖商品
		oBig.innerHTML = str6;

		// 最大图
		var strDetail = '';
		for (var i = 0; i < res.data[0].product_banner.length; i++) {
			strDetail += `<img src="${res.data[0].product_banner[i]}" />`;
		};
		oLucky.innerHTML = strDetail;

		// 调用放大镜方法
		foo();

		// 中间品牌
		var str3 = '';
		str3 += `
				<div class="love">${res.data[0].star_number}</div>
				<div class="cat"><a href="">${res.data[0].brand_name}</a></div>
				<div class="headset">${res.data[0].goods_name}</div>
				<div class="price">价格:<span>¥${res.data[0].price}</span></div>
				<div class="free">
					<span class="free-1">免运费</span>
					<span class="free-2">正版授权</span>
				</div>
				<div class="color">
					<div class="color-1">颜色:</div>
					<div class="color-2">
						<div class="color-3">
							<div class="color-4">
								<img src="${clearUrl(res.data[0].banner[0])}" alt="">
							</div>
							<div class="name color-5">
								<p>粉色（RICO联名款）</p>
							</div>
						</div>
						<div class="name-1">
							<div class="name-2">
								<img src="${clearUrl(res.data[0].banner[1])}" alt="">
							</div>
							<div class="name">
								<p>幸运粉</p>
							</div>
						</div>
						<div class="name-1">
							<div class="name-2">
								<img src="${clearUrl(res.data[0].banner[2])}" alt="">
							</div>
							<div class="name">
								<p>纯真白</p>
							</div>
						</div>
					</div>
				</div>
				<div class="amount">数量:
					<div class="mopt">
						<span class="reduce">-</span>
						<span class="count">1</span>
						<span class="add">+</span>
					</div>
				</div>
				<div class="out">
					<a href="" class="out-1">立即购买</a>	
				</div>
				<div class="shopping">
					<input type="button" class="shopping-1" value="加入购物车">
					<input type="button" class="shopping-2" value="分享">
				</div>`
		oMain2m.innerHTML = str3;

		// 调入加车方法事件
		getAddGoods();
		headCart();

		// 猜你喜欢
		var str4 = '';
		for (var i = 0; i < res.data[0].lc_recommend.length - 1; i++) {
			str4 += `<div class="like">猜你喜欢</div>
					<div class="like-1">
						<a href="">
							<img src="${clearUrl(res.data[0].banner[i])}" alt="">
						</a>
						<a href="">
							<div class="like-2">${res.data[0].lc_recommend[i]}</div>
						</a>
						<div class="pai">派美特</div>
						<div class="money">
							<div class="money-1">￥469</div>
						</div>
					</div>`
			oMain2r.innerHTML = str4;
		}

		// 品牌简介
		var str5 = '';
		str5 += `
          <div class="cat-2">${res.data[0].lc_recommend[4]}</div>`
		oCat1.innerHTML = str5;
	});
	// 封装小图轮播方法
	function fo() {
		var oMain2l = document.querySelector('.main-2-l');
		var oTulist2 = document.querySelector('.tu-list2');
		// var oTu = document.querySelector('.tu');
		var aLi = document.querySelectorAll('.tu-list2>li');
		var oPrev = document.querySelector('.prev');
		var oNext = document.querySelector('.next');
		// var oBigImg = document.querySelector('.big-img');

		// // 设置ul的宽
		var liW = fetchComputedStyle(aLi[0], 'width');
		// console.log(liW);
		oTulist2.style.width = liW * aLi.length + 'px';
		// 获取li的度
		// var step = fetchComputedStyle(aLi[0], 'width');
		// // // 元素运动一次时长
		// console.log(step);
		// console.log(aLi.length);
		var time = 500;
		//全局信号量
		var n = 0;
		//点击上一张
		oPrev.onclick = function() {
			//节流
			if (oTulist2.lock) {
				return
			};
			//调用设置的方法
			play2();
		};
		//点击下一张
		oNext.onclick = function() {
			//节流
			if (oTulist2.lock) {
				return
			};
			//调用设置的方法
			play1();
		};
		// 自动播放
		// var timer = setInterval(play1, 2000);

		// // 鼠标移入
		// oMain2l.onmouseover = function() {
		// 	clearInterval(timer);
		// };
		// // 鼠标移出
		// oMain2l.onmouseout = function() {
		// 	timer = setInterval(play1, 2000);
		// };
		//封装下一张
		function play1() {
			//累加
			n++;
			//设置元素运动 先运动
			run(oTulist2, {
				left: -n * 70
			}, time, 'linear', function() {
				//再验证
				if (n >= aLi.length / 2) {
					// 拉回
					n = 0;
					this.style.left = '0px';
				};
			});
		};
		// 封装上一张
		function play2() {
			// 累减
			n--;
			//先验证
			if (n < 0) {
				// 拉回
				n = aLi.length / 2;
				oTulist2.style.left = -n * 70 + 'px';
				// console.log(n);
				n--;
			}
			//再运动
			run(oTulist2, {
				left: -n * 70
			}, time, 'linear')
		};
	};

	// 封装放大镜方法
	function foo() {
		var oMain2 = document.querySelector('.main-2');
		var oMain2l = document.querySelector('.main-2-l');
		var oTupian = document.querySelector('.tupian');
		var oSlide = document.querySelector('.slide');
		var oTu = document.querySelector('.tu');
		var aLi = document.querySelectorAll('.tu-list2>li');
		var oBig = document.querySelector('.big');
		var oBigImg = document.querySelector('.big-img');

		// 在tupian上面移动
		oTupian.onmousemove = function(event) {
			var x = event.clientX - oMain2.offsetLeft - oSlide.offsetWidth / 2;
			var y = event.clientY - oMain2.offsetTop - oSlide.offsetHeight / 2;
			// console.log()
			// 设置范围
			if (x <= 0) {
				x = 0
			};
			if (y <= 0) {
				y = 0
			};
			// console.log(oSlide.clientWidth);
			var maxWH = oTupian.clientWidth - oSlide.offsetWidth;
			if (x >= maxWH) {
				x = maxWH
			};
			if (y >= maxWH) {
				y = maxWH
			};
			// 设置
			oSlide.style.left = x + 'px';
			oSlide.style.top = y + 'px';
			// 同时操作右边大图
			// console.log(oBigImg.offsetWidth);
			// 求比例   oSmall.clientWidth - oSlide.offsetWidth
			var bili = (oBigImg.offsetWidth - oBig.clientWidth) / (oTupian.clientWidth - oSlide
				.offsetWidth);
			oBigImg.style.left = -x * bili + 'px';
			oBigImg.style.top = -y * bili + 'px';
			// console.log(oBigImg.style.left);
			// console.log(oBigImg.style.top);
		};
		// 批量监听
		for (var i = 0; i < aLi.length; i++) {
			aLi[i].onmouseover = function() {
				// 拿到当前img的src值
				// console.log(this.childNodes);
				// console.log(this.firstElementChild.src);
				var nowSrc = this.firstElementChild.getAttribute('src');
				// console.log(nowSrc);
				oTu.src = nowSrc;
				oBigImg.src = nowSrc;
			};
		};
		// 移入移出
		oTupian.onmouseenter = function() {
			oSlide.style.display = 'block';
			oBig.style.display = 'block';
		};
		oTupian.onmouseleave = function() {
			oSlide.style.display = 'none';
			oBig.style.display = 'none';
		};
	};

	// 封装加车方法
	function getAddGoods() {
		var oShpping1 = document.querySelector('.shopping-1');
		var oOut1 = document.querySelector('.out-1');

		var oRedBtn = document.querySelector('.reduce');
		var oCount = document.querySelector('.count');
		var oAddBtn = document.querySelector('.add');
		// 数量
		var count = 1;
		oCount.innerHTML = count;

		// 数量加减
		oRedBtn.onclick = function() {
			count--;
			count = count < 1 ? 1 : count;
			oCount.innerHTML = count;
		};

		oAddBtn.onclick = function() {
			count++;
			count = count >= 10 ? 10 : count;
			oCount.innerHTML = count;
		};


		// 事件监听
		oShpping1.onclick = function() {
			// 验证用户登录状态
			var TOKEN = localStorage.getItem('token');
			//跳转登录
			if (!TOKEN) {
				alert('请先登录');
				location.href = 'login-user.html?goodsId=' + goodsId;
				return;
			};

			// 加入购物车接口
			myAjax.post(baseURL + '/api_cart', {
				status: 'addcart',
				userId: TOKEN,
				goodsId: goodsId,
				goodsNumber: count
			}, function(res) {
				if (res.code != 0) {
					alert('加入购物车失败');
					console.log(res);
					return;
				};
				alert('加入购物车成功');
				// 头部要渲染此商品
				// 手动去购物车查看
				headCart();
			})
		};

	};
})();
