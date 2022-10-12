// 获取省市区，做交互
(function() {

	var oProvince = document.querySelector('.province');
	var oCity = document.querySelector('.city');
	var oArea = document.querySelector('.area');
	var oTakename = document.querySelector('.takename');
	var oTel = document.querySelector('.tel');
	var oDetail = document.querySelector('.detail-adderss');
	var oSaveAddress = document.querySelector('.save-address');
	var oAddressList = document.querySelector('.address-list');

	// 省份
	var province = null;
	// 编辑变量
	var editAddressId = '';

	//获取省
	function getCountry(ele, msg, data) {

		myAjax.get(baseURL + '/api_country', data, function(res) {
			if (res.code != 0) {
				console.log(res);
				// oProvince.innerHTML = '<option>--省--</option>';
				oCity.innerHTML = '<option>--市--</option>';
				oArea.innerHTML = '<option>--区--</option>';
				return;
			};

			// console.log(res); //  //
			var listArr = res.data.area || res.data;

			// 渲染省
			var str = `<option value="">${msg}</option>`;
			for (var i = 0; i < listArr.length; i++) {
				str += `<option value="${listArr[i].name}">${listArr[i].name}</option>`
			};

			ele.innerHTML = str;
		});

	};

	getCountry(oProvince, '--省--', {});

	oProvince.onchange = function() {
		province = this.value;
		// 获取市
		getCountry(oCity, '----所在市----', {
			province: province
		});
	};

	oCity.onchange = function() {
		// console.log(this.value);
		// 获取市
		getCountry(oArea, '----所在区----', {
			province: province,
			city: this.value
		});
	};

	//获取当前用户地址列表
	myAjax.post(baseURL + '/api_address', {
		status: 'getAddress',
		userId: TOKEN
	}, function(res) {
		if (res.code != 0) {
			console.log(res);
			return;
		};

		var addressList = [];

		function renderAddress(res) {
			addressList = res.data;
			// 数据结构重组 [1, 3, 4, 5]
			for (var j = 0; j < addressList.length; j++) {
				if (addressList[j].isDefault) {
					//下标j
					addressList.unshift(addressList.splice(j, 1)[0]);
					break;
				};
			};

			// 渲染地址列表
			var str = '';
			for (var i = 0; i < addressList.length; i++) {
				str += `
					<li data-address-id="${addressList[i].address_id}" class="${addressList[i].isDefault ? 'addressActive' : ''}">
						<p><span class="username">${addressList[i].takename}</span><span class="tel">${addressList[i].tel}</span></p>
						<p>${addressList[i].province}、${addressList[i].city}、${addressList[i].district}</p>
						<p>${addressList[i].streetname}</p>
						<p class="edit"><span data-address-id="${addressList[i].address_id}" class="default-btn">${addressList[i].isDefault ? '默认地址' : '设为默认'}</span><span class="edit-btn" data-address-id="${addressList[i].address_id}">编辑</span><span class="del-btn" data-address-id="${addressList[i].address_id}">删除</span></p>
					</li>	
				`;
			};
			// 添加
			oAddressList.innerHTML = str;
			// oAddressList.innerHTML += oAddressList.innerHTML;
			// addresslun();
		};
		renderAddress(res);

		// 对地址列表的交互
		oAddressList.onclick = function(event) {

			// 点击设置默认地址
			if (event.target.className == 'default-btn') {
				// 发起请求
				myAjax.post(baseURL + '/api_address', {
					status: 'defaultAddress',
					userId: TOKEN,
					addressId: event.target.getAttribute('data-address-id')
				}, function(res) {
					// console.log(res);
					if (res.code != 0) {
						console.log(res);
						return;
					};

					// 重新渲染
					renderAddress(res);

				});
			};

			// 点击删除按钮
			if (event.target.className == 'del-btn') {
				myAjax.post(baseURL + '/api_address', {
					status: 'deleteAddress',
					userId: TOKEN,
					addressId: event.target.getAttribute('data-address-id')
				}, function(res) {
					if (res.code != 0) {
						console.log(res);
						return;
					};

					// 修改页面DOM
					var li = event.target.parentNode.parentNode;
					li.parentNode.removeChild(li);
				});
			};

			//点击编辑按钮
			if (event.target.className == 'edit-btn') {
				// 把当前数据绑定到下面的表单元素
				var adsId = event.target.getAttribute('data-address-id');
				// 信号给了
				editAddressId = adsId;
				for (var k = 0; k < addressList.length; k++) {
					if (addressList[k].address_id == adsId) {
						oTakename.value = addressList[k].takename;
						oTel.value = addressList[k].tel;
						oDetail.value = addressList[k].streetname;
						break;
					};
				};
			}
		};

	});

	// 点击保存地址
	oSaveAddress.onclick = function() {
		var province = oProvince.value;
		var city = oCity.value;
		var district = oArea.value;
		var streetname = oDetail.value;
		var takename = oTakename.value;
		var tel = oTel.value;

		if (takename == '') {
			alert('收货姓名不能为空');
			return;
		};

		if (tel == '') {
			alert('手机号不能为空');
			return;
		};

		if (!/^1[3456789]\d{9}$/g.test(tel)) {
			alert('请输入正确的手机号');
			return;
		}

		if (streetname == '') {
			alert('详细地址不能为空');
			return;
		};

		if (province == '' || city == '' || district == '') {
			alert('省市区不能为空');
			return;
		};

		console.log(province, city, district, streetname, takename, tel)

		var objAdd = {
			status: 'addAddress',
			userId: TOKEN,
			province: province,
			city: city,
			district: district,
			streetname: streetname,
			takename: takename,
			tel: tel
		}


		//要判断是编辑还是新地址
		console.log(editAddressId);
		if (editAddressId) {

			//先删除后台原ID地址，再删除成功之后，才能添加
			myAjax.post(baseURL + '/api_address', {
				status: 'deleteAddress',
				userId: TOKEN,
				addressId: editAddressId
			}, function(res) {
				if (res.code != 0) {
					console.log(res);
					return
				};
				// 要加删除原来的DOM结构
				var li = document.querySelector(`li[data-address-id="${editAddressId}"]`);
				li.parentNode.removeChild(li);

				// 新加地址
				addAddresss();
			});
		} else {
			// 新加地址
			addAddresss();
		};

		// 新加地址方法
		function addAddresss() {
			myAjax.post(baseURL + '/api_address', objAdd, function(res) {
				// console.log(res);
				if (res.code != 0) {
					console.log(res);
					return;
				};

				var li = document.createElement('li');
				li.setAttribute('data-address-id', res.data[0].address_id);
				li.className = res.data[0].isDefault ? 'addressActive' : '';
				li.innerHTML = `		
					<p><span class="username">${res.data[0].takename}</span><span class="tel">${res.data[0].tel}</span></p>
					<p>${res.data[0].province}、${res.data[0].city}、${res.data[0].district}</p>
					<p>${res.data[0].streetname}</p>
					<p class="edit"><span data-address-id="${res.data[0].address_id}" class="default-btn">${res.data[0].isDefault ? '默认地址' : '设为默认'}</span><span class="edit-btn" data-address-id="${res.data[0].address_id}">编辑</span><span class="del-btn" data-address-id="${res.data[0].address_id}">删除</span></p>
				`

				oAddressList.appendChild(li);
				oProvince.value = '';
				oCity.value = '';
				oArea.value = '';
				oDetail.value = '';
				oTakename.value = '';
				oTel.value = '';

			});
		};

	};



	// 地址轮播

	function addresslun() {
		var oAddressList = document.querySelector('.address-list');
		var aLi = document.querySelectorAll('.address-list>li');
		var oPrev = document.querySelector('.prev');
		var oNext = document.querySelector('.next');


		//添加障眼元素  innerHTML
		// oAddressList.innerHTML += oAddressList.innerHTML;

		// 设置ul的宽
		// var liW = fetchComputedStyle(aLi[0], 'width');
		// oAddressList.style.width = liW * aLi.length + 'px';
		// console.log(liW);
		//获取li的度
		// var step = fetchComputedStyle(aLi[0], 'width');
		// console.log(aLi.length);
		// 元素运动一次时长
		var time = 500;

		//全局信号量
		var n = 0;

		//点击下一张
		oNext.onclick = function() {
			//节流
			if (oAddressList.lock) {
				return
			};
			//调用设置的方法
			play();
		};

		//点击上一张
		oPrev.onclick = function() {
			// 节流
			if (oAddressList.lock) {
				return;
			};
			// 累减
			n--;

			//后验证
			if (n < 0) {
				//设置信号量为最后一个
				n = aLi.length / 2;
				// 拉回
				oAddressList.style.left = -n * 227 + 'px';
				// console.log(oAddressList.style.left);
				//累减一下
				n--;
			};

			//再运动
			run(oAddressList, {
				left: -n * 227
			}, time, 'sineEaseIn');
		};

		//封装
		function play() {
			//累加
			n++;
			//设置元素运动 先运动
			run(oAddressList, {
				left: -n * 227
			}, time, 'sineEaseIn', function() {
				//再验证
				if (n >= aLi.length / 2) {
					// 拉回
					n = 0;
					this.style.left = '0px';
				};
			});
		}
	};
})();
// 获取商品渲染
(function() {
	// 获取goodsId
	var goodsId = localStorage.getItem('goods').split('&');
	var oCartListCon = document.querySelector('.cartListCon');
	var oSettleList = document.querySelector('.settle-list');
	var oDjqRight = document.querySelector('.djq-right');

	for (var i = 0; i < goodsId.length; i++) {
		myAjax.get(baseURL + '/api_goods', {
			goodsId: goodsId[i]
		}, function(res) {
			// console.log(res);
			if (res.code != 0) {
				console.log(res);
				return;
			};
			// 调用订单详情方法
			ddxq();
		})
	};

	// 封装一个订单详情方法
	function ddxq() {
		myAjax.post(baseURL + '/api_cart', {
			status: 'viewcart',
			userId: TOKEN
		}, function(res) {
			// console.log(res);
			if (res.code != 0) {
				console.log(res);
				return;
			};
			var ddList = res.data;
			var GOODSID = localStorage.getItem('goods');
			var arr = GOODSID.split('&');
			var str = '';
			var priceAll = 0;
			if (GOODSID) {
				for (var i = 0; i < ddList.length; i++) {
					for (var j = 0; j < arr.length; j++) {
						if (arr[j] == ddList[i].goods_id) {
							str += ` <li>
							<div class="imgCon"><img src="${ddList[i].goods_thumb}">
							</div>
							<div class="infoCon">
								<span class="brandname">
									${ddList[i].goods_name}
									<br>
									<span>数量:套装;</span>
								</span>
								<span class="brandnum">${ddList[i].goods_number}</span>
								<span class="brandprice">
									¥${ddList[i].goods_number * ddList[i].price}
								</span>
							</div>
						</li>`;
							// 添加到页面
							oSettleList.innerHTML = str;
							// 结算
							var oHda = document.querySelector('.hd-a>i');
							priceAll += ddList[i].goods_number * ddList[i].price;
							console.log(priceAll);
							oHda.innerHTML = priceAll;
						};
					};
				};
			};
		})
	};
})();
