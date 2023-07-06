var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public')); //__dir and not _dir
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});
var port = 8080; // you can use any port
app.listen(port);
console.log('server on ' + port);