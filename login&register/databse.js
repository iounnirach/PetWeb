const mysql=require("mysql2");
const dbConnection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'datapet'
});
module.exports=dbconnection;
