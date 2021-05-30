function checkCookie() {
    var hotel_id = "";
    if (getCookie("hotel_id") == false) {
        window.location = "profile.html";
    }
}
function getCookie(hotel_id) {
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
    Showhotel();
    //menubar
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]
    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    document.getElementById("submit_btn").onclick = CreateHotel;
    document.getElementById("cancel_btn").onclick = DeleteHotel;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("error") == 1) {
        alert("คุณมีโรงแรมที่เปิดอยู่แล้ว ถ้าต้องการสร้างใหม่กรุณาปิดบริการโรงแรมเก่าก่อน!");
    }	
}
function goCreate() {
    document.getElementById("myhotel").style.display = "block";//ก่อนหน้านี้noneอยู่
    document.getElementById("ShowHotel").style.display = "none";
}
function CreateHotel() {
    document.getElementById("myhotel").style.display = "none";
    document.getElementById("ShowHotel").style.display = "block";

}
const DeleteHotel = (async () => {
 
    await fetch('/deletehotel').then((response) => {
        response.json().then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    })
    alert("ลบโรงแรมสำเร็จ กรุณาโหลดหน้าอีกครั้งเพื่อคืนค่า");
})
const Showhotel = (async () => {
    await fetch("/showhotel").then((response) => {
        response.json().then((result) => {
            console.log(result);
            document.getElementById("hotel_id").innerHTML = result[0].hotel_id;
            document.getElementById("show_hotel_name").innerHTML = result[0].hotel_name;
            document.getElementById("show_cat_number").innerHTML = result[0].cat_number;
            document.getElementById("show_symptom").innerHTML = result[0].symptom;
            document.getElementById("show_address").innerHTML = result[0].address;
            document.getElementById("show_subdistrict").innerHTML = result[0].subdistrict;
            document.getElementById("show_district").innerHTML = result[0].district;
            document.getElementById("show_province").innerHTML = result[0].province;
            document.getElementById("show_postal_code").innerHTML = result[0].postal_code;
            document.getElementById("show_latitude").innerHTML = result[0].latitude;
            document.getElementById("show_longitude").innerHTML = result[0].longitude;
            document.getElementById("show_hotel_note").innerHTML = result[0].hotel_note;
        }).catch((err) => {
            console.log(err);
        })
    })
})

