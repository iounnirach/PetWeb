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

app.get("/showDBChair", async (req,res) => {
    let sql = `SELECT * FROM HOLD_MY_CAT.hotel_profile`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    // console.log(result);
    res.json(result);
});

///////////////////// show hotel detail /////////////////////

app.post("/addDBcart", async (req,res) => {
    let getCartID = req.body.post;
    // console.log(getCartID);
    let sql = `SELECT * FROM FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = ${getCartID}`;
    let result = await queryDB(sql);
    if(result.length > 0){
        // sql = `SELECT quantity FROM OPEN_HOUSE_IDEA.cart WHERE furniture_id = ${getCartID} AND user_id = ${req.cookies.UID}`;
        // result = await queryDB(sql);
        // console.log(result);
        sql = `UPDATE OPEN_HOUSE_IDEA.cart SET quantity= quantity + 1 WHERE furniture_id = ${getCartID} AND user_id = ${req.cookies.UID}`
        result = await queryDB(sql);
        sql = `SELECT quantity FROM OPEN_HOUSE_IDEA.cart WHERE furniture_id = ${getCartID} AND user_id = ${req.cookies.UID}`;
        result = await queryDB(sql);
        // console.log(result[0].quantity);
        alert(`You are add ${result[0].quantity} furniture to cart`);
        // alert('You are already add this furniture to cart');
    }
    else{
        sql = `INSERT INTO OPEN_HOUSE_IDEA.cart (user_id, furniture_id, quantity) VALUES (${req.cookies.UID}, ${getCartID}, 1)`;
        result = await queryDB(sql);
        alert('Add this furniture to cart');
    }
});

//REVIEW
// htpp method use post for insert or add information
app.post("/review", async (req,res) => {
    const sql = `INSERT INTO HOLD_MY_CAT.review (user_id, hotel_id, score, review_note) VALUES (${req.body.userid},${req.body.hotelid},${req.body.score},'${req.body.review_msg}')`;
    const result = await queryDB(sql);
    alert('Add already review');
});

app.post("/showreview", async (req,res) => {
    const sql = `SELECT review.score, review.review_note, user_profile.name, user_profile.lastname
    FROM HOLD_MY_CAT.review 
    INNER JOIN user_profile
    ON review.user_id = user_profile.user_id
    WHERE hotel_id = ${req.body.hotelid}`
    const result = await queryDB(sql);
    res.json(result);    
});

app.listen(port, () => {
    console.log("Server start at port 3000");
});
