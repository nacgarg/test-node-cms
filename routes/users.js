var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected')
});

var userSchema = mongoose.Schema({
    name: String,
    password: String
});
var User = mongoose.model('User', userSchema);


/* GET users listing. */
router.get('/', function(req, res) {
    var userarr = [];
    User.find({}, function(err, user) {
        for (var i = user.length - 1; i >= 0; i--) {
            userarr[i] = user[i].name
        };
        var html = '';
        for (var i = userarr.length - 1; i >= 0; i--) {
            html += "<h4><li><a href=/users/" + userarr[i] + ">" + userarr[i] + "</a></li>"
        };
        res.send(html)
    });
});


router.get('/add', function(req, res) {
    var bob = new User({
        name: req.query['name'],
        password: req.query['password']
    });
    if (req.query['name'] && req.query['password']) {
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
            }
        });
    } else {
        res.render('add', {
            title: 'uhhhh',
            message: 'you need to pass a name and password url param'
        });
    }
});


router.get('/:name', function(req, res) {
    User.findOne({
        name: req.params.name
    }, function(err, user) {
        if (err) res.send('uh oh')
        var html = '<h4>name: ' + user.name + '<br>password: ' + user.password
        res.send(html);
    })
});

router.get('/remove/:name/', function(req, res) {
    if (req.params.name) {
        User.findOne({
            name: req.params.name
        }, function(err, user) {
            if (err) res.send('doesn\'t exist')
            User.remove({
                name: req.params.name
            }, function(err, user) {
                if (err) res.send('uh oh')
                res.send('done');
            })
        })
    } else {
        res.send('who????')
    }
});

module.exports = router;