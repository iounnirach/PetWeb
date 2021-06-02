window.onload = pageLoad;

function pageLoad() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    // getuser_profile();
    getbooking_info();
    gethotel_info();
    document.getElementById("cancel_booking").onclick = userDeleteBooking;
}

// async function getuser_profile() {
//     const response = await fetch("\chackdata_userprofile_Detail");
//     const content = await response.json()
//     createdata_userprofile(content);
// }

// function createdata_userprofile(data) {
//     var name = document.getElementById("name_user");
//     var phone_user = document.getElementById("phone_user");
//     var fullname = data.name + " " + data.lastname;

//     name.innerHTML = fullname;
//     phone_user.innerHTML = data.tell;
// }

async function getbooking_info() {
    const response = await fetch("\chackdata_bookinginfo_Detail");
    const content = await response.json()
    createdata_bookinginfo(content);
}

function createdata_bookinginfo(data) {
    var name = document.getElementById("name_user");
    var phone_user = document.getElementById("phone_user");
    var fullname = data.name + " " + data.lastname;

    name.innerHTML = fullname;
    phone_user.innerHTML = data.tell;
    
    var date = document.getElementById("start_deal");
    var normal = document.getElementById("normal_symptom_get");
    var sick = document.getElementById("sick_symptom_get");
    var nights = document.getElementById("stay_nights_get");
    var how_sick = document.getElementById("how_sick");
    var note = document.getElementById("hotel_note");
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

    date.innerHTML = data.start_deal;
    normal.innerHTML = "ปกติ " + data.normal + " ตัว";
    sick.innerHTML = "ป่วย " + data.sick + " ตัว";
    nights.innerHTML = "เป็นเวลา " + data.nights + " คืน";
    how_sick.innerHTML = data.how_sick;
    note.innerHTML = data.booking_note;
    price.innerText = price_all + " บาท";
}

async function gethotel_info() {
    const response = await fetch("\chackdata_hotelInfo_Detail");
    const content = await response.json()
    createdata_hotelInfo(content);
}

function createdata_hotelInfo(data) {
    var name = document.getElementById("hotel_user");
    var address = document.getElementById("hotel_location1");
    var subdistrict_district = document.getElementById("hotel_location2");
    var province_postal_code = document.getElementById("hotel_location3");
    var tell = document.getElementById("phone_hotal");

    name.innerHTML = data.hotel_name;
    address.innerHTML = data.address;
    subdistrict_district.innerHTML = data.subdistrict + " " + data.district;
    province_postal_code.innerHTML = data.province + " " + data.postal_code;
    tell.innerHTML = data.tell;
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

const userDeleteBooking = (async() => {

    await fetch('/userDeleteBooking').then((response) => {
        response.json().then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    })
    window.location = "history.html";
})

function close_dataBooking() {
    window.location.assign("history.html");
    // res.end();
}