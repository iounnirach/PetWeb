window.onload = pageLoad;
function pageLoad() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]
    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    getDatahistoryUser();
    getDatahistoryHost();

}

const getDatahistoryUser = (async () => {
    await fetch("/readhistoryDBuser").then((response) => {
        response.json().then((data) => {
            //console.log(data);
            if (data == "No post found") {
                console.log("error")
            } else {
                showhistoryDataUser(data);
            }

        }).catch((err) => {
        })
    })
})
const getDatahistoryHost = (async () => {
    await fetch("/readhistoryDBhost").then((response) => {
        response.json().then((data) => {
            //console.log(data);
            if (data == "No post found") {
                console.log("error")
            } else {
                showhistoryDataHost(data);
            }

        }).catch((err) => {
        })
    })
})
// async function getDatahistory(){
//     console.log("5555")
// 	const response = await fetch("\readhistoryDB");
// 	const content = await response.json();
// 	showhistoryData(content);
// }

function showhistoryDataUser(data) {
    console.log(data);
    var Mainlayer = document.getElementById("sizearea");
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var container = document.createElement("div");
        container.className = "boxtext";
        var containerHost = document.createElement("div");
        containerHost.className = "hosttext";
        var containerDetailhost = document.createElement("p");
        containerDetailhost.id = "usernamehost";
        var containerDetaildate = document.createElement("p");
        containerDetaildate.id = "Date";
        var br = document.createElement("br");
        var containerUser = document.createElement("div");
        containerUser.className = "usertext";
        var containerDetailuser = document.createElement("p");
        containerDetailuser.id = "username";
        var containerDetailstatus = document.createElement("p");
        containerDetailstatus.id = "Status";
        var process = document.createElement("p");
        process.id = "process";
        var detailBtn = document.createElement("button");
        detailBtn.id = [data[keys[i]].booking_id];
        detailBtn.className = "detailbtn";
        detailBtn.onclick = detailbook;

        var reviewbtn = document.createElement("button");
        reviewbtn.className = "begin";
        reviewbtn.id = [data[keys[i]].hotel_id];
        reviewbtn.onclick = review;


        containerDetailhost.innerHTML = "ชื่อร้าน : " + data[keys[i]].hotel_name;
        containerDetaildate.innerHTML = "วันที่ : " + data[keys[i]].start_deal;
        containerDetailuser.innerHTML = "คุณ";
        var statuscheck = data[keys[i]].status;
        var processcheck = data[keys[i]].Setup;


        if (statuscheck) {
            if (statuscheck == "active") {
                containerDetailstatus.innerHTML = " : ทำการจอง";
                if (processcheck) {
                    if (processcheck == "1") {
                        process.innerHTML = "ครบกำหนดการฝากสัตว์เลี้ยงขอบคุณที่ใช้บริการ";
                        reviewbtn.innerHTML = "รีวิว";
                        container.className = "boxtextEnd";
                    }
                    else if (processcheck == "0") {
                        process.innerHTML = "กำลังดำเนินการฝากสัตว์เลี้ยง";
                        reviewbtn.className = "none";
                        container.className = "boxtextGreen";

                    }
                    else if (processcheck == "2") {
                        process.innerHTML = "รายการจองของคุณถูกยกเลิกโดยผู้ให้บริการ";
                        reviewbtn.className = "none";
                        container.className = "boxtextRed";
                    }
                    else if (processcheck == "3") {
                        process.innerHTML = "รอดำเนินการ";
                        reviewbtn.className = "none";
                    }
                }
            }
            else {
                containerDetailstatus.innerHTML = " : ทำการยกเลิกการจอง";
                reviewbtn.className = "none";
                container.className = "boxtextRed";
            }
        }
        detailBtn.innerHTML = "กดเพื่อดูรายละเอียด"



        Mainlayer.appendChild(container);
        container.appendChild(containerHost);
        containerHost.appendChild(containerDetailhost);
        containerHost.appendChild(containerDetaildate);
        container.appendChild(br);
        container.appendChild(containerUser);
        containerUser.appendChild(containerDetailuser);
        containerUser.appendChild(containerDetailstatus);
        container.appendChild(process);
        container.appendChild(reviewbtn);
        container.appendChild(br);
        container.appendChild(detailBtn);
    }
}
function showhistoryDataHost(data) {
    console.log(data);
    var Mainlayer = document.getElementById("sizearea2");
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var container = document.createElement("div");
        container.className = "boxtext";
        var containerHost = document.createElement("div");
        containerHost.className = "hosttext";
        var containerDetailuser = document.createElement("p");
        containerDetailuser.id = "username";
        var containerDetailstatus = document.createElement("p");
        containerDetailstatus.id = "Status";
        var containerDetaildate = document.createElement("p");
        containerDetaildate.id = "Date";
        var br = document.createElement("br");
        var begin = document.createElement("button")
        begin.id = [data[keys[i]].booking_id];
        begin.className = "begin";
        var end = document.createElement("button");
        end.id = [data[keys[i]].booking_id];
        end.className = "end";
        var cancle = document.createElement("button");
        cancle.id = [data[keys[i]].booking_id];
        cancle.className = "end"
        var detailBtn = document.createElement("button");
        detailBtn.id = [data[keys[i]].booking_id];
        detailBtn.className = "detailbtn";
        detailBtn.onclick = detailbook;
        begin.onclick = beginprocess;
        end.onclick = endprocess;
        cancle.onclick = cancleprocess;


        containerDetaildate.innerHTML = "วันที่ : " + data[keys[i]].start_deal;
        containerDetailuser.innerHTML = "ชื่อผู้จอง : " + data[keys[i]].name + " " + data[keys[i]].lastname;
        var statuscheck = data[keys[i]].status;
        var statusSetup = data[keys[i]].Setup;

        if (statuscheck) {
            if (statuscheck == "active" && statusSetup == 3) {

                containerDetailstatus.innerHTML = "สถานะ : ทำการจอง";
                container.className = "boxtextGreen";
                begin.innerHTML = "เริ่มการจอง"
                end.id = "none"
                cancle.innerHTML = "ยกเลิกการจอง"
            }
            else if (statuscheck == "active" && statusSetup == 0) {

                containerDetailstatus.innerHTML = "สถานะ : ทำการจอง";
                container.className = "boxtextGreen";
                begin.id = "none"
                end.innerHTML = "สิ้นสุดการจอง"
                cancle.innerHTML = "ยกเลิกการจอง"
            }
            else if (statuscheck == "active" && statusSetup == 1) {
                containerDetailstatus.innerHTML = "สถานะ : การบริการเสร็จสิ้น";
                container.className = "boxtextEnd";
                begin.id = "none";
                end.id = "none";
                cancle.id = "none";
            }
            else if (statuscheck == "active" && statusSetup == 2) {
                containerDetailstatus.innerHTML = "สถานะ :  ผู้ให้บริการยกเลิกรายการ";
                container.className = "boxtextRed";
                begin.id = "none";
                end.id = "none";
                cancle.id = "none";
            }


            if (statuscheck == "cancel") {
                containerDetailstatus.innerHTML = "สถานะ : ยกเลิกการจอง";
                container.className = "boxtextRed";
                begin.id = "none";
                end.id = "none";
                cancle.id = "none";
            }
        }
        detailBtn.innerHTML = "กดเพื่อดูรายละเอียด"



        Mainlayer.appendChild(container);
        container.appendChild(containerHost);
        containerHost.appendChild(containerDetailuser);
        containerHost.appendChild(containerDetaildate);
        container.appendChild(containerDetailstatus);
        container.appendChild(begin);
        container.appendChild(end);
        container.appendChild(cancle);
        container.appendChild(br);
        container.appendChild(detailBtn);
    }
}
async function detailbook() {
    detail(this.id);
    console.log(this.id);
}
async function detail(bookingID) {
    const response = await fetch("/showdetail", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: bookingID
        }) // ส่งค่า hotelID ไปให้ server.js
    })
    document.location.href = "http://localhost:3001/Detail_booking_owner.html";
    // const content = await response.json(); // นำค่าที่ได้ไปโชบน hotelDetail
    // hotelDetail(content);
}
function review() {
    gotoreview(this.id);
    // console.log(this.id);
    
}

async function gotoreview(reviewID){
    const response = await fetch("/gotoreview", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: reviewID
        }) // ส่งค่า hotelID ไปให้ server.js
    })
    document.location.href = "http://localhost:3001/review.html";
    // const content = await response.json(); // นำค่าที่ได้ไปโชบน hotelDetail
    // hotelDetail(content);
}
async function beginprocess() {
    begin(this.id);
}
async function endprocess() {
    end(this.id);
}
async function cancleprocess() {
    cancle(this.id);
}
async function begin(bookingID) {
    const response = await fetch("/updateprocessbegin", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: bookingID
        }) // ส่งค่า hotelID ไปให้ server.js
    })
    document.location.href = "http://localhost:3001/history.html";
    // const content = await response.json(); // นำค่าที่ได้ไปโชบน hotelDetail
    // hotelDetail(content);

}
async function end(bookingID) {
    const response = await fetch("/updateprocessend", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: bookingID
        }) // ส่งค่า hotelID ไปให้ server.js
    })
    document.location.href = "http://localhost:3001/history.html";

}
async function cancle(bookingID) {
    const response = await fetch("/updateprocesscancle", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: bookingID
        }) // ส่งค่า hotelID ไปให้ server.js
    })
    document.location.href = "http://localhost:3001/history.html";

}