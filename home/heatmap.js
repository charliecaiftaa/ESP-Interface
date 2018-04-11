var express  = require('express');
var app      = express();
var mysql = require('mysql');
var port = 9091;

var connection = mysql.createConnection({
    multipleStatements: true,
    host: '10.11.4.97',
    user: 'AppUser',
    password: 'Special888%',
    database: 'FAWv4'
});

app.get('/heatmap', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross domain header

    var myStat = "SELECT latitude, longitude FROM FAWv4.Historical_Heatmap_Data;";

    connection.query(myStat, function(err, results, fields) {
        if (err) {
            console.log(err);
            res.send("fail");
            res.end();
        } else {
            // console.log(results);
            res.send(results);
            res.end();
        }
    });
});

app.listen(port);
console.log('The magic happens on port ' + port);