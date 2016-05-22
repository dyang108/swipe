var express = require('express');
var bodyParser = require('body-parser');
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
});

db.collection('meals').createIndex({ time: 1 });
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});

app.get('/upcomingmeals', function (req, res) {

});

app.post('/postmeal', function (req, res) {
    // NEED SECURITY HERE!!!
    db.collection('meals').insert(req.body);
    res.sendStatus(200);
});

app.get('/getmeals', function (req, res) {
    // SECURITY? (might not be necessary for find)
    db.collection('meals').find({
        time: {
            $gt: req.query.start_time
        }
    }).toArray().then(function (ret_val) {
        res.json(ret_val);
        res.end();
    });
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
