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



var server = app.listen(9083, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("SmartSearch app is listening at http://%s:%s", host, port)

});