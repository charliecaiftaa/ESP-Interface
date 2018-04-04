/**
 * Created by imacbig04 on 4/28/17.
 */

var express = require('express');
var app = express();


var mysql = require('mysql');

// http://nodejs.org/docs/v0.6.5/api/fs.html#fs.writeFile
var fs = require('fs');

var connection = mysql.createConnection({
    multipleStatements: true,
    host: '10.11.4.97',
    user: 'AppUser',
    password: 'Special888%',
    database: 'CitySmart'
});

var names = "";

/*
app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
});
*/


app.get('/searchSite', function (req, res) {

    var sql1 = 'Select SiteID, CountryCode, CountryName, ContinentCode, CorrectLatiDecimal AS LatiDecimal, CorrectLongDecimal AS LongDecimal From Sites WHERE CorrectLatiDecimal <> 0 and CorrectLongDecimal <> 0; ';
    var sql2 = 'Select SiteID, CountryCode, CountryName, ContinentCode, LatiDecimal, LongDecimal From Sites WHERE CorrectLatiDecimal = "" AND CorrectLongDecimal = ""; ';
    var sql3 = 'Select * from Continent; ';
    var sql4 = 'Select CountryCode from Country WHERE ContinentCode = "NA"; ';
    var sql5 = 'SELECT Count(SiteID) FROM Sites; ';

    connection.query(sql1+sql2, function(err, results, fields) {
        if (err) throw err;

        var result1 = results[0];
        var result2 = results[1];
        var resultsAll = result1.concat(result2);
        var JSONresult = JSON.stringify(resultsAll, null, "\t");
        //console.log(JSONresult);
        var origin = req.headers.origin;
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.send(JSONresult);
        res.end();

    });
});





var server = app.listen(9083, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("SmartSearch app is listening at http://%s:%s", host, port)

});