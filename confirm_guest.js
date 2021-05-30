window.onload = pageLoad;

function pageLoad() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    getcatnum();
    getdataBooking_guest_confirm();
    document.getElementById("cancel").onclick = delete_dataBooking;
    document.getElementById("confirm").onclick = confirm_dataBooking;
}

async function getcatnum() {
    const response = await fetch("\chack_numcat");
    const content = await response.json()
    showdata_cat(content);
}

function showdata_cat(data) {
    var catnum = document.getElementById("catnumber");
    catnum.innerHTML = data + " ตัว";
    // catnum.innerHTML = [data[key[0]].hotel_name] + " ตัว";
}

async function getdataBooking_guest_confirm() {
    const response = await fetch("\chackdataBooking_guest_confirm");
    const content = await response.json()
    showdataBooking_guest(content);
}

function showdataBooking_guest(data) {
    var normal = document.getElementById("normal_symptom");
    var sick = document.getElementById("sick_symptom");
    var nights = document.getElementById("nights");
    var how_sick = document.getElementById("how_sick");
    var booking_note = document.getElementById("booking_note");
    var start_deal = document.getElementById("start_deal");
    var price = document.getElementById("total_price");
    if (data.normal != 0) {
        var price_normal = data.normal * data.normal_price;
    } else {
        price_normal = 0;
    }
    if (data.sick != 0) {
        var price_sick = data.sick * data.sick_price;
    } else {
        price_sick = 0;
    }
    var price_all = (price_normal + price_sick) * data.nights;

    start_deal.innerHTML = data.start_deal;
    normal.innerHTML = "ปกติ " + data.normal + " ตัว";
    sick.innerHTML = "ป่วย " + data.sick + " ตัว";
    nights.innerHTML = "เป็นเวลา " + data.nights + " คืน";
    how_sick.innerHTML = data.how_sick;
    booking_note.innerHTML = data.booking_note;
    price.innerText = price_all + " บาท";
}

const delete_dataBooking = (async() => {

    await fetch('/delete_booking').then((response) => {
        response.json().then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    })
    window.location = "Booking_guest_page.html";
})

function confirm_dataBooking() {
    window.location.assign("Detail_booking_guest.html");
    // res.end();
}