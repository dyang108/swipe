var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
    // we're connected!
});


app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});

app.get('/upcomingmeals', function (req, res) {

});

app.post('/postmeal', function (req, res) {

});

// app.get('/eat', function (req, res) {
//     res.sendFile('/eat.html');
// });

// app.get('/post', function (req, res) {
//     res.sendFile('/post.html');
// });

// app.get('/chat', function (req, res) {
//     res.sendFile('/chat.html');
// });

// app.get('/profile', function (req, res) {
//     res.sendFile('/profile.html');
// });

// app.post('/login', function (req, res) {
//     res.send({});
// });
