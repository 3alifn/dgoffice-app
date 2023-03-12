const express= require("express")
const mysql= require("mysql")
const bcript= require("bcrypt")
const flash= require("connect-flash")
const dotenv= require("dotenv").config()
const cors= require("cors")
const XLSX= require("xlsx")
const nodemailer= require("nodemailer")

const bodyParser= require("body-parser")
const { render } = require("ejs")
const { redirect } = require("statuses")
const { request } = require("http")
// const { response } = require("express")
const { homedir } = require("os")
const session= require("express-session")
const cookieParser = require("cookie-parser")
const { MemoryStore } = require("express-session")

const mysqlStore = require('express-mysql-session')(session);


const app= express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(flash())

app.enable("trust proxy", true )
app.set("view engine", "ejs")

app.use(express.static("./public/"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))




const sqlmap = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE

});

const sessionStore = new  mysqlStore({
    expiration: 60*60*1000,
    createDatabaseTable: true,
    schema:{
        tableName: 'seawebit_session',
        columnNames:{
            session_id: 'sesssion_id',
            expires: 'expires',
            data: 'data'
        }
    }
},sqlmap)



app.use( session({
    key: 'auth',
    secret: '8008Seawebit',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    name: "seawebit",
    cookie: {
      secure: false, httpOnly: true, maxAge: 60*60*1000, 
    }
}))



sqlmap.connect((err, res)=>{

  if(err) console.log("Server not running")
  else console.log("code by alifn...")

})





const PORT = process.env.PORT || 8080

app.listen(PORT)

module.exports ={
  app, sqlmap, session, XLSX, cors, dotenv, nodemailer, bcript, flash
}