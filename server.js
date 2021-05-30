const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var alert = require('alert');

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : true}));
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
///////////////////// show home map /////////////////////

app.get("/getDBMap", async (req,res) => {
    let sql = `SELECT lat, lng, hotel_name FROM HOLD_MY_CAT.hotel_profile`;
    let result = await queryDB(sql);
    // result = Object.assign({},result);
    // console.log(result[0].lat, result[0].lng, result[0].hotel_name);
    // for(let i=0; i<result.length; i++){
    //     res.json([result[i].lat, result[i].lng, result[i].hotel_name]);
    // }
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
    result = Object.assign({},result);
    // console.log(result);
    res.json(result);
});

///////////////////// show hotel detail /////////////////////

app.post("/getHotelDetail", async (req,res) => {
    let getHotelID = req.body.post;
    res.cookie('hotel_id', getHotelID, 1);
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
    console.log(result[0]);
    res.json(result[0]);
});

///////////////////// click booking button /////////////////////

app.post("/getHotelBooking_id", async (req,res) => {
    let getHotelID = req.body.post;
    console.log(getHotelID);
    res.cookie('hotel_id', getHotelID, 1);
    res.json(getHotelID);
    // return res.redirect('booking.html');
});

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});