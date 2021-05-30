const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 4000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "HOLD_MY_CAT"
})


con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.get("/chack_numcat", async(req, res) => {
    let sql_numcat = `SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = 1 ;`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql_numcat);
    result = Object.assign({}, result);
    res.json(result[0].cat_number);
})

app.get("/chackdata_userprofile_Detail", async(req, res) => {
    let sql = `SELECT name , lastname , tell  FROM HOLD_MY_CAT.user_profile WHERE user_id = 1 ;`; //'${req.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})

app.get("/chackdata_bookinginfo_Detail", async(req, res) => {
    let sql = `SELECT  DATE_FORMAT(start_deal,"%Y-%m-%d")AS start_deal , normal , sick , how_sick , nights , booking_note , normal_price, sick_price FROM HOLD_MY_CAT.booking_info WHERE booking_id = 1 ;`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})

app.get("/chackdata_hotelInfo_Detail", async(req, res) => {
    let sql = `SELECT user_id , hotel_name , address , subdistrict , district , province , postal_code FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = 1 ; `; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})

app.get("/chackdata_hotelInfo_tell", async(req, res) => {
    let sql = `SELECT tell  FROM user_profile WHERE user_id = 2 ;`; //'${data.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})

app.post('/insert_databooking', async(req, res) => {
    let sql = `INSERT INTO HOLD_MY_CAT.booking_info
    (user_id, hotel_id, normal, sick, nights, how_sick, start_deal, booking_note, normal_price, sick_price, status) VALUES
    (1, 1,${req.body.normal_symptom},${req.body.sick_symptom},${req.body.nights},"${req.body.how_sick}", "${req.body.start_deal}", "${req.body.booking_note}", 200, 500, "active");`;
    let result = await queryDB(sql);

})

app.get("/chackdataBooking_guest_confirm", async(req, res) => {
    let sql = `SELECT normal, sick, nights, how_sick, DATE_FORMAT(start_deal,"%Y-%m-%d")AS start_deal, booking_note , normal_price, sick_price FROM HOLD_MY_CAT.booking_info WHERE booking_id = 1 AND user_id = 1; `; //'${req.cookies.hotel_id}'
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result[0]);
})

app.get("/delete_booking", async(req, res) => {
    let sql = `DELETE FROM HOLD_MY_CAT.booking_info WHERE booking_id = 1 ;`;
    let result = await queryDB(sql);
    res.end(JSON.stringify("delete successfully"));
})

app.get("/confirm_booking", async(req, res) => {
    res.redirect("Booking_guest_page.html");
})


app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/Detail_booking_guest.html`);
    console.log(`Server running at   http://${hostname}:${port}/Detail_booking_owner.html`);
    console.log(`Server running at   http://${hostname}:${port}/Confirm_guest_page.html`);
    console.log(`Server running at   http://${hostname}:${port}/Booking_guest_page.html`);
});