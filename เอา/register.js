const toggleButton  = document.getElementsByClassName('toggle-button')[0]
const nav = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
})
window.onload = pageLoad;

function pageLoad() {
    var form = document.getElementById("myForm");
    form.onsubmit = RegisterForm;
    var my_Login = document.getElementById("myLogin");
	my_Login.onsubmit = checkLogin;
}


function RegisterForm() {
    //ถ้าตรวจสอบแล้วว่ามีการ register ไม่ถูกต้องให้ return false ด้วย
    const password = document.forms["myForm"]["password"].value;
    const re_password = document.forms["myForm"]["re_password"].value;

    if (password == re_password) {   
    }
    else {
        alert("password is not correct");
        return false;
    }
checkLogin();
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
    if(password==111){
        alert("111")
    }
	else {
		alert("Your username or password is not correct");
		return false;
	}
}
