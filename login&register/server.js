const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const { cookie } = require('express-validator');
const { Cookie } = require('express-session');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const con = mysql.createConnection({
    host: "localhost",
    user: "dataweb",
    password: "Tang120343",
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
// register&login
app.post('/register', async (req, res) => {
    let sql = `SELECT mail FROM user_profile WHERE mail = '${req.body.mail}'`;
    let result = await queryDB(sql);
    console.log("Let regist!");
    if (result == "") {
        let sql = `INSERT INTO user_profile (name,lastname,mail,tell,linkFB,password) VALUES ("${req.body.firstname}","${req.body.lastname}","${req.body.mail}","${req.body.tell}","${req.body.FB}","${req.body.password}")`;
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

            console.log("Login success!");
            console.log("mail : " + result[0].mail);
            console.log("password : " + result[0].password);
            console.log("user_id : " + result[0].user_id);
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
    console.log(result);
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
        console.log("haha");
        let sql = `INSERT INTO hotel_profile (user_id,hotel_name,cat_number,symptom,address,subdistrict,district,province,postal_code,latitude,longitude,hotel_note) 
    VALUES ("${req.cookies.user_id}","${req.body.hotel_name}","${req.body.cat_number}","${req.body.symptom}","${req.body.address}","${req.body.subdistrict}","${req.body.district}","${req.body.province}","${req.body.postal_code}","${req.body.latitude}","${req.body.longitude}","${req.body.hotel_note}")`
        let result = await queryDB(sql);
         let sql2 = `SELECT * FROM hotel_profile WHERE user_id = '${req.cookies.user_id}'`;
        let result2 = await queryDB(sql2);
        res.cookie('hotel_id', result2[0].hotel_id, { maxAge: 86400000 }, 'path=/');
        console.log("Createhotel succsess!");
        return res.redirect("myhotel.html");
    }
    else {
        return res.redirect("myhotel.html?error=1");
    }
})
// show hotel
app.get('/showhotel', async (req, res) => {
    let sql = `SELECT hotel_id,user_id,hotel_name,cat_number,symptom,address,subdistrict,district,province,postal_code,latitude,longitude,hotel_note FROM hotel_profile WHERE user_id = "${req.cookies.user_id}"`;
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
    res.cookie('hotel_id', { maxAge: 0 }, 'path=/');
    console.log("Delete hotel!");
    return res.redirect("myhotel.html");
})



//logout
app.get('/logout', (req, res) => {
    res.cookie('user_id', '', { maxAge: 0 }, 'path=/');
    res.cookie('mail', '', { maxAge: 0 }, 'path=/');
    res.cookie('hotel_id', { maxAge: 0 }, 'path=/');
    return res.redirect('login.html');
})
app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});