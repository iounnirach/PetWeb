// window.onload = pageload();

// function pageload(){
//     score_review();
//     confirm_review();
// }

// function score_review(){
//     var score = document.getElementById("score");
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
    alert(msg);

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

