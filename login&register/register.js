const toggleButton = document.getElementsByClassName('toggle-button')[0]
const nav = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
	nav.classList.toggle('active');
})

window.onload = pageLoad;

function pageLoad() {
	var submit_btn = document.getElementById("submit_btn");
	submit_btn.onclick = checkpassword;
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error") == 1) {
		alert("This e-mail is already used!");
	}
}

function checkpassword(){ //check pass&repass
	var pass=document.forms["registerform"]["password"].value;
	var re_pass=document.forms["registerform"]["re_password"].value;
	if (pass !== re_pass) {  
		alert("password and confirm password are not match!");
        return false;  
    }
}
