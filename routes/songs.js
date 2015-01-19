var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected')
});

var songSchema = mongoose.Schema({
    name: String,
    artist: String,
    html: String
});
var Song = mongoose.model('Song', songSchema);


/* GET users listing. */
router.get('/', function(req, res) {
    var userarr = [];
    Song.find({}, function(err, user) {
        for (var i = user.length - 1; i >= 0; i--) {
            userarr[i] = user[i].name
        };
        var html = '';
        for (var i = userarr.length - 1; i >= 0; i--) {
            html += "<h4><li><a href='/songs/" + userarr[i] + "'>" + userarr[i] + "</a></li>"
        };
        res.send(html)
    });
});


router.get('/add', function(req, res) {
    var bob = new Song({
        name: req.query['name'],
        artist: req.query['artist'],
        html: req.query['html']
    });
    if (req.query['name'] && req.query['artist'] && req.query['html']) {
        bob.save(function(err, fluffy) {
            if (err) {
                res.render('add', {
                    title: 'ERROR :((((('
                });
            } else {

                res.render('add', {
                    title: 'it worked! :O',
                    message: 'yayayay'
                });
                res.redirect("/songs");
            }
        });
    } else {
        res.render('add', {
            title: 'uhhhh',
            message: 'you need to pass a name, artist and html url param'
        });
        res.redirect("/songs");
    }
});


router.get('/:name', function(req, res) {
    Song.findOne({
        name: req.params.name
    }, function(err, user) {
        if (err) {
            res.send('uh oh')
        }
        var html = '<h4>name: ' + user.name + '<br>artist: ' + user.artist + '<br><br>' + user.html
        res.send(html);
    })
});

router.get('/remove/:name/', function(req, res) {
    if (req.params.name) {
        Song.findOne({
            name: req.params.name
        }, function(err, user) {
            if (err) res.send('doesn\'t exist')
            Song.remove({
                name: req.params.name
            }, function(err, user) {
                if (err) res.send('uh oh')
                res.send('done');
            res.redirect("/songs");
            })
        })
    } else {
        res.send('what????')
    }
});

module.exports = router;