window.onload = pageload();
function pageload(){
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]
    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })

    hotelProfile();
    // confirm_review();
}
// function pageload(){
//     confirm_review();
// }

// function score_review(){
//     var score = document.getElementById("score");
// }
// name = name+lastname

// async function detail_hotel(){
//     const response = await fetch("\hotel_review");
//     review_hotel = await response.json();
//     console.log(review_hotel);
// }

// function hotelreview(data){
//     var hotelname = document.getElementById("name_hotel");
//     var tel = document.getElementById("tel_hotel");
//     var position = document.getElementById("position_hotel");

//     hotelname.innerHTML = data.hotel_name;
//     tel.innerHTML = data.tel;
//     position.innerHTML = data.address + "" +data.address + "" + data.subdistrict + "" + data.district + "" 
//     + data.province + "" + data.postal_code;
// }

async function hotelProfile() {
    console.log("review");
    const response = await fetch("\showHotelReview");
    content = await response.json();
    console.log(content);
    hotelReview(content);
}

// const hotelProfile = (async () => {
//     console.log("review");
//     await fetch("/showHotelReview").then((response) => {
//         response.json().then((data) => {
//             //console.log(data);
//             if (data == "No post found") {
//                 console.log("error")
//             } else {
//                 hotelReview(data);
//             }

//         }).catch((err) => {
//         })
//     })
// })

function hotelReview(data){
    var hotelname = document.getElementById("hotelName");
    var tel = document.getElementById("hotelTel");
    var position = document.getElementById("hotelPosition");

    hotelname.innerHTML = data.hotel_name;
    tel.innerHTML = data.tell;
    position.innerHTML = data.address + " " + data.subdistrict + " " + data.district + " " + data.province + " " + data.postal_code;
    console.log(data);
}
// window.onload = pageload();

async function confirm_review() {
    // document.getElementsById("demo").innerHTML = msg;

    var radios = document.getElementsByName('score_review');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var score_review = radios[i].value;
            break;
        }
    }
    //id มีแค่ตัวเดียว
    var msg = document.getElementById("review").value;
    alert("ขอบคุณสำหรับความคิดเห็น");


    await fetch("/review", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: req.cookies.userid,
            hotelid: req.body.hotelid,
            score: rreq.body.score_review,
            review_msg: req.body.text_review,
        })
    })
    .then((response) => {
        response.json().then((data) => {
            alert(data);
        });
    }).catch((err) => {
        alert(err);
    });
   
}











//Access element addcomment
// let confirm = document.getElementById('confirm'); //ปุ่มรีวิว
// let review = document.getElementById('review'); //ช่องใส่ข้อความ
// let output = document.getElementById('output');

// function addComment(){
//     let msg = Text(HTMLInputElement.value);
//     // let outputHtml = '';

//     if(){

//     }

//     output.innerHTML = outputHtml;
// }


// //addEentListener(เหตุการณ์,คำสั่ง)
// confirm.addEventListener('click',addComment)

