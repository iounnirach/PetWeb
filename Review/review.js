window.onload = pageload();

// function pageload(){
    detail_hotel();
    confirm_review();
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
    alert("Thank you for review");


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
    }).then((response) => {
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

