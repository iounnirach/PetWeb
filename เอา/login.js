const toggleButton  = document.getElementsByClassName('toggle-button')[0]
const nav = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
})

window.onload = loginLoad;
function loginLoad() {
	var my_Login = document.getElementById("myLogin");
	my_Login.onsubmit = checkLogin;
}

function checkLogin() {
	//ถ้าตรวจสอบแล้วพบว่ามีการ login ไม่ถูกต้อง ให้ return false ด้วย
	const urlToGet = new URLSearchParams(window.location.search);
	const email = urlToGet.get('email');
	const password = urlToGet.get('password');
	var email_login = document.forms['myLogin']['email'].value;
	var password_login = document.forms['myLogin']['password'].value;

	if ((email == email_login) && (password == password_login)) {
		alert("Success!")
	}
	else {
		alert("Your username or password is not correct");
		return false;
	}
}

