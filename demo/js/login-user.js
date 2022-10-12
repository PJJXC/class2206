// 全局变量
var baseURL = 'http://159.75.89.136:3000';
var oLoginBtn = document.querySelector('.login-btn');
var oUsername = document.querySelector('.username');
var oPwd = document.querySelector('.pwd');
var oBackGround = document.querySelector('.background');
var oForm = document.querySelector('.login-user-form');

// 点击登录按钮
oLoginBtn.onclick = function() {
	var username = oUsername.value;
	var pwd = oPwd.value;
	// 验证非空
	if (username == '' || pwd == '') {
		oBackGround.style.display = 'block';
		oBackGround.innerHTML = '用户名或密码不能空!!!'
		oForm.style.opacity = 0.3;
		return;
	};
	// 验证规则 前端验证给后端减轻压力

	//发起请求 登录
	myAjax.post(baseURL + '/api_user', {
		status: 'login',
		username: username,
		password: pwd
	}, function(res) {

		console.log(res);
		if (res.code != 0) {
			oBackGround.style.display = 'block';
			oBackGround.innerHTML = '用户名或密码错误!!!'
			oForm.style.opacity = 0.3;
			return;
		};
		//登录成功  考虑到登录状态  持久性 本地存储信息
		localStorage.setItem('token', res.user_id);
		localStorage.setItem('username', res.username);

		//跳转首页还是跳转到其它
		//获取当前页面地址栏参数 goodsId catId
		var goodsId = getUrlVal('goodsId');
		var catId = getUrlVal('catId');
		if (goodsId) {
			location.href = 'pro_center.html?goodsId=' + goodsId;
		} else if (catId) {
			location.href = 'classify.html?catId=' + catId;
		} else {
			location.href = 'index.html';
		};

	});
};
// 点击提示框里 提示框显示
oBackGround.onclick = function() {
	oBackGround.style.display = 'none';
	oForm.style.opacity = 1;
};
