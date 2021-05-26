
window.onload = pageload;
function pageload() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })

    initMap();
   
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
	const response = await fetch("\getDBReview");
	const content = await response.json();
	showHotel(content);
}

function showHotel(data){
	var showIDlayer = document.getElementById("blogSearch");
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++){
        var container = document.createElement("div");
        container.className = "blog";
        var containerText = document.createElement("div");
        containerText.className = "blogText";
        var containerBtn = document.createElement("div");
        containerBtn.className = "blogBtn";
        // var containerItem = document.createElement("div");
        // containerItem.className = "bg-light pt-5 pt-lg-0 pt-xl-5 pb-5";
        // var containerDetail = document.createElement("div");
        // containerDetail.className = "mt-4 p-4 text-start";
        // var containerButton = document.createElement("div");
        // containerButton.className = "d-grid px-4";

        var hotelName = document.createElement("h4");
        var catNumber = document.createElement("p");
        var catSymptom = document.createElement("p");
        var location = document.createElement("p");

        var infoBtn = document.createElement("button");
        infoBtn.className = "infoBtn";
        infoBtn.id = [data[keys[i]].hotel_id];
        var bookingBtn = document.createElement("button");
        bookingBtn.className = "booking";
        bookingBtn.id = [data[keys[i]].hotel_id];

        hotelName.innerHTML = data[keys[i]].hotel_name;
        catNumber.innerHTML = "จำนวนที่รองรับต่อวัน : แมว " + data[keys[i]].cat_number + " ตัว";
        catSymptom.innerHTML = "อาการที่รองรับ : " + data[keys[i]].symptom;
        location.innerHTML = data[keys[i]].province + data[keys[i]].district + data[keys[i]].subdistrict;

        furniture_pic.src = "furniturePic/" + data[keys[i]].furniture_pic;
        furniture_name.innerHTML = data[keys[i]].furniture_name;
        size.innerHTML = "ขนาด : " + data[keys[i]].size + " ซม.";
        wood.innerHTML = "เนื้อไม้ : " + data[keys[i]].wood;
        price.innerHTML = data[keys[i]].price + " บาท";
        detailLable.innerHTML = "รายละเอียดเพิ่มเติม :";
        detail.innerHTML = data[keys[i]].detail;
        cartBtn.innerHTML = "เพิ่มสินค้าลงตะกร้า";

        container.appendChild(containerItem);
        containerItem.appendChild(furniture_pic);
        containerItem.appendChild(containerDetail);
        containerDetail.appendChild(furniture_name);
        containerDetail.appendChild(size);
        containerDetail.appendChild(wood);
        containerDetail.appendChild(detailLable);
        containerDetail.appendChild(detail);
        containerDetail.appendChild(price);
        containerButton.appendChild(cartBtn);
        containerItem.appendChild(containerButton);

        showIDlayer.appendChild(container);

        document.getElementById(data[keys[i]].FID).onclick = getToCart;
    }
}

async function getToCart(){
    console.log(this.id);
    writeCart(this.id);
}

async function writeCart(FID){
    console.log("Add furniture to cart server");
    const response = await fetch("/addDBcart", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
        post:FID}) // ส่งค่า FID ไปให้ server.js
    })
    // const content = await response.json(); // ไม่ได้ใช้เนื่องจากไม่จำเป็นต้องเอาค่าที่ได้ไปทำอะไร
    // console.log(content);
    // showDataCart(content);
}