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
app.post('/register', async (req, res) => {
    let sql = `SELECT mail FROM USER_PROFILE WHERE mail = '${req.body.mail}'`;
    let result = await queryDB(sql);
    console.log("Let regist!");
    if (result == "") {
        let sql = `INSERT INTO USER_PROFILE (name,lastname,mail,tell,linkFB,password) VALUES ("${req.body.firstname}","${req.body.lastname}","${req.body.mail}","${req.body.tell}","${req.body.FB}","${req.body.password}")`;
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
    let sql = `SELECT * FROM USER_PROFILE WHERE mail = '${req.body.mail}'`;
    let result = await queryDB(sql);
    if (result[0].mail == req.body.mail && result[0].password == req.body.password) {
        res.cookie('mail', result[0].mail, { maxAge: 86400000 }, 'path=/');
        res.cookie('user_id', result[0].user_id, { maxAge: 86400000 }, 'path=/');
        console.log("Login success!");
        console.log("mail : " + result[0].mail);
        console.log("password : " + result[0].password);
        console.log("user_id : " + result[0].user_id);
        return res.redirect('home.html');
    }
    else if (result[0].mail == req.body.mail && result[0].password != req.body.password) {
        console.log("Password is incorrect!");
        return res.redirect('login.html?error=2');
    }
    else if (result[0].mail != req.body.mail) {
        console.log("E-mail is incorrect!");
        return res.redirect('login.html?error=2');
    }
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});