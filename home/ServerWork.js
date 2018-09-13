var express = require('express');
var bodyParser = require ('body-parser');
var cors = require('cors');
var app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "10.11.90.15",
    user: "Amy",
    password: "@mesMING1010656",
    database: "CitySmart"
});
// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));

app.get('/66', function(req, res) {
    console.log("Hello traveler");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross domain header
    var select = "SELECT * FROM CitySmart.placemarkinfo;";
    con.query(select, function (err, result) {
        if (err) throw err;
        else {
            console.log(result);
            res.json({"err": false, "data": result});
        }
    });
});




app.listen(3005, function(){ console.log('Example app listening on port 3005!')});
//
// to make a new route here, to read html file, return the content of that html here. And then display


// var json = require()
// var http = require('http');
// var fs = require('fs');
//
// http.createServer(function(req, res)  {
//     fs.readFile('read.html', function(err, data) {
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//     });
// }).listen(8085);


// router.post('LayerNCC.json', function(req,res) {
//     console.log(req);
//     console.log('req received')
//     ;
// });
//
//


//
// con.connect(function(err) {
//
//     var c2 = ['A World Bridge','Alaska, USA'];
//
//     var c3 = ['A World Bridge Headquarters','Kodiak, Alaska'];
//
// //     var c4 = ['Real-time, Real-world Project Based Learning','A World Bridge Project Site: Kodiak Island Borough School District'];
// //
// if (err) throw err;
// console.log("Connected!");
// var remove = 'DELETE FROM PracticeTable';
// con.query(remove, function (err, result) {
//     for (var i = 0; i<c2.length; i++) {
//         var sql = 'INSERT INTO PracticeTable (Location, Site_Name, Site_Description) VALUES ( "' + c2[i] + '" , "' + c3[i] + '", "' + c4[i] + '")';
//         con.query( sql, function (err, result) {
//             if (err) throw err;
//             console.log("1 record inserted");
//
//         });
//     }
//
// });

