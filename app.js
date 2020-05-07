"use strict";
exports.__esModule = true;
var express = require("express");
var fileUpload = require("express-fileupload");
var createError = require("http-errors");
var path = require("path");
var logger = require("morgan");
var expenses_1 = require("./routes/expenses");
var app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');
    next();
});
app.use(logger('dev'));
app.use(fileUpload({
    limit: { fileSize: Infinity }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));
app.use('/expenses', expenses_1["default"]);
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    var message = err.message;
    var error = req.app.get('env') === 'development' ? err : {};
    var status = err.status || 500;
    res.status(status || 500);
    res.send({
        status: status,
        message: message,
        error: error
    });
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
// app.listen(3000)
// console.log('API running at http://localhost:3000')
