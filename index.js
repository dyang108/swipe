var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var sanitizerPlugin = require('mongoose-sanitizer');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
});

var mealSchema = new mongoose.Schema({
    user: String,
    img: String,
    hall: String,
    time: Date,
    numswipes: Number
});
// sanitize all fields except url... still not the safest.
mealSchema.plugin(sanitizerPlugin, {skip: ['img']});
var mealModel = mongoose.model('meals', mealSchema);

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
    // NEED SECURITY HERE!!
    if (!req.body.hall || !req.body.time ||
        !req.body.img || !req.body.user) {
        res.sendStatus(400);
        return;
    }

    var newMeal = new mealModel(req.body);
    newMeal.save(function (err) {
        if (err) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/getmeals', function (req, res) {
    // SECURITY? (might not be necessary for find)
    db.collection('meals').find({
        time: {
            $gt: new Date(req.query.start_time),
            $lt: new Date(req.query.end_time)
        }
    }).toArray().then(function (ret_val) {
        res.json(ret_val);
        res.end();
    });
});
