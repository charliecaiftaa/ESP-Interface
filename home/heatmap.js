var express  = require('express');
var app      = express();
var mysql = require('mysql');
var port = 8091;

var connection = mysql.createConnection({
    multipleStatements: true,
    host: '10.11.4.97',
    user: 'AppUser',
    password: 'Special888%',
    database: 'whs'
});

app.get('/heatmap', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross domain header

    var myStat = "SELECT LatiDecimal, LongDecimal FROM whs.Sites WHERE LatiDecimal != '' AND LongDecimal != '';";

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