const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var alert = require('alert');

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cookieParser());

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

///////////////////// show all hotel /////////////////////
//http method get for request information
app.get("/", async (req,res) => {
    //  * change hotel_name address subdistrict district province postal_code 
    let sql = `SELECT * FROM HOLD_MY_CAT.hotel_name, HOLD_MY_CAT.hotel_address, HOLD_MY_CAT.hotel_subdistrict, HOLD_MY_CAT.hotel_district, HOLD_MY_CAT.hotel_province, HOLD_MY_CAT.hotel_postal_code`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    res.json(result);
});

//REVIEW
// htpp method use post for insert or add information
app.post("/review", async (req,res) => {
    const sql = `INSERT INTO HOLD_MY_CAT.review (user_id, hotel_id, score, review_note) VALUES (${req.cookie.user_id},${req.body.body_hotel_id},
    ${req.body.score_review},'${req.body.text_review}')`;
    const result = await queryDB(sql);
    // res.send(data);
    res.end();
});

app.listen(port, () => {
    console.log("Server start at port 3000");
});
