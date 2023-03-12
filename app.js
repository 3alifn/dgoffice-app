const { render } = require("ejs");
const e = require("express");
const { query, response } = require("express");
const { redirect } = require("statuses");
const { app, sqlmap, session, XLSX, cors, dotenv, nodemailer, bcript, flash } = require("./server");
const fs= require("fs");
const { json } = require("body-parser");
const { isArray } = require("util");
const { req } = require("http");
const { join } = require("path");
const path= require("path");
const { table } = require("console");
app.set("views", path.join(__dirname, "views"))

var regexTelephone= /^1[0-9]*$/
var regexString= /^[A-Za-z]*$/
var regexPassword= /^[a-zA-Z0-9!@#$%&*]*$/
var regexEmail= /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/ 


app.get("/", (req, res) => {
  
  res.sendFile(__dirname + "/views/index.html")
 
  

})




app.get("/forget.page", (req, res)=>{
res.render("forget_page", {enabled: "username", msg: req.flash("msg"), alertType:req.flash("alertType")})
})



app.post("/find.forget.account", (req, res)=>{
  let sql= `SELECT * FROM users_info WHERE username="${req.body.username}"`
  sqlmap.query(sql, (err, info)=>{
 if(err){
  console.log(err)
  res.sendStatus(404)
 }
   
   else if(info!=undefined && info.length>0){


      let randHashCode=Math.floor(Math.random()*900000)
   

        req.session.forgetUsername= info[0].username;
        req.session.forgetVerifyCode= randHashCode;
        req.flash("msg", "verification code sent")
        req.flash("alertType", "alert-success")


            setTimeout(()=>{
            req.session.destroy()
            }, 2*60000)

            const transporter= nodemailer.createTransport( {
              service: "gmail",
             auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
             } 
              
            });

         let mailOutput= `<html> <h2>Welcome to Khulna DD Office</h2><h4 style="background-color: slateblue; color: white;">your verification code is <span style="color: white" href="#">${randHashCode} & expaire after 2 minutes</span></h4></html>`


            let mailOptions = {
              from: process.env.MAIL_USER,
              to: info[0].username,
              subject: "Join Khulna ddoffice",
              text: "Verify account",
              html: mailOutput
            }

             
            transporter.sendMail(mailOptions, (err, info)=>{
              if(err){
                console.log(err)
                res.sendStatus(404)
               } 
              
          else res.render("forget_page", {enabled: "verify", msg: req.flash("msg"), alertType: req.flash("alertType")})

            })
    }

    else {
      req.flash("msg", "Username Not Found!")
      req.flash("alertType", "alert-danger")

      res.redirect("forget.page")
    }

  })

})


app.post("/verify.forget.account", (req, res)=>{

 if(req.session.forgetVerifyCode==req.body.userCode){

  res.render("forget_page", {enabled: "password", msg: req.flash("msg"), alertType: req.flash("alertType")})
     
 }
 else {
  req.flash("msg", "Invalid Verification Code!")
  req.flash("alertType", "alert-danger")
  res.render("forget_page", {enabled: "verify", msg: req.flash("msg"), alertType: req.flash("alertType")})

 }

})


app.post("/reset.forget.password", (req, res)=>{

  let password= req.body.password;


  let lastPassword= regexPassword.test(password) && password.length>5 && password.length<21;

 if(lastPassword===true){

  let sql= `UPDATE users_info SET password="${password}" WHERE username="${req.session.forgetUsername}"`
  sqlmap.query(sql, (err, unfo)=>{

      if(err) {
        console.log(err)
        res.sendStatus(404)
       }
      else {
        req.flash("msg", "Password Updated...")
        req.flash("alertType", "alert-success")
        res.render("login_page", { msg: req.flash("msg"), alertType: req.flash("alertType")})
      }
    
  })

 }

 else {

  req.flash("alertType", "alert-danger")
  req.flash("msg", "Password: Minimun: 6 Letter, Maximun: 20 Letter, Spacial Char Allow Only !@#$%&*")

  res.render("forget_page", {enabled: "password", msg: req.flash("msg"), alertType: req.flash("alertType")})



 }


  
  })





function dbms(){
  

app.get("/make.table.form", (req, res) => {

  if (req.session.user == "admin") {
    let sql= "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'xqjcwlsx_code_dbms' AND NOT TABLE_NAME IN ('users_info', 'seawebit_session') ORDER BY CREATE_TIME DESC"

    sqlmap.query(sql, (err, table_name) => {
      if (err) {
        console.log(err)
        res.sendStatus(404)
       }

      if(table_name=="" || table_name==undefined) res.render(__dirname + "/views/make_table_form", { table_name:false, column_name:false, })
      else {
         
      sqlmap.query(`DESCRIBE ${table_name[0].TABLE_NAME}`, (err_sub, column_name) => {
        if (err_sub) {
          console.log(err)
          res.sendStatus(404)
         }

        else res.render(__dirname + "/views/make_table_form", { table_name, column_name, msg: req.flash("msg"), alertType: req.flash("alertType"), tableName: req.flash("tableName") })

      })
      }
    })
  }
  else res.redirect("/login.page")

})



app.post("/todo.table", (req, res) => {

  let new_table = req.body.new_table;
  let auto_table= new_table+"_"+Math.floor(Math.random()*1000)

  sqlmap.query(`CREATE TABLE ${new_table} (ID INT AUTO_INCREMENT, UUID INT, EIIN INT, address VARCHAR(100), Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, DATAID VARCHAR(100) NOT NULL, Status VARCHAR(100) DEFAULT 'draft', PRIMARY KEY(ID))`, (err, info) => {
    if (err) {

      req.flash("msg", `Invalid Table Name / Already Exists, We Recommended!`)
      req.flash("tableName", `${auto_table}`)
      req.flash("alertType", "alert-danger")
      res.redirect("/make.table.form")
    }
    else{
      req.flash("msg", `Table Created Successfully`)
      req.flash("alertType", "alert-success")
      res.redirect("/make.table.form")
    } 
  })
})





app.post("/todo.table.type", (req, res)=>{
  if(req.body.old_table=="demo_deo__ueo__hm_"){
    res.sendStatus(404)
  }
  else {
    sqlmap.query(`ALTER TABLE ${req.body.old_table} RENAME TO ${req.body.new_table}`, (err, info)=>{
      if(err) {
        console.log(err)
        res.json({msg: "Something Wrong!"})
       }
      else res.json({msg: "Table Accessed! Now"})
      })
  }
})



app.post("/todo.column", (req, res) => {

  let arr= []
  arr.push(req.body)
  

    let colName = arr[0].colName.filter(function (val) {
      return val > " "
    }) 
    let dataType = arr[0].dataType.filter(function (val) {
      return val > " "
    })

  if(colName.length>0){
 
    for (let i = 0; i < colName.length; i++) {
      sqlmap.query(`ALTER TABLE ${req.body.table_name} ADD ( ${colName[i]} ${dataType[i]} )`, (err, info) => {

         if(err) {
          console.log(err)
          
          req.flash("msg", "you can't make msql keys")
          req.flash("alertType", "alert-danger")
          res.status(203).redirect("/make.table.form")

         } 
         else {
          columnNext()

         }
      })
    } 

  function columnNext(){
    req.flash("msg", "Successfully")
    req.flash("alertType", "alert-success")
    res.status(200).redirect("/make.table.form")
  }

   
  }

  else {
    req.flash("msg", "Invalid Column Name!")
    req.flash("alertType", "alert-danger")
    res.status(404).redirect("/make.table.form")
  }

  
})


}


app.get("/admin.dashboard", (req, res)=>{

  if(req.session.user=="admin"){
    
   if(req.query.filter_table){

    let filter_table= req.query.filter_table

    let sql= "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'xqjcwlsx_code_dbms' AND NOT TABLE_NAME IN ('users_info', 'seawebit_session') ORDER BY CREATE_TIME DESC"

    sqlmap.query(`SELECT * FROM users_info WHERE username="${req.session.username}"`, (user_err, user_info)=>{
      if(user_err){

       console.log(user_err)
       res.sendStatus(404)

      }
      else {
 
        sqlmap.query(sql, (err, table_name)=>{
          if(err) {
            console.log(err)
          res.sendStatus(404)

          }
          
          if(table_name=='' || table_name==undefined) res.render(__dirname+"/views/admin_dashboard", {table_name: false, column_name: false, col_data: false, filter_table:false, user_info})
    
          else{

           
              sqlmap.query(`DESCRIBE ${filter_table}`, (err_sub, column_name)=>{

                if(err_sub){
                  console.log(err_sub)
                  res.sendStatus(404)

                }
                else{

                    sqlmap.query(`SELECT * FROM ${filter_table} ORDER BY ID DESC`, (err_sub_sub, col_data)=>{
                      if(err) {
                        console.log(err_sub_sub)
                          res.sendStatus(404)
                      }
       
                      else {

                        res.render(__dirname+"/views/admin_dashboard", {table_name, column_name, col_data, filter_table, user_info})
                      }

                      })
                }
              })
          }


        })
       
      }
   })

  }





   else{
    let sql= "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'xqjcwlsx_code_dbms' AND NOT TABLE_NAME IN ('users_info', 'seawebit_session') ORDER BY CREATE_TIME DESC"

    sqlmap.query(`SELECT * FROM users_info WHERE username="${req.session.username}"`, (user_err, user_info)=>{
   if(user_err)
   {
   console.log(user_err)
   res.sendStatus(404)
   }
   else {
 
    
    sqlmap.query(sql,(err, table_name)=>{

      if(err) {
        console.log(err)
       res.sendStatus(404)
      }
      
     if(table_name=='' || table_name==undefined){

      res.render(__dirname+"/views/admin_dashboard", {table_name, column_name: false, col_data: false, user_info})

    }
    else {
      if(req.query.searchTable){
        var tableHeadColumn= `DESCRIBE ${req.query.searchTable}`
      }
      else var tableHeadColumn= `DESCRIBE ${table_name[0].TABLE_NAME}`

      sqlmap.query(tableHeadColumn, (err_sub, column_name)=>{

        if(err_sub) {
          
          console.log(err_sub)
           res.sendStatus(404)
        }

        else{

          if(req.query.searchTable){
            var subFilterTableName= req.query.searchTable;

            var mainDataSql2= `SELECT * FROM ${req.query.searchTable} WHERE EIIN="${req.query.dataName}" OR address="${req.query.dataName}" ORDER BY ID DESC`
           }
            else {

              var subFilterTableName= table_name[0].TABLE_NAME
              var mainDataSql2= `SELECT * FROM ${table_name[0].TABLE_NAME} ORDER BY ID DESC`

            }

     sqlmap.query(mainDataSql2, (err_sub_sub, col_data)=>{
      
      if(err_sub_sub) {
        console.log(err_sub_sub)
        res.sendStatus(404)

      }
       
       
      else res.render(__dirname+"/views/admin_dashboard", {table_name, column_name, col_data, user_info, filter_table: subFilterTableName})
     })
        }
      })
     
    }      

    })
   }

    })
  
   }
  }


  else res.redirect("/login.page")

})



app.get("/update.form", (req, res)=>{

if(req.session.user=="admin"){

  let table_name= req.query.table_name
  let ID= req.query.ID

  sqlmap.query(`DESCRIBE ${table_name}`, (err, column_name)=>{
  if(err) {
    console.log(err)
    res.sendStatus(404)

  }
  else{
    sqlmap.query(`SELECT * FROM ${table_name} WHERE ID=${ID}`, (err_sub, col_data)=>{

  if(err_sub) {
    console.log(err_sub)
    res.sendStatus(404)

  }
  else  res.render(__dirname+"/views/update_form", {column_name, col_data, table_name})

    })
  }
  })
}
else res.redirect("/login.page")
})



app.post("/update.data", (req, res)=>{
  let data= req.body;
 
 let arr_keys=[]
 let arr_val=[]
 
 let key= Object.keys(data)
 let val= Object.values(data)
 arr_keys.push(key)
 arr_val.push(val)
 
 
 let modify_keysQ= arr_keys[0].map(function (key){
 
     return key + "="
 })
 
 let modify_valQ= arr_val[0].map(function (val){
 
     return JSON.stringify(val)
 })
 
 
 
  let loopArr= []
 for (let i = 1; i <arr_keys[0].length; i++) {
     loopArr.push(modify_keysQ[i])
     loopArr.push(modify_valQ[i])
 }
 
 let final_data1= loopArr.toString().replaceAll("=,", "=")
 
   let final_data= final_data1.replaceAll("", "")
 
   sqlmap.query(`UPDATE ${req.body.table_name} SET ${final_data} WHERE ID=${req.body.ID}`, (err, info)=>{
    if(err) {
      console.log(err)
      res.sendStatus(404)

    }
    else res.redirect("/admin.dashboard")
   })
 
 
 })
 


app.get("/update.table.form", (req, res)=>{

  if(req.session.user=="admin"){
    res.render(__dirname+"/views/update_table_form", {table_name: req.query.table_name, table_type:req.query.table_type})
   
  }
  else res.redirect("/login.page")

})



app.post("/update.table", (req, res)=>{
  

    sqlmap.query(`ALTER TABLE ${req.body.old_table} RENAME TO ${req.body.new_table}`, (err, info)=>{
      if(err) {
        console.log(err)
        res.json({msg: "Invaild Table Name / Already Exists "})

      }

     else res.json({msg: "Change Successfully!"})
    
    })
  

})
 




app.post("/del.table", (req, res)=>{

    sqlmap.query(`DROP TABLE ${req.body.table_name}`, (err, ino)=>{
      if(err) {
        console.log(err)
        res.json({msg: "Already Deleted"})
      }
      
      else res.json({msg: "Table Deleted! Successfully"})
    
  

})
})



app.post("/del.col_data", (req, res)=>{

 sqlmap.query(`DELETE FROM ${req.body.table_name} WHERE ID=${req.body.ID}`, (err, info)=>{
  if(err) {
    console.log(err)
    res.sendStatus(404)
  }
  else res.json({msg: "Data Deleted! Successfully"})
 })
 
})



app.get("/manage.table", (req, res)=>{

  if(req.session.user=="admin"){

    let offset= req.query.offset-1

    if(offset){
      var offSetTable= (offset) * (10)
      
    } else var offSetTable= 0;

    let sql= `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'xqjcwlsx_code_dbms' AND NOT TABLE_NAME IN ('users_info', 'seawebit_session') ORDER BY CREATE_TIME DESC LIMIT 10 offset ${offSetTable}`
   
    sqlmap.query("SHOW FULL TABLES", (error, mainTable)=>{
    
      let tableCount= mainTable.length;
      sqlmap.query(sql, (err, table_name)=>{

        if(err) {
          console.log(err)
      
          res.redirect(`${req.path}`)
          
        }
       else if(table_name=='' || table_name==undefined){
          res.render("manage_table", {table_name:false, tableCount: false})
    
        }
        else res.render("manage_table", {table_name, tableCount, active: req.query.offset})
      
    
    
        })


    })


  }
  else res.redirect("/login.page")

});   



app.post("/search.table", (req, res)=>{
  
  let tableName= req.body.tableName
  let sql= `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'xqjcwlsx_code_dbms' AND TABLE_NAME LIKE "%${tableName}%" AND NOT TABLE_NAME IN ("users_info", "seawebit_session") ORDER BY CREATE_TIME DESC`

  sqlmap.query(sql, (err, table_name)=>{

    if(err) {
      console.log(err)
      res.sendStatus(404)
    }
   else if(table_name=='' || table_name==undefined){
      res.render("manage_table", {table_name:false, tableCount: 2})

    }
    else res.render("manage_table", {table_name, tableCount: table_name.length+2, active: 1})
  

    })


})




app.get("/manage.column", (req, res)=>{

  if(req.session.user=="admin"){
   

           let sql=  `DESCRIBE ${req.query.tableName}`

        sqlmap.query(sql, (err, column_name)=>{

          if(err) {
            console.log(err)
       res.sendStatus(404)
          }
          else {

           res.render("manage_column", {tableName: req.query.tableName, column_name}) 

          }

        })
    
  }
  else res.redirect("/login.page")
 
 
 })




app.get("/update.column.form", (req, res)=>{
   if(req.session.user=="admin"){
      res.render(__dirname+"/views/column_update_form", {table_name: req.query.table_name, column_name: req.query.column_name})
   }
   else res.redirect("/login.page")
})



app.post("/update.column", (req, res)=>{
 let {tableName, oldColumn, newColumn }= req.body;

  sqlmap.query(`ALTER TABLE ${tableName} CHANGE COLUMN ${oldColumn} ${newColumn} VARCHAR(100) NOT NULL`, (err, info)=>{
    if(err) {
      console.log(err)
      res.json({msg: "Invaild Column Name / Already Exists "})
    }

   else res.json({msg: "Updated Successfully"})
  
  })


})


 app.post("/del.column", (req, res)=>{
  
    sqlmap.query(`ALTER TABLE ${req.body.table_name} DROP COLUMN ${req.body.column_name}`, (err, info)=>{
      if(err) {
        console.log(err)
       res.json({msg: "Already Deleted!"})
      }

      else res.json({msg: "Deleted! Successfully"})
  

    })
  
 })


 app.get("/admin.profile", (req, res)=>{
 
  if(req.session.user=="admin"){
    let {UserID }= req.session;
    
    sqlmap.query(`SELECT * FROM users_info WHERE ID=${UserID}`, (err, user_info)=>{
     if(err) {
      console.log(err)
      res.sendStatus(404)
     }
       
     else res.render("admin_profile", {user_info, msg: req.flash("msg"), alertType: req.flash("alertType")})
    })

   
  }

  else res.redirect("/login.page")

 })




dbms()







function users_info() {

  app.get("/singup.page", (req, res) => {
    
    res.render(__dirname + "/views/singup_page", {msg: req.flash("msg"), alertType: req.flash("alertType")})
  })


  app.get("/login.page", (req, res) => {

    
    res.render(__dirname + "/views/login_page", {msg: req.flash("msg"), alertType: req.flash("alertType")})

  })


  app.post("/todo.singup", (req, res) => {
      
      let {password, name, username, telephone, user_role}= req.body;

      let lastPassword= regexPassword.test(password) && password.length>5 && password.length<21
      let lastName= regexString.test(name) && name.length>1
      let lastUsername= regexEmail.test(username)
      let lastUserRole= /hm/.test(user_role)
      let lastTelephone= regexTelephone.test(telephone) && telephone.length==10;

      let userInput = [lastName, lastTelephone, lastUsername, lastPassword, lastUserRole]

      let userAuthontication= userInput.every((input)=>{
         return input==true
      })

      if(userAuthontication===true){

        let sql = `SELECT * FROM users_info WHERE username="${username}"`
      sqlmap.query(sql, (err, info) => {
        if (err) {
          console.log(err)
          res.sendStatus(404)
         }

        if (info.length > 0) {
          req.flash("alertType", "alert-danger")
          req.flash("msg", "Username Already Joined")
          res.redirect("/singup.page")
        }
        
        else {
         req.session.password= password;
         req.session.name= name;
         req.session.username= username;
         req.session.telephone= telephone;
         req.session.user_role= user_role;

         const randHashCode=Math.floor(Math.random()*900000)
         
          bcript.hash(randHashCode, 6, (err, hash)=>{

            req.session.userVerifyCode= randHashCode;

            const transporter= nodemailer.createTransport( {
              service: "gmail",
             auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
             } 
              
            });

         let mailOutput= `<html> <h2>Welcome to Khulna DD Office</h2> <h4 style="color: white" href="#">your verification code is ${randHashCode} & expaire after 2 minutes</h4></html>`


            let mailOptions = {
              from: process.env.MAIL_USER,
              to: username,
              subject: "Join Khulna ddoffice",
              text: "Verify account",
              html: mailOutput
            }

            req.session.userVerifyCode= randHashCode;
            setTimeout(()=>{
            req.session.destroy()
            }, 2*60000)
          
            
            transporter.sendMail(mailOptions, (err, info)=>{
              
              if(err) {
                console.log(err)
                res.status(404).end("Mail Connection Failed!")
               }
              
          else {
            req.flash("msg", "Verification Code Sent!")
             req.flash("alertType", "alert-success")
            res.render(__dirname+"/views/todo_join.ejs", {msg: req.flash("msg"), alertType: req.flash("alertType")})
          }
            })


          })
   

        }
      })

      }

      else {
        req.flash("alertType", "alert-danger")
        req.flash("msg", "Password: Minimun: 6 Letter, Maximun: 20 Letter, Spacial Char Allow Only !@#$%&*")
        res.redirect("/singup.page")
      }
      

  })

  app.post("/todo.join", (req, res)=>{

   if(req.session.userVerifyCode==req.body.userCode){
    let userSql = `INSERT INTO users_info (name, username, telephone, password, user_role)VALUES("${req.session.name}", "${req.session.username}", "${req.session.telephone}", "${req.session.password}","${req.session.user_role}")`

    sqlmap.query(userSql, (err, info)=>{
      req.flash("msg", "You are successfully")
      req.flash("alertType", "alert-success")
      if(err) {
        console.log(err)
        res.sendStatus(404)
       }
      
      else res.redirect("/login.page")
    })
   }
    

   else {
        req.flash("msg", "Invalid Verify Code!")
        req.flash("alertType", "alert-danger")
        
       res.render(__dirname+"/views/todo_join.ejs", {msg: req.flash("msg"), alertType: req.flash("alertType")})
   }

  })


  app.post("/todo.login", (req, res) => {
    let {username, password} = req.body;

    let sql = `SELECT * FROM users_info WHERE username="${username}" AND password="${password}"`
    sqlmap.query(sql, (err, user_info) => {
      if (err) {
        console.log(err)
        res.sendStatus(404)
       }

      else {

        if (user_info.length == 0){
        req.flash("msg", "Authontication Failed!")
         req.flash("alertType","alert-danger")
        res.redirect("/login.page")

        }
        else if (user_info[0].user_role == "admin") {
          req.session.user = "admin"
          req.session.UserID= user_info[0].ID
          req.session.UserUUID= user_info[0].UUID
          req.session.UserName= user_info[0].username
          req.session.UserTelephone= user_info[0].telephone
          req.session.UserUserRole= user_info[0].user_role
          req.session.UserPassword= user_info[0].password
          req.session.username = user_info[0].username
          res.redirect("/admin.dashboard")
        }

        else {
          req.session.UserID= user_info[0].ID
          req.session.UserUUID= user_info[0].UUID
          req.session.UserName= user_info[0].username
          req.session.UserTelephone= user_info[0].telephone
          req.session.UserUserRole= user_info[0].user_role
          req.session.UserPassword= user_info[0].password
          req.session.UserEIIN= user_info[0].EIIN
          req.session.UserAddress= user_info[0].address

          req.session.user = "user"
          req.session.username = user_info[0].username
          
          res.redirect("/user.dashboard")

        }
      }

    })
  })





  app.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("login.page")

  })



};  users_info()




function user() {
 
app.get("/user.dashboard", (req, res)=>{

  if(req.session.user=="user"){

    let UserID= req.session.UserID

    if(req.query.after_table){
      let x= req.query.after_table.replaceAll("=", "")
      var afterTableName= atob(`${x}`)
    }
   
  
    
    sqlmap.query(`SELECT * FROM users_info WHERE ID="${UserID}"`, (user_err, user_info)=>{

     if(user_err) {
      console.log(user_err)
      res.sendStatus(404)
     }
    else {
     
  let user_role_sql= `SELECT TABLE_NAME FROM Information_Schema.TABLES WHERE TABLE_SCHEMA ='xqjcwlsx_code_dbms' AND TABLE_NAME like '%_${user_info[0].user_role}_%' ORDER BY CREATE_TIME DESC`

    sqlmap.query(user_role_sql, (err, table_name)=>{
      if(err) {
        console.log(err)
        res.sendStatus(404)
       }
      
        if(table_name=='' || table_name==undefined) res.render("user_dashboard", {table_name, user_info, filter_table: ""}) 

         else {
          if(afterTableName){


              var user_filter_sql=`SELECT ID, Date, DATAID, Status FROM ${afterTableName} WHERE UUID="${user_info[0].ID}" GROUP BY DATAID ORDER BY ID DESC` 
           }
          else { 

              var user_filter_sql=`SELECT ID, Date, DATAID, Status FROM ${table_name[0].TABLE_NAME} WHERE UUID="${user_info[0].ID}" GROUP BY DATAID ORDER BY ID DESC ` 

          }
  
          sqlmap.query(user_filter_sql, (err_sub, col_data)=>{
            if(err_sub) {
              // console.log(err_sub)
              // res.sendStatus(404)   
              res.send("<h1 style='color: red'>N/A</h1>")
            }
              
            if(afterTableName) res.render("user_dashboard", {table_name, col_data, user_info, filter_table: afterTableName})
  
            else res.render("user_dashboard", {table_name, col_data, user_info, filter_table: table_name[0].TABLE_NAME})
    
           })
          
         }
      
    })
  }
  })

  }
  else if(req.session.user=="admin"){
    res.redirect("/admin.dashboard")
  }
  else if(req.session.user=="user"){
    res.redirect("/user.dashboard")
  }
  else res.redirect("/login.page")
})





app.post("/open.user.form", (req, res)=>{

  if(req.session.user=="user" || req.session.user=="admin"){

   if(req.body.userRowCount){
    var userRowCountNumber= req.body.userRowCount;
   } else var userRowCountNumber= undefined;

  sqlmap.query(`DESCRIBE ${req.body.table_name}`, (err, column_name)=>{
    if(err) {
      console.log(err)
      res.sendStatus(404)
     }
    
    else {

      if(req.session.user=="user"){
        var open_user_form= `SELECT ID, EIIN, user_role FROM users_info WHERE ID=${req.body.ID}`
      } else {

        var open_user_form= `SELECT ID, address, user_role FROM users_info WHERE ID=${req.body.ID}`

      }

      sqlmap.query(open_user_form, (err_sub, col_data)=>{
        if(err_sub) {
          console.log(err_sub)
          res.sendStatus(404)
         }

        else res.render("open_user_form", {table_name: req.body.table_name, column_name, col_data, userRowCount: userRowCountNumber})

      })
    }
  })
}



else if(req.session.user=="admin"){
     
  sqlmap.query(`DESCRIBE ${req.body.table_name}`, (err, column_name)=>{
    if(err) {
      console.log(err)
      res.sendStatus(404)
     }
  
    else res.render("open_user_form", {table_name: req.body.table_name, column_name, userRowCount: userRowCountNumber})
  })

}
else res.redirect("/login.page")



})





app.post("/todo.open.form", (req, res)=>{

  let fixedData= req.body.fixedData;
  let StatusX= fixedData[0]; let UUID= fixedData[1]; let EIIN= fixedData[2]; let Address= fixedData[3]; let tableName= fixedData[4]
  let DATAID= new Date().getFullYear()+"_"+Math.floor(Math.random()*90000000000000000000)

  let colKey= Object.keys(req.body)
  colKey.shift()

  let finalColKey= colKey.toString().replaceAll("[", "").replaceAll("]", "").replaceAll("'", "")


  let parentArray= req.body
let colName= Object.keys(parentArray)
colName.shift()
let colData= Object.values(parentArray)
colData.shift()
let rowNumber= Object.values(parentArray)[1].length

let loopData= []


 for(let i=0; i<rowNumber; i++){
 
    for(let x=0; x<colName.length; x++){
     
        loopData.push(colData[x][i])
        
   
    }

 }

let finalData= []



 let start= []
 let end= []
 for(let i=0; i<rowNumber; i++){
    start.push(colName.length*[i])
    end.push(colName.length+colName.length*[i])
    let data= loopData.slice(start[i], end[i])

 finalData.push([UUID, EIIN, Address, DATAID, StatusX].concat(data)) //canYouChangeMe
  
 }
  

 if(isArray(Object.values(req.body)[1])==true){
  let customsDataInput= `INSERT INTO ${tableName} ( UUID, EIIN, address, DATAID, Status, ${finalColKey}) VALUES ?`
 
  let values= finalData;
 
  
  sqlmap.query(customsDataInput, [values], (err, info)=>{
  if(err) {
    console.log(err)
    res.sendStatus(404)
   }
 
  else res.redirect("/user.dashboard")
 
  })


 } 
 else {
  
  let customsDataInput= `INSERT INTO ${tableName} ( UUID, EIIN, address, DATAID, Status, ${finalColKey}) VALUES ?`
  let Data= []
   
  Data.push([UUID, EIIN, Address, DATAID, StatusX].concat(colData))

  let values= Data;
 
  sqlmap.query(customsDataInput, [values], (err, info)=>{
  if(err) {
    console.log(err)
    res.sendStatus(404)
   }
 
  else res.redirect("/user.dashboard")
 
  })


  
 }



})



app.post("/user.make.row", (req, res)=>{
  let {userRowCount, tableName, ID}= req.body;

res.redirect(`/open.user.form?userRowCount=${userRowCount}&table_name=${tableName}&ID=${ID}`)

})




app.get("/user.draft.form", (req, res)=>{
 
  if(req.session.user=="user"){
      let ID= req.query.ID
      let table_name= req.query.table_name

    sqlmap.query(`DESCRIBE ${table_name}`, (err, column_name)=>{
      if(err) {
        console.log(err)
        res.sendStatus(404)
       }

      else {
        sqlmap.query(`SELECT * FROM ${table_name} WHERE DATAID="${ID}" AND Status= "draft"`, (err_sub, col_data)=>{
          if(err_sub){
            console.log(err_sub)
            res.sendStatus(404)
           }
          else res.render(__dirname+"/views/user_draft_form", {table_name, column_name, col_data})
       
   
          })
      }
    })
  }
  else res.redirect("/login.page")

})




app.post("/user.draft.update", (req, res)=>{
  let data= req.body;
let tableName= req.body.fixedData[0]
 let colName= Object.keys(req.body)
 let colNameX= colName.shift()
 let colNameY= colName.shift()

 let colData= Object.values(req.body)
 let rowNumber= Object.values(data)[1].length
 let colDataX= colData.shift()
 let colDayaY= colData.shift()

 let loopData= []


 for(let i=0; i<rowNumber; i++){
 
    for(let x=0; x<colName.length; x++){
     
        loopData.push(colData[x][i])
        
   
    }

 }

 let finalData= []
 
 let DATAID= new Date().getFullYear()+"_"+Math.floor(Math.random()*90000000000000000000)

 let StatusX= data.fixedData[1]
 let start= []
 let end= []
 for(let i=0; i<rowNumber; i++){
    start.push(colName.length*[i])
    end.push(colName.length+colName.length*[i])
    let data= loopData.slice(start[i], end[i])

 finalData.push([StatusX,DATAID].concat(data)) //canYouChangeMe
  
 }

 

 if(isArray(Object.values(data)[1])==true){

  let sql= `DELETE FROM ${data.fixedData[0]} WHERE ID IN (${data.ID.toString()}) `

  sqlmap.query(sql, (err, info)=>{
  if(err) {
    console.log(err)
  res.sendStatus(404)
  }
  else {
    updateData()
  }


  })
 

 
 function updateData(){
  let customsDataInput= `INSERT INTO ${tableName} (Status, DATAID, ${colName.toString()}) VALUES ?`
 
  let values= finalData;
 
  
  sqlmap.query(customsDataInput, [values], (err, info)=>{
  if(err) {
    console.log(err)
    res.sendStatus(404)
   }
 
  else res.redirect("/user.dashboard")


 })

}
  

 } 
 
 
 else{
  
  let colName= Object.keys(data)
  colName.shift()
  colName.shift()
  
  let colData= Object.values(data)
  colData.shift()
  colData.shift()
  colData.unshift(DATAID)
  colData.unshift(data.fixedData[1])


  let sql= `DELETE FROM ${data.fixedData[0]} WHERE ID=${data.ID.toString()} `

  sqlmap.query(sql, (err, info)=>{
  if(err) {
    console.log(err)
  res.sendStatus(404)
  }

  else {
    updateSingleData()
  }



  })

 
 

 function updateSingleData(){
  let customsDataInput= `INSERT INTO ${data.fixedData[0]} (Status, DATAID, ${colName}) VALUES ?`

  let values= [
    colData
  ]



  sqlmap.query(customsDataInput,[values], (err, info)=>{

    if(err){
      console.log(err)
      res.sendStatus(404)
    }
    else res.redirect("user.dashboard")
   
  })


 }



  






 }

})

}

 
 app.get("/user.profile", (req, res)=>{
 
  if(req.session.user=="user"){


    
    sqlmap.query(`SELECT * FROM users_info WHERE ID=${req.session.UserID}`, (err, user_info)=>{
     if(err) {
      console.log(err)
      res.sendStatus(404)
     }
       
     else res.render("user_profile", {user_info, msg: req.flash("msg"), alertType: req.flash("alertType")})
    })

   
  }

  else res.redirect("/login.page")

 })



 app.post("/basic.user.profile", (req, res)=>{

  let {name, telephone, ID, EIIN, address, user_role }= req.body;

  if(user_role=="hm") {
  var update_user_sql= `UPDATE users_info SET name="${name}", telephone="${telephone}", EIIN="${EIIN}" WHERE ID=${ID}`
  }
  else {
    var update_user_sql= `UPDATE users_info SET name="${name}", telephone="${telephone}", address="${address}" WHERE ID=${ID}`
  }
   
  sqlmap.query(update_user_sql, (err, info)=>{

    if(err) {
      console.log(err)
      res.sendStatus(404)
     }
          
        else {

         if(req.session.user=="admin"){

          req.flash("msg", "Update Successfully")
          req.flash("alertType", "alert-success")
          res.redirect("/admin.profile")

         } else {

          req.flash("msg", "Update Successfully")
          req.flash("alertType", "alert-success")
          res.redirect("/user.profile")
         }


        }
   
  })

 })


 
 app.post("/verify.user.profile", (req, res)=>{

  let {ID, password, username}= req.body;
  

  sqlmap.query(`SELECT * FROM users_info WHERE username="${username}"`, (err, user_info)=>{

    if(user_info.length>0){

      if(req.session.user=="admin"){
            
      req.flash("msg", "Username Already Joined")
      req.flash("alertType", "alert-danger")
       res.redirect("/admin.profile")

      } else {
            
      req.flash("msg", "Username Already Joined")
      req.flash("alertType", "alert-danger")
       res.redirect("/user.profile")

      }
  
    }
    else {

      req.session.tempUsername= username
      req.session.tempPassword= password
      req.session.tempID= ID 
      let randHashCode= Math.floor(Math.random()*900000)
      req.session.userCode= randHashCode;
    
      setTimeout(()=>{
     req.session.destroy()
    
      }, 4*60000)
    
    
      const transporter= nodemailer.createTransport( {
        service: "gmail",
       auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
       } 
        
      });
    
    let mailOutput= `<html> <h3>Welcome to Khulna DD Office</h3><h4 style="background-color: slateblue; color: white;">your verification code is <span style="color: white" href="#">${randHashCode} & expaire after 4 minutes</span></h4></html>`
    
    
      let mailOptions = {
        from: process.env.MAIL_USER,
        to: username,
        subject: "Join Khulna ddoffice",
        text: "Verify account",
        html: mailOutput
      }
    
       
      transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
          console.log(err)
          res.status(404).end("Internet Disconnect")
         } 
        
         else  {
          req.flash("msg", "verification code sent to your email")
          req.flash("alertType", "alert-success")
    
          res.render("verify_user_profile", {msg: req.flash("msg"), alertType: req.flash("alertType")})
    
         }
    
    
      })

    }

  })
  
 

 })





 app.post("/security.user.profile", (req, res)=>{

  let {tempUsername, tempPassword, tempID}= req.session;
  let {userCode}= req.body;

  if(req.session.userCode==userCode ){

    
  let sql= `UPDATE users_info SET username="${tempUsername}", password="${tempPassword}" WHERE ID=${tempID}`

  sqlmap.query(sql, (err, info)=>{

    if(err) {
      console.log(err)
      res.sendStatus(404)
     }

       
      if(req.session.user=="admin"){
            
        req.flash("msg", "Update Successfully")
        req.flash("alertType", "alert-success")
         res.redirect("/admin.profile")
  
        } else {
              
        req.flash("msg", "Update Successfully")
        req.flash("alertType", "alert-success")
         res.redirect("/user.profile")
  
        }
         
  })

  }

  else {

    if(req.session.user=="admin"){

      req.flash("msg", "Invalid Code")
      req.flash("alertType", "alert-danger")
      res.render("verify_user_profile", { msg: req.flash("msg"), alertType: req.flash("alertType")})



    }

    else {
      
      req.flash("msg", "Invalid Code")
      req.flash("alertType", "alert-danger")
      res.render("verify_user_profile", { msg: req.flash("msg"), alertType: req.flash("alertType")})

    }


 }

})





user()


app.get("/final.report", (req, res)=>{


  if(req.session.user=="admin") {
       

     sqlmap.query(`SELECT * FROM ${req.query.table_name}`, (err, col_data)=>{
 
       if(err) {
        console.log(err)
        res.sendStatus(404)
       }
       else {
       let reportName=req.query.table_name+ new Date(Date.now()).toDateString()
    
         const workSheet= XLSX.utils.json_to_sheet(col_data)
         const workBook= XLSX.utils.book_new()
         XLSX.utils.book_append_sheet(workBook, workSheet, "col_data")
         
         XLSX.write(workBook, {bookType: "xlsx", type: "buffer"})
         
         XLSX.write(workBook, {bookType: "xlsx", type: "binary"})
 
         XLSX.writeFile(workBook, `./report/${reportName}.xlsx`)
         
         res.download(`./report/${reportName}.xlsx`)
 
 
       }
 
     })
 
     
     
  }
  else res.redirect("/login.page")


})


app.use((req, res) => {
  res.status(404).send('<h1 style="background-color: red; text-align: center">N/A</h1>')
})
