var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");

let app = express();
app.listen(2004, function () {
    console.log("server started");
})

app.use(express.static("public"));
app.use(express.urlencoded("true"));

app.use(fileuploader());

const config = {
      host: "127.0.0.1",
      user: "root",
      password: "Goodvibesonly@123",
      database: "project",
    };

var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)

        console.log("connected to database successfully :-)");
    else
        console.log(err.message);
})


app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";

    resp.sendFile(path);
});


app.get("/signup-process", function (req, resp) {
    //console.log("hlo");
    let email = req.query.txtEmail;
    let pwd = req.query.pwd;
    let utype = req.query.combo;

    mysql.query("insert into users values(?,?,?,1)", [email, pwd, utype], function (err,result) {
        if (err == null) {
            resp.send("SignedUp Successfullyy");
            
        }
        else
            resp.send(err.message);
    })
})
app.get("/login-process", function (req, resp) {
    let email = req.query.txtemail;
    let pwd = req.query.txtpass;

    mysql.query("select * from users where email=? and pwd=?", [email, pwd], function (err, result) {
        if (err != null)//means some error
        {
            resp.send(err.message);
            return;
        }

        else {
            if (result.length == 0) {
                resp.send("invalid id");
            }
            if (result[0].status == 1) {
                // resp.send("logged in successfully");
                resp.send(result[0].utype);
            }
            else {
                resp.send("chl bhaag yaha se");
            }
        }
        console.log(result);
    })
})
// for profile

app.get("/influencer-dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
})

app.get("/profile-influencer", function (req, resp) {
    let path = __dirname + "/public/infl-profile.html";
    resp.sendFile(path);
})

app.post("/save-profile", function (req, resp) {
    console.log(req.body);
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else
        fileName = "nopic.jpg";

    let email = req.body.txtemail;
    let name = req.body.txtname;
    let address = req.body.txtadd;
    let city = req.body.txtcity;
    let insta = req.body.txtinsta;
    let youtube = req.body.txtutube;
    let content = req.body.selcont;
    let gender = req.body.selgen;
    let dob = req.body.txtdob;
    let other = req.body.txtinfo
    let ary=req.body.selcont;
    let str;
    if(Array.isArray(ary))
        {
         str="";
    for(i=0;i<ary.length;i++)
        {
            str+=ary[i]+",";
        }
    console.log(str);
        }
        else
        str=ary;
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?)", [email, name, address, city, insta, youtube,str, gender, dob, other, fileName], function (err) {
        if (err == null) {
            resp.send("data inserted");
        }
        else {
            resp.send(err.message);
        }
    })

})
app.post("/update-profile", function (req, resp) {
    console.log(req.body);

    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else 
        fileName=req.body.hidden;
    
    //console.log(fileName);
    let email = req.body.txtemail;
    let name = req.body.txtname;
    let address = req.body.txtadd;
    let city = req.body.txtcity;
    let insta = req.body.txtinsta;
    let youtube = req.body.txtutube;
    let content = req.body.selcont;
    let gender = req.body.selgen;
    let dob = req.body.txtdob;
    let otherinfo = req.body.txtinfo;

    mysql.query("update iprofile set name=?,address=?,city=?,insta=?,youtube=?,content=?,gender=?,dob=?,otherinfo=?,ppic=? where email=?",
     [name, address, city, insta, youtube, content, gender, dob, otherinfo, fileName, email], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1)
                resp.send("Updated successfully");
            else
                resp.send("invalid id");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/find-influ-details",function(req,resp)
{
    
  let Email=req.query.txtemail;
  mysql.query("select * from iprofile where email=?",[Email],function(err,resultJsonAry){
    if(err!=null)
    {
        // console.log(err.message);
        // console.log("helo");
        resp.send(err.message);
        return;
    }
    
    console.log(resultJsonAry);
    resp.send(resultJsonAry);
  })
})
app.get("/save-booking", function (req, resp) {
    let email = req.query.txtEmail;
    let address = req.query.txtAddress;
    let date = req.query.txtdate;
    let time = req.query.txttime;
    let city = req.query.txtcity;
    let venue = req.query.txtvenue;

    mysql.query("insert into event values(?,?,?,?,?,?)", [email, address, date, time, city, venue], function (err) {
        if (err == null) {
            resp.send("booked sucessfully");
        }
        else
            resp.send(err.message);
    })
})
app.get("/pass-update",function(req,resp)
{
    console.log("done");
    let email=req.query.txtmail;
    let opass=req.query.txtopass;
    let npass=req.query.txtnpass;

    mysql.query("select * from users where email=? and pwd=?",[email,opass],function(err,result){
        console.log(result);
        if(result)
        {
          mysql.query("update users set pwd=? where email=?",[npass,email],function(err,result){
            if(err==null)
            {
                resp.send("updated successfully");
                console.log("updated sccessfully");
            }
            else
            resp.send(err.message);
          })
        }
        else
        {
            resp.send("wrong password")
        }
    })
})

app.get("/Admin-dash", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})
app.get("/admin-users",function(req,resp)
{
    let path=__dirname+"/public/Admin-users.html";
    resp.sendFile(path);
})

//------=============--------------==================--------------============
app.get("/fetch-all-emails",function(req,resp)
{
    mysql.query("select distinct email from users",function(err,resultJsonAry){
        if (err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
//wwwwww

app.get("/fetch-all",function(req,resp){
    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })
})
//wwwwwwwwww
app.get("/fetch-some",function(req,resp){
    mysql.query("select * from users where email=?",[req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})
//wwwwwwwwwwwwwwwwwwww

app.get("/del-one",function(req,resp){
    mysql.query("delete  from users where email=?",[req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("Deleted");
    })
})
//wwwwwwwwwwwwwwwwwwwwww
app.get("/block-one",function(req,resp){
    mysql.query("update users set status=? where email=?",[0,req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("blocked");
    })
})
//wwwwwwwwwwwwwww
app.get("/unblock-one",function(req,resp){
    mysql.query("update users set status=? where email=?",[1,req.query.email],function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("unblocked");
    })
})
//---------------------------------------------------
app.get("/admin-all-influ",function(req,resp)
{
    let path=__dirname+"/public/admin-all-influ.html";
    resp.sendFile(path);
})

//wwwwwwwwww
app.get("/fetch-influ-emails",function(req,resp)
{
    const Influencer = 'Influencer';
    mysql.query("select * from  iprofile",function(err,resultJsonAry){
        if (err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
//wwwwwwwwwwww
app.get("/event-manager", function (req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
})
app.get("/fetch-events",function(req,resp)
{
    
    mysql.query("select * from  event where email=?",[req.query.email],function(err,resultJsonAry){
        if (err!=null)
        {
            console.log(err.message);
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})
app.get("/del-events",function(req,resp){
    mysql.query("delete from event where Srno",function(err,result){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("Deleted");
    })
})