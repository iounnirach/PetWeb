window.onload = pageload;
function pageload() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const nav = document.getElementsByClassName('navbar-links')[0];

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })

    getDataHotel();
    getDataMap();
    // getDataMapDetail();
   
}
// function ShowInfo() {
//     document.getElementById("bgShow").style.display = "block";
// }
function CloseInfo() {
    document.getElementById("bgShow").style.display = "none";
    var removeReview = document.getElementsByClassName("Review");
    while(removeReview.length > 0){
        removeReview[0].parentNode.removeChild(removeReview[0]);
    }
}

async function getDataMap(){
	const response = await fetch("\getDBMap");
	const content = await response.json();
    // console.log(content);
	initMap(content);
}

function initMap(data) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: {lat: 13.745214, lng: 100.496582},
    //   center: { lat: 34.84555, lng: -111.8035 },
      mapTypeId: "roadmap",
    });
    // Set LatLng and title text for the markers. The first marker (Boynton Pass)
    // receives the initial focus when tab is pressed. Use arrow keys to
    // move between markers; press tab again to cycle through the map controls.
    
    // วิธีเก่าสำหรับเก็บค่าจาก data มาใส่ใน arr ในรูปของ array สำหรับ [position] ใน function forEach
    // var arr = [];
    // var keys = Object.keys(data);
    // for(var i = 0; i < keys.length; i++){
    //     var locationn = { lat: data[keys[i]].lat, lng: data[keys[i]].lng, hotel_name: data[keys[i]].hotel_name};
    //     arr.push(locationn);
    // }
    // console.log(arr);

    // ตัวอย่างการเก็บค่า array ไว้ใน js ในรูป array ซ้อน array สำหรับ [position] ใน function forEach
    // var locations = [
    //     [{ lat: 13.846876, lng: 100.604481, hotel_name:'วัดลาดปลาเค้า'}],
    //     [{ lat: 13.847766, lng: 100.605768, hotel_name:'หมู่บ้านอารียา'}],
    //     [{ lat: 13.845235, lng: 100.602711, hotel_name:'สปีดเวย์'}],
    //     [{ lat: 13.862970, lng: 100.613834, hotel_name:'สเต็ก ลุงหนวด'}]
    //     ];
    // console.log(locations);
    // Create an info window to share between markers.
    const infoWindow = new google.maps.InfoWindow();
    // Create the markers.
    data.forEach((position, i) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.lat, position.lng),
        map,
        title: `${position.hotel_name}`,
        label: `${i + 1}`,
        optimized: false,
      });
      // Add a click listener for each marker, and set up the info window.
      marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker.getTitle());
        infoWindow.open(marker.getMap(), marker);
      });
    });
  }
///////////////////// filter search /////////////////////
const blogSearch = document.getElementById("blogSearch"); // element ที่ครอบกล่องข้อความทั้งหมด
const searchBar = document.getElementById("search"); // element input type="text"
let allHotel = []; // นำ data ที่ได้ทั้งหมดมาใส่ในตัวเเปร array

// console.log(searchBar);
searchBar.addEventListener('keyup', (e) => {
    // const searchString = e.target.value; // เอาค่ามาเฉยๆ ยังไม่ได้เเปลงให้เป็นตัวพิมเล็ก
    // เเปลงเป็นตัวพิมเล็กเพื่อให้ง่ายต่อการค้นหา
    const searchString = e.target.value.toLowerCase();
    
    const filteredHotel = allHotel.filter((hotel) => {
        return (
            // hotel.subdistrict.includes(searchString) // เอาค่ามาเฉยๆ ยังไม่ได้เเปลงให้เป็นตัวพิมเล็ก
            hotel.subdistrict.toLowerCase().includes(searchString) || 
            hotel.district.toLowerCase().includes(searchString) || 
            hotel.province.toLowerCase().includes(searchString)
        );
    });
    console.log(filteredHotel);
    showHotel(filteredHotel);
});
///////////////////// get all hotel /////////////////////
async function getDataHotel(){
	const response = await fetch("\getDBHotel");
	allHotel = await response.json();
    console.log(allHotel);
	showHotel(allHotel);
}

// function showHotel(data){ // สร้าง html เเบบเก่า
// 	var blogSearch = document.getElementById("blogSearch");
//     var keys = Object.keys(data);

//     for(var i = 0; i < keys.length; i++){
//         var container = document.createElement("div");
//         container.className = "blog";
//         container.id = "blog";
//         var containerText = document.createElement("div");
//         containerText.className = "blogText";
//         containerText.id = "blogText";
//         var containerBtn = document.createElement("div");
//         containerBtn.className = "blogBtn";

//         var hotelName = document.createElement("h4");
//         var catNumber = document.createElement("p");
//         var catSymptom = document.createElement("p");
//         var location = document.createElement("p");

//         var infoBtn = document.createElement("button");
//         infoBtn.className = "infoBtn";
//         infoBtn.id = data[keys[i]].hotel_id;
//         infoBtn.innerHTML = "รายละเอียด";
//         infoBtn.onclick = getToHotelDetail;
//         var bookingBtn = document.createElement("button");
//         bookingBtn.className = "booking";
//         bookingBtn.id = data[keys[i]].hotel_id;
//         bookingBtn.innerHTML = "จอง";
//         bookingBtn.onclick = getToHotelBooking;

//         let totalScore = data[keys[i]].avg_score;
//         if(totalScore == null){
//             totalScore = 0;
//         }
//         hotelName.innerHTML = data[keys[i]].hotel_name +" ("+ totalScore + ")";
//         catNumber.innerHTML = "จำนวนที่รองรับต่อวัน : แมว " + data[keys[i]].cat_number + " ตัว";
//         catSymptom.innerHTML = "อาการที่รองรับ : " + data[keys[i]].symptom;
//         location.innerHTML = data[keys[i]].province +" "+ data[keys[i]].district +" "+ data[keys[i]].subdistrict +" "+ data[keys[i]].postal_code;

//         blogSearch.appendChild(container);

//         container.appendChild(containerText);
//         container.appendChild(containerBtn);
//         containerText.appendChild(hotelName);
//         containerText.appendChild(catNumber);
//         containerText.appendChild(catSymptom);
//         containerText.appendChild(location);
//         containerBtn.appendChild(infoBtn);
//         containerBtn.appendChild(bookingBtn);
//     }
// }

const showHotel = (hotels) => { // สร้าง html เเบบใหม่
    const htmlString = hotels
        .map((hotel) => {
            let totalScore = hotel.avg_score;
            if(totalScore == null){
                totalScore = 0;
            }
            return `
            <div class="blog" id="blog">
                <div class="blogText" id="blogText">
                    <h4>${hotel.hotel_name} (${totalScore})</h4>
                    <p>จำนวนที่รองรับต่อวัน : แมว ${hotel.cat_number} ตัว</p>
                    <p>อาการที่รองรับ : ${hotel.symptom}</p>
                    <p>${hotel.province} ${hotel.district} ${hotel.subdistrict} ${hotel.postal_code}</p>
                </div>
                <div class="blogBtn">
                    <button class="infoBtn" id="${hotel.hotel_id}" onclick="getToHotelDetail(${hotel.hotel_id})">รายละเอียด</button>
                    <button class="booking" id="${hotel.hotel_id}" onclick="getToHotelBooking(${hotel.hotel_id})">จอง</button>
                </div>
            </div>
            `;
        })
        .join('');
        blogSearch.innerHTML = htmlString; // blogSearch คือตัวเเปร count blogSearch ที่เอามาจาก filter search
};

///////////////////// click detail button /////////////////////
async function getToHotelDetail(data){
    // console.log(this.id);
    hotelDetail_ID(data);
    hotelReview_ID(data);
    getDataMapDetail(data);
}
async function hotelDetail_ID(hotelID){
    // console.log(hotelID);
    const response = await fetch("/getHotelDetail", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
        post:hotelID}) // ส่งค่า hotelID ไปให้ server.js
    })
    const content = await response.json(); // นำค่าที่ได้ไปโชบน hotelDetail
    // console.log(content);
    hotelDetail(content);
}

function hotelDetail(data){
    // console.log(data);
    document.getElementById("bgShow").style.display = "block";
	var hotelName = document.getElementById("hotelName");
    var tell = document.getElementById("tell");
    var score = document.getElementById("score");
    var catNumber = document.getElementById("catNumber");
    var hotelNote = document.getElementById("hotelNote");
    // document.getElementsByName('booking').setAttribute('id', `${data.hotel_id}`);
    var bookingBtn = document.getElementsByName('booking')[0];
    bookingBtn.id = data.hotel_id;
    bookingBtn.onclick = getToHotelBooking;
    // document.getElementById(`${data.hotel_id}`)[2].onclick = function (){
    //     location.href = 'http://localhost:3001/booking.html';
    // }

    document.getElementById("Link-FB").onclick = function (){
        location.href = data.linkFB;
    }
    // contactBtn.onclick = "location.href=" + data.linkFB;

    let totalScore = data.avg_score;
    if(totalScore == null){
        totalScore = 0;
    }

    hotelName.innerHTML = data.hotel_name;
    tell.innerHTML = "0"+data.tell;
    score.innerHTML = totalScore;
    catNumber.innerHTML = data.cat_number;
    hotelNote.innerHTML = data.hotel_note;
}
///////////////////// hotel review
async function hotelReview_ID(hotelID){
    // console.log(hotelID);
    const response = await fetch("/getHotelReview", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
        post:hotelID}) // ส่งค่า hotelID ไปให้ server.js
    })
    const content = await response.json();
    // console.log(content);
    hotelReview(content);
}

function hotelReview(data){
    var reviewInfo = document.getElementById("reviewInfo");
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++){
        var containerReview = document.createElement("div");
        containerReview.className = "Review";
        var reviewName_score = document.createElement("h4");
        var reviewNote = document.createElement("p");

        reviewName_score.innerHTML = data[keys[i]].review_name + "(" + data[keys[i]].score + " คะเเนน" + ")";
        reviewNote.innerHTML = data[keys[i]].review_note;

        reviewInfo.appendChild(containerReview);

        containerReview.appendChild(reviewName_score);
        containerReview.appendChild(reviewNote);
    }
}
///////////////////// hotel Detail Map
async function getDataMapDetail(hotelID){
	const response = await fetch("/getDBMapDetail", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
        post:hotelID}) // ส่งค่า hotelID ไปให้ server.js
    })
    const content = await response.json();
    // console.log(content);
	hotelDetailMap(content);
}
function hotelDetailMap(data){
    const myLatLng = data;
    const map = new google.maps.Map(document.getElementById("myMap"), {
        zoom: 18,
        center: myLatLng,
    });
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "My Hotel",
    });
}

///////////////////// click booking button /////////////////////
async function getToHotelBooking(data){
    // console.log(this.id);
    hotelBooking_ID(data);
}
async function hotelBooking_ID(hotelID){ // save cookie hotel_id
    // console.log(hotelID);
    const response = await fetch("/getHotelBooking_id", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
        post:hotelID}) // ส่งค่า hotelID ไปให้ server.js
    })
    const content = await response.json();
    // console.log(content);
    document.location.href = "http://localhost:3001/booking.html";
}
