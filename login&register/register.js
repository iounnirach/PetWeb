const express =require('express');
const path = require('path');
const cookieSession=require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection =require('./database');
const {body,validationResult}=require('express-validator');

const app =express();
app.use(express.urlencoded({extended:false}))

app.set('register.html',path.join(__dirname,'register.html'));

app.use(cookieSession({
	name:'session',
	keys:['key1','key2'],
	maxAge:3600*1000//1hr
}))

app.listen(3000,()=>
covsole.log("Server is running..."))
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const nav = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
	nav.classList.toggle('active');
})
window.onload = pageLoad;

function pageLoad() {
	var form = document.getElementById("myForm");
	form.onsubmit = RegisterForm;
	var my_Login = document.getElementById("myLogin");
	my_Login.onsubmit = checkLogin;
}


function RegisterForm() {
	//ถ้าตรวจสอบแล้วว่ามีการ register ไม่ถูกต้องให้ return false ด้วย
	const password = document.forms["myForm"]["password"].value;
	const re_password = document.forms["myForm"]["re_password"].value;
	if (password == re_password) {
	}
	else {
		alert("password is not correct");
		return false;
	}
	checkLogin();
}

function checkLogin() {
	//ถ้าตรวจสอบแล้วพบว่ามีการ login ไม่ถูกต้อง ให้ return false ด้วย
	const urlToGet = new URLSearchParams(window.location.search);
	const email = urlToGet.get('email');
	const password = urlToGet.get('password');
	var email_login = document.forms['myLogin']['email'].value;
	var password_login = document.forms['myLogin']['password'].value;

	if ((email == email_login) && (password == password_login)) {
		alert("Success!")
	}
	else {
		alert("Your username or password is not correct");
		return false;
	}
}


// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');
// const { request } = require('node:http');

// var app = express();
// app.use(session({
// 	secret: 'secret', resave: true, saveUninitialized: true
// }));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get('/', function (req, res) {
// 	res.sendFile(path.join(__dirname + '/register.html'));
// });

// app.post('/auth', function (req, res) {
// 	var name = request.body.name;
// 	var lastname = request.body.lastname;
// 	var mail = request.body.mail;
// 	var tell = request.body.tell;
// 	var password = request.body.password;
// })