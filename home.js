
window.onload = pageload;
function pageload() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })

    initMap();
    getDataHotel();
   
}
function ShowInfo() {
    document.getElementById("bgShow").style.display = "block";
}
function CloseInfo() {
    document.getElementById("bgShow").style.display = "none";
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: {lat: 13.847860, lng: 100.604274},
    //   center: { lat: 34.84555, lng: -111.8035 },
      mapTypeId: "roadmap",
    });
    // Set LatLng and title text for the markers. The first marker (Boynton Pass)
    // receives the initial focus when tab is pressed. Use arrow keys to
    // move between markers; press tab again to cycle through the map controls.

    var locations = [
        [{ lat: 13.846876, lng: 100.604481}, 'วัดลาดปลาเค้า'],
        [{ lat: 13.847766, lng: 100.605768}, 'หมู่บ้านอารียา'],
        [{ lat: 13.845235, lng: 100.602711}, 'สปีดเวย์'],
        [{ lat: 13.862970, lng: 100.613834}, 'สเต็ก ลุงหนวด']
        ];
    // const locations = [
    //   [{ lat: 34.8791806, lng: -111.8265049 }, "Boynton Pass"],
    //   [{ lat: 34.8559195, lng: -111.7988186 }, "Airport Mesa"],
    //   [{ lat: 34.832149, lng: -111.7695277 }, "Chapel of the Holy Cross"],
    //   [{ lat: 34.823736, lng: -111.8001857 }, "Red Rock Crossing"],
    //   [{ lat: 34.800326, lng: -111.7665047 }, "Bell Rock"],
    // ];
    // Create an info window to share between markers.
    const infoWindow = new google.maps.InfoWindow();
    // Create the markers.
    locations.forEach(([position, title], i) => {
      const marker = new google.maps.Marker({
        position,
        map,
        title: `${i + 1}. ${title}`,
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

async function getDataHotel(){
	const response = await fetch("\getDBHotel");
	const content = await response.json();
    console.log(content);
	showHotel(content);
}

function showHotel(data){
	var blogSearch = document.getElementById("blogSearch");
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++){
        var container = document.createElement("div");
        container.className = "blog";
        var containerText = document.createElement("div");
        containerText.className = "blogText";
        var containerBtn = document.createElement("div");
        containerBtn.className = "blogBtn";

        var hotelName = document.createElement("h4");
        var catNumber = document.createElement("p");
        var catSymptom = document.createElement("p");
        var location = document.createElement("p");

        var infoBtn = document.createElement("button");
        infoBtn.className = "infoBtn";
        infoBtn.id = data[keys[i]].hotel_id;
        infoBtn.innerHTML = "รายละเอียด";
        infoBtn.onclick = getToHotelDetail;
        var bookingBtn = document.createElement("button");
        bookingBtn.className = "booking";
        bookingBtn.id = data[keys[i]].hotel_id;
        bookingBtn.innerHTML = "จอง";
        bookingBtn.onclick = getToHotelBooking;

        hotelName.innerHTML = data[keys[i]].hotel_name +" "+ data[keys[i]].avg_score;
        catNumber.innerHTML = "จำนวนที่รองรับต่อวัน : แมว " + data[keys[i]].cat_number + " ตัว";
        catSymptom.innerHTML = "อาการที่รองรับ : " + data[keys[i]].symptom;
        location.innerHTML = data[keys[i]].province +" "+ data[keys[i]].district +" "+ data[keys[i]].subdistrict +" "+ data[keys[i]].postal_code;

        blogSearch.appendChild(container);

        container.appendChild(containerText);
        container.appendChild(containerBtn);
        containerText.appendChild(hotelName);
        containerText.appendChild(catNumber);
        containerText.appendChild(catSymptom);
        containerText.appendChild(location);
        containerBtn.appendChild(infoBtn);
        containerBtn.appendChild(bookingBtn);
    }
}
///////////////////// click booking button /////////////////////
async function getToHotelBooking(){
    // console.log(this.id);
    hotelBooking_ID(this.id);
}
async function hotelBooking_ID(hotelID){
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
}
///////////////////// click detail button /////////////////////
async function getToHotelDetail(){
    // console.log(this.id);
    hotelDetail_ID(this.id);
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
    console.log(content);
    hotelDetail(content);
}

function hotelDetail(data){
    document.getElementById("bgShow").style.display = "block";
	var hotelName = document.getElementById("hotelName");
    var tell = document.getElementById("tell");
    var score = document.getElementById("score");
    var catNumber = document.getElementById("catNumber");
    var hotelNote = document.getElementById("hotelNote");

    hotelName.innerHTML = data.hotel_name;
    tell.innerHTML = data.tell;
    score.innerHTML = data.avg_score;
    catNumber.innerHTML = data.cat_number;
    hotelNote.innerHTML = data.hotel_note;
}