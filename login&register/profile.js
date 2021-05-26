function checkCookie() {
    var username = "";
    if (getCookie("user_id") == false) {
        window.location = "login.html";
    }
}
function getCookie(name) {
    var value = "";
    try {
        value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
        return value
    } catch (err) {
        return false
    }
}
checkCookie();
window.onload = pageLoad;
function pageLoad() {
    //menubar
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]
    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    getprofile_user();
    document.getElementById('save_btn').onclick = profile_update;

    const user_id=getCookie('user_id');
    document.getElementById('user_id').innerHTML=user_id;

    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error") == 1) {
		alert("E-mailนี้ถูกใช้งานแล้ว");
	}
}

const getprofile_user = (async () => {
    await fetch('/profile_user').then((response) => {
        response.json().then((data) => {
            console.log(data);
            document.getElementById("firstname").value = data[0].name;
            document.getElementById("lastname").value = data[0].lastname;
            document.getElementById("mail").value = data[0].mail;
            document.getElementById("tell").value = data[0].tell;
            document.getElementById("linkFB").value = data[0].linkFB;
            document.getElementById("password").value = data[0].password;
        }).catch((err) => {
            console.log(err);
        })
    })
})
// const profile_update = (async (newdata) => {
//     await fetch("/editprofile", {
//         method: "POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             firstname: document.getElementById("firstname").value,
//             lastname: document.getElementById("lastname").value,
//             mail: document.getElementById("mail").value,
//             tell: document.getElementById("tell").value,
//             linkFB: document.getElementById("linkFB").value,
//             password: document.getElementById("password").value
//         })
//     }).then((response) => {
//         response.json().then((data) => {
//             alert(data);
//         });
//     }).catch((err) => {
//         alert(err);
//     });
// })