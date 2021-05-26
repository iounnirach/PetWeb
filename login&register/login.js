const toggleButton  = document.getElementsByClassName('toggle-button')[0]
const nav = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
})

window.onload = pageLoad;

function pageLoad() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error") == 2) {
		alert("กรอกE-mailหรือรหัสผ่านผิด");
	}
	else if (urlParams.get("error") == 3) {
		alert("ไม่สามารถเข้าสู่ระบบได้ กรุณาลงทะเบียน");
	}
}




