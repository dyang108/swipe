var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.use(express.static(__dirname));

app.get(['/', '/eat', '/post', '/chat', '/profile'], function(req, res) {
    res.sendFile('/index.html');
});