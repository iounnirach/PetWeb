const express = require('express');
var session = require('express-session');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var alert = require('alert');
const { isNull } = require('util');

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "HOLD_MY_CAT",
    // socketPath: '/var/run/mysqld/mysqld.sock',
    // port:"3001",
    // multipleStatements: true
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}
// Ioun home page //////////////////////////////////////////////////////////////
///////////////////// show home map /////////////////////

app.get("/getDBMap", async (req,res) => {
    let sql = `SELECT lat, lng, hotel_name FROM HOLD_MY_CAT.hotel_profile`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    // console.log(result[0].lat, result[0].lng, result[0].hotel_name);
    // for(let i=0; i<result.length; i++){
    //     res.json([result[i].lat, result[i].lng, result[i].hotel_name]);
    // }
    let sql2 = `SELECT hotel_id FROM hotel_profile WHERE user_id = '${req.cookies.user_id}'`;
    let result2 = await queryDB(sql2);
    // console.log(result2);
    if(result2 != ""){
        res.cookie('myHotel', result2[0].hotel_id, { maxAge: 86400000 }, 'path=/');
    }
    else if(result2 == ""){
        console.log("คุณยังไม่ได้สร้างโรงเเรม");
    }
    res.json(result);
});

///////////////////// show all hotel /////////////////////

app.get("/getDBHotel", async (req,res) => {
    let sql = ` SELECT
                hp.hotel_id,
                hp.hotel_name,
                re.avg_score,
                hp.cat_number,
                hp.symptom,
                hp.subdistrict,
                hp.district,
                hp.province,
                hp.postal_code,
                hp.lat,
                hp.lng,
                hp.hotel_note
                FROM HOLD_MY_CAT.user_profile as p
                INNER JOIN HOLD_MY_CAT.hotel_profile as hp
                ON p.user_id = hp.user_id
                INNER JOIN
                (
                    SELECT hotel_id, TRUNCATE(SUM(score) / (COUNT(score)-1),2) as avg_score
                    FROM HOLD_MY_CAT.review
                    GROUP BY hotel_id
                    HAVING COUNT(review_id) != 0 
                ) as re
                ON hp.hotel_id = re.hotel_id
                ORDER BY avg_score DESC`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    // console.log(result);
    res.json(result);
});

///////////////////// show hotel detail /////////////////////

app.post("/getHotelDetail", async (req,res) => {
    let getHotelID = req.body.post;
    // res.cookie('hotel_id', getHotelID, 1);
    // console.log(getHotelID);
    let sql = ` SELECT
                re.hotel_id,
                hp.hotel_id,
                hp.hotel_name,
                p.tell,
                p.linkFB,
                re.avg_score,
                hp.cat_number,
                hp.symptom,
                hp.lat,
                hp.lng,
                hp.hotel_note
                FROM HOLD_MY_CAT.user_profile as p
                INNER JOIN HOLD_MY_CAT.hotel_profile as hp
                ON p.user_id = hp.user_id
                INNER JOIN
                (
                    SELECT hotel_id, TRUNCATE(SUM(score) / (COUNT(score)-1),2) as avg_score
                    FROM HOLD_MY_CAT.review
                    GROUP BY hotel_id
                    HAVING COUNT(review_id) != 0 
                ) as re
                ON hp.hotel_id = re.hotel_id
                WHERE hp.hotel_id = ${getHotelID}`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    // console.log(result[0]);
    res.json(result[0]);
});

app.post("/getHotelReview", async (req,res) => {
    let getHotelID = req.body.post;
    // console.log(getHotelID);
    let sql = ` SELECT
                CONCAT(p.name, " ", p.lastname) as review_name,
                re.score,
                re.review_note
                FROM HOLD_MY_CAT.user_profile as p
                INNER JOIN HOLD_MY_CAT.review as re
                ON p.user_id = re.user_id
                WHERE re.hotel_id = ${getHotelID} AND re.score != 0`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    // console.log(result);
    res.json(result);
});

app.post("/getDBMapDetail", async (req,res) => {
    let getHotelID = req.body.post;
    let sql = `SELECT lat, lng FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${getHotelID}`;
    let result = await queryDB(sql);
    // console.log(result[0]);
    res.json(result[0]);
});

///////////////////// click booking button /////////////////////

app.post("/getHotelBooking_id", async (req,res) => {
    let getHotelID = req.body.post;
    if (req.session.loggedin) {
        // console.log(getHotelID);
        res.cookie('hotel_id', getHotelID, 1);
        res.json(getHotelID);
        // return res.redirect('booking.html');
	} else {
		// alert("Please login to view this page!");
        res.json(null);
	}
});

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/homeFirst.html`);
});

// Tangkwa login page //////////////////////////////////////////////////////////////
// register&login
app.post('/register', async (req, res) => {
    let sql = `SELECT mail FROM user_profile WHERE mail = '${req.body.mail}'`;
    let result = await queryDB(sql);
    console.log("Let regist!");
    if (result == "") {
        let sql = `INSERT INTO user_profile (name,lastname,mail,tell,linkFB,password) VALUES ("${req.body.firstname}","${req.body.lastname}","${req.body.mail}","${req.body.tell}","${req.body.linkFB}","${req.body.password}")`;
        let result = await queryDB(sql);
        console.log("register success!");
        res.redirect('after_regist.html');
    }
    else if (result !== "") {
        console.log("This e-mail is already used!")
        res.redirect('register.html?error=1');
    }
})
app.post('/login', async (req, res) => {
    let sql = `SELECT * FROM user_profile WHERE mail = '${req.body.mail}'`;
    let result = await queryDB(sql);
    try {
        if (result[0].mail == req.body.mail && result[0].password == req.body.password) {
            res.cookie('mail', result[0].mail, { maxAge: 86400000 }, 'path=/');
            res.cookie('user_id', result[0].user_id, { maxAge: 86400000 }, 'path=/');
            req.session.loggedin = true;
            console.log("Login success!");
            // console.log("mail : " + result[0].mail);
            // console.log("password : " + result[0].password);
            // console.log("user_id : " + result[0].user_id);
            return res.redirect('home.html');            //จริงๆต้องเปนhome
        }
        else if (result[0].mail == req.body.mail && result[0].password != req.body.password) {
            console.log("Password is incorrect!");
            return res.redirect('login.html?error=2');
        }
        else if (result[0].mail !== req.body.mail) {
            console.log("E-mail is incorrect!");
            return res.redirect('login.html?error=2');
        }
    }
    catch {
        console.log("Cannot login!")
        return res.redirect('login.html?error=3');
    }
})
// profile
app.get('/profile_user', async (req, res) => {
    let sql = `SELECT * FROM user_profile WHERE user_id = '${req.cookies.user_id}'`;
    let result = await queryDB(sql);
    // console.log(result);
    res.end(JSON.stringify(result));
})
app.post('/editprofile', async (req, res) => {
    let sql = `SELECT mail FROM user_profile`;
    let result = await queryDB(sql);
    if (req.body.mail !== result) {//เชคว่ามีอีเมลนี่ยัง ถ้าไม่มีเปลี่ยนเป็นเมลนั้นได้
        let sql = `UPDATE user_profile SET name ='${req.body.firstname}',lastname ='${req.body.lastname}',mail ='${req.body.mail}',tell ='${req.body.tell}',linkFB ='${req.body.linkFB}',password ='${req.body.password}' WHERE user_id = '${req.cookies.user_id}'`;
        let result = await queryDB(sql);
        console.log('Update profile');
        let sql2 = `SELECT mail FROM user_profile WHERE user_id = '${req.cookies.user_id}'`;
        let result2 = await queryDB(sql2);
        res.cookie('mail', result2[0].mail, { maxAge: 86400000 }, 'path=/');
        return res.redirect('profile.html?success=1');
    }
    else {
        console.log("This e-mail is already used!")
        return res.redirect('profile.html?error=1');
    }
})
//create hotel
app.post('/createHotel', async (req, res) => {
    let sql1 = `SELECT user_id FROM hotel_profile WHERE user_id = "${req.cookies.user_id}"`;
    let result1 = await queryDB(sql1);
    console.log("start create!")
    if (result1 == "") {
        // console.log("haha");
        let sql = `INSERT INTO hotel_profile (user_id,hotel_name,cat_number,symptom,address,subdistrict,district,province,postal_code,lat,lng,hotel_note) 
    VALUES ("${req.cookies.user_id}","${req.body.hotel_name}","${req.body.cat_number}","${req.body.symptom}","${req.body.address}","${req.body.subdistrict}","${req.body.district}","${req.body.province}","${req.body.postal_code}","${req.body.latitude}","${req.body.longitude}","${req.body.hotel_note}")`
        let result = await queryDB(sql);
        let sql2 = `SELECT * FROM hotel_profile WHERE user_id = '${req.cookies.user_id}'`;
        let result2 = await queryDB(sql2);
        res.cookie('myHotel', result2[0].hotel_id, { maxAge: 86400000 }, 'path=/');
        let sql3 = `INSERT INTO HOLD_MY_CAT.review
        (user_id, hotel_id, score, review_note) VALUES
        (${req.cookies.user_id}, ${result2[0].hotel_id}, 0, "")`;
        let result3 = await queryDB(sql3);
        console.log("Createhotel succsess!");
        return res.redirect("myhotel.html");
    }
    else {
        return res.redirect("myhotel.html?error=1");
    }
})
// show hotel
app.get('/showhotel', async (req, res) => {
    let sql = `SELECT hotel_id,user_id,hotel_name,cat_number,symptom,address,subdistrict,district,province,postal_code,lat,lng,hotel_note FROM hotel_profile WHERE user_id = "${req.cookies.user_id}"`;
    let result = await queryDB(sql);
    console.log("Show hotel!");

    // result = Object.assign({},result);
    console.log(result);
    res.end(JSON.stringify(result));
})
// delete hotel
app.get('/deletehotel', async (req, res) => {
    let sql = `DELETE FROM hotel_profile WHERE user_id="${req.cookies.user_id}"`;
    let result = await queryDB(sql);
    res.clearCookie('myHotel'); 
    console.log("Delete hotel!");
    return res.redirect("myhotel.html");
})



//logout
app.get('/logout', (req, res) => {
    res.clearCookie('user_id'); 
    res.clearCookie('mail'); 
    res.clearCookie('hotel_id'); 
    res.clearCookie('myHotel'); 
    req.session.loggedin = false;
    // res.cookie('user_id', '', { maxAge: 0 }, 'path=/');
    // res.cookie('mail', '', { maxAge: 0 }, 'path=/');
    // res.cookie('myHotel', { maxAge: 0 }, 'path=/');
    // res.cookie('hotel_id', { maxAge: 0 }, 'path=/');
    return res.redirect('homeFirst.html');
})

// Poom booking page //////////////////////////////////////////////////////////////

// โชจำนวนเเมวหน้าทำการจอง
app.get("/chack_numcat", async(req, res) => {
    let sql_numcat = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${req.cookies.hotel_id} ;`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql_numcat);
    result = Object.assign({}, result);
    res.json(result[0].cat_number);
})

// สำหรับหน้า รายละเอียด
app.get("/chackdata_bookinginfo_Detail", async(req, res) => {
    let sql = ` SELECT bi.booking_id, bi.user_id, up.name , up.lastname , up.tell, DATE_FORMAT(bi.start_deal,"%Y-%m-%d")AS start_deal, bi.normal , bi.sick , bi.how_sick , bi.nights , bi.booking_note , bi.normal_price, bi.sick_price
                FROM HOLD_MY_CAT.user_profile AS up
                INNER JOIN HOLD_MY_CAT.booking_info AS bi
                ON up.user_id = bi.user_id
                WHERE booking_id = ${req.cookies.bookingId};`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})
// สำหรับหน้า รายละเอียด
app.get("/chackdata_hotelInfo_Detail", async(req, res) => {
    let sql = ` SELECT hp.user_id ,
                hp.hotel_name ,
                hp.address ,
                hp.subdistrict ,
                hp.district ,
                hp.province ,
                hp.postal_code ,
                up.tell
                FROM HOLD_MY_CAT.hotel_profile hp
                INNER JOIN HOLD_MY_CAT.user_profile as up
                ON hp.user_id = up.user_id
                INNER JOIN HOLD_MY_CAT.booking_info as bi
                ON hp.hotel_id = bi.hotel_id
                WHERE bi.booking_id = ${req.cookies.bookingId}`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result[0]);
})

// เพิ่มข้อมูลเข้า booking_info
app.post('/insert_databooking', async(req, res) => {
    let sql = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${req.cookies.hotel_id} ;`;
    let result = await queryDB(sql);
    let hotelCat = parseInt(result[0].cat_number);
    let normal_symptom = parseInt(req.body.normal_symptom);
    let sick_symptom = parseInt(req.body.sick_symptom);
    let totalCat = normal_symptom + sick_symptom;
    let updateCat = hotelCat - totalCat;
    // console.log(updateCat);
    if(totalCat > result[0].cat_number){
        alert("จำนวนเเมวที่จองมากกว่าจำนวนเเมวรับฝากสูงสุดของโรงเเรม กรุณาจองใหม่อีกครั้ง");
        return res.send('error');
    }
    else if(totalCat == 0){
        alert("กรุณากรอกจำนวนเเมวที่ต้องการฝากอย่างน้อย 1 ตัว");
        return res.send('error');
    }
    else{
        sql = `INSERT INTO HOLD_MY_CAT.booking_info
        (user_id, hotel_id, normal, sick, nights, how_sick, start_deal, booking_note, normal_price, sick_price, status, Setup) VALUES
        (${req.cookies.user_id}, ${req.cookies.hotel_id},${req.body.normal_symptom},${req.body.sick_symptom},${req.body.nights},"${req.body.how_sick}", "${req.body.start_deal}", "${req.body.booking_note}", 200, 500, "active", 3);`;
        result = await queryDB(sql);
        sql = `UPDATE HOLD_MY_CAT.hotel_profile SET cat_number = ${updateCat} WHERE hotel_id = ${req.cookies.hotel_id}`;
        result = await queryDB(sql);
        sql = `SELECT booking_id FROM HOLD_MY_CAT.booking_info WHERE user_id = ${req.cookies.user_id} ORDER BY booking_id DESC`;
        result = await queryDB(sql);
        // console.log(result[0].booking_id);
        res.cookie('myBooking', result[0].booking_id); // การจองครั้งล่าสุด
        alert("คุณทำการจองสำเร็จเเล้ว");
        return res.redirect("Confirm_guest_page.html");
    }
})
// เเสดงข้อมูลเมื่อกดปุ่นยืนยันการจองเเล้ว
app.get("/chackdataBooking_guest_confirm", async(req, res) => {
    let sql = `SELECT normal, sick, nights, how_sick, DATE_FORMAT(start_deal,"%Y-%m-%d")AS start_deal, booking_note , normal_price, sick_price FROM HOLD_MY_CAT.booking_info WHERE booking_id = ${req.cookies.myBooking} AND user_id = ${req.cookies.user_id}; `; //'${req.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})
// ลบข้อมูลเมื่อกดปุ่มยกเลิกการจอง
app.get("/delete_booking", async(req, res) => {
    let sql = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${req.cookies.hotel_id}`;
    let result = await queryDB(sql);
    let hotelCat = result[0].cat_number;
    console.log("hotel"+ hotelCat);
    sql = `SELECT normal, sick FROM HOLD_MY_CAT.booking_info WHERE user_id = ${req.cookies.user_id} ORDER BY booking_id DESC`;
    result = await queryDB(sql);
    let normal = result[0].normal;
    let sick = result[0].sick;
    console.log("nomal"+ normal);
    console.log("sick"+ sick);
    let updateCat = hotelCat + normal + sick;
    console.log(updateCat);
    sql = `UPDATE HOLD_MY_CAT.hotel_profile SET cat_number = ${updateCat} WHERE hotel_id = ${req.cookies.hotel_id}`;
    result = await queryDB(sql);
    sql = `DELETE FROM HOLD_MY_CAT.booking_info WHERE booking_id = ${req.cookies.myBooking} ;`;
    result = await queryDB(sql);
    res.clearCookie('myBooking');
    // res.cookie('myBooking', { maxAge: 0 }, 'path=/');
    alert("คุณยกเลิกการจองสำเร็จเเล้ว");
    return res.json(result);
    // return res.redirect("Booking_guest_page.html");
})
// สำหรับหน้า รายละเอียด user
app.get("/userDeleteBooking", async(req, res) => {
    let sql = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = 1`;
    let result = await queryDB(sql);
    let hotelCat = result[0].cat_number;
    console.log("hotel"+ hotelCat);
    sql = `SELECT normal, sick FROM HOLD_MY_CAT.booking_info WHERE user_id = 1 ORDER BY booking_id DESC`;
    result = await queryDB(sql);
    let normal = result[0].normal;
    let sick = result[0].sick;
    console.log("nomal"+ normal);
    console.log("sick"+ sick);
    let updateCat = hotelCat + normal + sick;
    console.log(updateCat);
    sql = `UPDATE HOLD_MY_CAT.hotel_profile SET cat_number = ${updateCat} WHERE hotel_id = 1`;
    result = await queryDB(sql);
    sql = `UPDATE HOLD_MY_CAT.booking_info SET status = "cencel" WHERE booking_id = 1`
    result = await queryDB(sql);
    alert("ยกเลิกการจองสำเร็จ");
    return res.json(result);
})

// app.get("/confirm_booking", async(req, res) => {
//     res.redirect("Booking_guest_page.html");
// })

// I history page //////////////////////////////////////////////////////////////


app.get('/readhistoryDBuser', async (req, res) => {
    let sql = `SELECT booking_info.hotel_id,name,lastname,hotel_name,DATE_FORMAT(start_deal, "%Y-%m-%d") AS start_deal,status,booking_id,Setup FROM booking_info
        INNER JOIN user_profile ON booking_info.user_id=user_profile.user_id
        INNER  JOIN hotel_profile ON booking_info.hotel_id=hotel_profile.hotel_id WHERE booking_info.user_id = ${req.cookies.user_id} ORDER BY booking_id DESC`;//join 2รอบ
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result);
})
app.get('/readhistoryDBhost', async (req, res) => {
    let sql = `SELECT booking_info.hotel_id,name,lastname,hotel_name,DATE_FORMAT(start_deal, "%Y-%m-%d") AS start_deal,status,nights,booking_id,Setup FROM booking_info
    INNER JOIN user_profile ON booking_info.user_id=user_profile.user_id
    INNER  JOIN hotel_profile ON booking_info.hotel_id=hotel_profile.hotel_id WHERE booking_info.hotel_id = ${req.cookies.myHotel} ORDER BY booking_id DESC`;//join 2รอบ
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result);
})
app.post('/updateprocessbegin', async (req, res) => {
    let bookingId = req.body.post;
    let sql = `UPDATE booking_info SET Setup = '0' WHERE booking_id = '${bookingId}'`;//join 2รอบ
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result);
})
app.post('/updateprocessend', async (req, res) => {
    let bookingId = req.body.post;
    let sql = `UPDATE booking_info SET Setup = '1' WHERE booking_id = ${bookingId}`;//join 2รอบ
    let result = await queryDB(sql);
    // calculateCatNumber //////////////////////////
    let sql2 = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${req.cookies.myHotel}`
    let result2 = await queryDB(sql2);
    let hotelCat = result2[0].cat_number;
    sql2 = `SELECT normal, sick FROM HOLD_MY_CAT.booking_info WHERE booking_id = ${bookingId}`;
    result2 = await queryDB(sql2);
    let normal = result2[0].normal;
    let sick = result2[0].sick;
    let updateCat = hotelCat + normal + sick;
    sql2 = `UPDATE HOLD_MY_CAT.hotel_profile SET cat_number = ${updateCat} WHERE hotel_id = ${req.cookies.myHotel}`;
    result2 = await queryDB(sql2);
    // calculateCatNumber //////////////////////////
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result);
})
app.post('/updateprocesscancle', async (req, res) => {
    let bookingId = req.body.post;
    let sql = `UPDATE booking_info SET Setup = '2' WHERE booking_id = '${bookingId}'`;//join 2รอบ
    let result = await queryDB(sql);
    // calculateCatNumber //////////////////////////
    let sql2 = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${req.cookies.myHotel}`
    let result2 = await queryDB(sql2);
    let hotelCat = result2[0].cat_number;
    sql2 = `SELECT normal, sick FROM HOLD_MY_CAT.booking_info WHERE booking_id = ${bookingId}`;
    result2 = await queryDB(sql2);
    let normal = result2[0].normal;
    let sick = result2[0].sick;
    let updateCat = hotelCat + normal + sick;
    sql2 = `UPDATE HOLD_MY_CAT.hotel_profile SET cat_number = ${updateCat} WHERE hotel_id = ${req.cookies.myHotel}`;
    result2 = await queryDB(sql2);
    // calculateCatNumber //////////////////////////
    result = Object.assign({}, result);
    // console.log(result);
    res.json(result);
})
app.post('/showdetail', async (req, res) => {
    let bookingId = req.body.post;
    res.cookie('bookingId', bookingId, 1);
    res.redirect("Detail_booking_owner.html");
})
app.post('/gotoreview', async (req, res) => {
    let reviewId = req.body.post;
    res.cookie('reviewId', reviewId, 1);
    res.redirect("review.html");
})

// Toon review page //////////////////////////////////////////////////////////////

//http method get for request information
app.get("/showHotelReview", async (req,res) => {
    console.log("review");
    //  * change hotel_name address subdistrict district province postal_code 
    let sql = ` SELECT hp.hotel_name, up.tell, hp.address, hp.subdistrict, hp.district, hp.province, hp.postal_code
                FROM HOLD_MY_CAT.hotel_profile AS hp
                INNER JOIN HOLD_MY_CAT.user_profile AS up
                ON hp.user_id = up.user_id
                WHERE hotel_id = ${req.cookies.reviewId}`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    console.log(result);
    res.json(result[0]);
});

//REVIEW
// htpp method use post for insert or add information
app.post("/review", async (req,res) => {
    const sql = `INSERT INTO HOLD_MY_CAT.review (user_id, hotel_id, score, review_note) VALUES (${req.cookies.user_id},${req.cookies.reviewId},${req.body.score_review},'${req.body.text_review}')`;
    const result = await queryDB(sql);
    return res.redirect('home.html');
});