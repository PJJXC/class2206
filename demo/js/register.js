var baseURL = 'http://159.75.89.136:3000';

var oUserName = document.querySelector('.username');
var oPwd = document.querySelector('.pwd');
var oRegCode = document.querySelector('.regcode');
var userMsg = document.querySelector('.user-msg');
var pwdMsg = document.querySelector('.pwd-msg');
var labelMsg = document.querySelector('.label-msg');
var registerBtn = document.querySelector('.register-btn');

// 设定 用户名 和 密码 的一个状态
var isUsername = false;
var isPwd = false;
var isRegcode = false;

function isDisabled() {
	if (isUsername && isPwd && isRegcode) {
		registerBtn.disabled = false;
	} else {
		registerBtn.disabled = true;
	}
};


//验证用户名
oUserName.onblur = function() {
	//oUserName.onkeyup = function(){
	//获取它的值 ，进行正则校验 
	//只能是数字  从开始到结束只能是11位数字 
	//必须是1开头  11088888888
	//第二位 3456789
	//后面的9位只要是数字组成
	var res = /^1[3456789]\d{9}$/g;
	var userName = this.value;

	if (userName == '') {
		usernameMsg('block', '手机号不能为空', 'red');
		isUsername = false;
		isDisabled();
		return;
	};

	if (!res.test(userName)) {
		usernameMsg('block', '手机号必须由11位数字组成', 'red');
		isUsername = false;
		isDisabled()
		return;
	};
	//前端验证通过，还要请求后台手机号是否可用
	myAjax.post(baseURL + '/api_user', {
		username: userName,
		status: 'check'
	}, function(res) {
		if (res.code != 0) {
			usernameMsg('block', '手机号已存在', 'red');
			isUsername = false;
			isDisabled()
			return;
		};
		usernameMsg('block', '手机号可用', 'black');
		isUsername = true;
		isDisabled();
	});
};
// 验证验证码
var oAuth = document.querySelector('#auth');

function createCode() { //创建验证码函数
	//定义一个数组存26个字母
	var arrLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
		't', 'u', 'v', 'w', 'x', 'y', 'z'
	];
	//定义一个数组存数字
	var arrNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	//将两个数组合并
	var arrCode = arrLetter.concat(arrNum);
	//定义一个数组存六位的验证码
	var code = [];
	for (var j = 0; j < 3; j++) {
		//声明一个变量存从arrCode取的一个随机的字符（用下标来找）
		var randomindex = Math.floor(Math.random() * arrCode.length);
		code[j] = arrCode[randomindex];
		//再将每一个获取的元素添加到code中             
		code.push(code[j]);
	}
	//将验证码数组分割成字符串并返回
	var newCode = code.join("");
	return newCode;
}
//点击按钮刷新验证码，直接刷新整个页面也可刷新验证码 
function downChange() {
	//调用函数生成验证码    
	oAuth.innerHTML = createCode();
}
oAuth.innerHTML = createCode();

oRegCode.onblur = function() {
	var res = /^[0-9a-zA-Z]{4}$/g;
	var regcode = this.value;

	if (regcode == '') {
		regcodeMsg('block', '验证码不能为空', 'red');
		isRegcode = false;
		isDisabled();
		return;
	};
	if (regcode != oAuth.innerHTML) {
		regcodeMsg('block', '验证码错误', 'red');
		isRegcode = false;
		isDisabled();
		return;
	};
	regcodeMsg('block', '验证码正确', 'black');
	isRegcode = true;
	isDisabled()
};

//验证密码
oPwd.onkeyup = function() {
	var pwd = this.value;
	if (pwd == '') {
		passwordMsg('block', '密码不能为空', 'red');
		isPwd = false;
		isDisabled();
		return;
	};

	var pwdReg = /^[0-9]{6,20}$/g;
	if (!pwdReg.test(pwd)) {
		passwordMsg('block', '密码必须由6~20位数字组成', 'red');
		isPwd = false;
		isDisabled();
		return;
	};
	passwordMsg('block', '密码输入正确', 'black');
	isPwd = true;
	isDisabled()
};

// 点击注册按钮
registerBtn.onclick = function() {
	if (!isPwd || !isUsername) {
		return;
	};
	// 请求注册接口
	myAjax.post(baseURL + '/api_user', {
		username: oUserName.value,
		password: oPwd.value,
		status: 'register'
	}, function(res) {
		//console.log(res);
		if (res.code != 0) {
			console.log(res);
			return;
		};

		// 清空
		oUserName.value = '';
		oPwd.value = '';
		//跳转登录 延迟转  3 2 1...  3秒之后跳转登录
		window.location.href = 'login-user.html';

	});

};

function usernameMsg(dis, msg, color) {
	oUserName.style.borderColor = color;
	userMsg.style.display = dis;
	userMsg.innerHTML = msg;
	userMsg.style.color = color;
};

function regcodeMsg(dis, msg, color) {
	oRegCode.style.borderColor = color;
	labelMsg.style.display = dis;
	labelMsg.innerHTML = msg;
	labelMsg.style.color = color;
};

function passwordMsg(dis, msg, color) {
	oPwd.style.borderColor = color;
	pwdMsg.style.display = dis;
	pwdMsg.innerHTML = msg;
	pwdMsg.style.color = color;
};
