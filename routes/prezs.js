var express = require('express');
var router = express.Router();

/*
 * GET list of candidate .
 */
router.get('/prezlist', function(req, res) {
    var db = req.db;
    var collection = db.get('prezlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to add president candidate
 */
router.post('/addprez', function(req, res) {
    var db = req.db;
    var collection = db.get('prezlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to remove candiate.
 */
router.delete('/deleteprez/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('prezlist');
    var prezToDelete = req.params.id;
    collection.remove({ '_id' : prezToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
