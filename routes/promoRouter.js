var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');

var Promotion = require('../models/promotions');

var PromoRouter = express.Router();
PromoRouter.use(bodyParser.json());

PromoRouter.route('/')
.get( Verify.verifyOrdinaryUser, (req, res, next)=> {
    Promotion.find({},  (err, Promo)=> {
        if (err) throw err;
        res.json(Promo);
    });
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next) =>{
    Promotion.create(req.body,  (err, Promo)=> {
        if (err) throw err;
        console.log('Promo created!');
        var id = Promo._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Promo with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next) =>{
    Promotion.remove({},  (err, resp)=> {
        if (err) throw err;
        res.json(resp);
    });
});

PromoRouter.route('/:PromoId')
.get(Verify.verifyOrdinaryUser, (req, res, next)=> {
    Promotion.findById(req.params.PromoId,  (err, Promo)=> {
        if (err) throw err;
        res.json(Promo);
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Promotion.findByIdAndUpdate(req.params.PromoId, {
        $set: req.body
    }, {
        new: true
    },  (err, Promo) =>{
        if (err) throw err;
        res.json(Promo);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Promotion.findByIdAndRemove(req.params.PromoId,  (err, resp) =>{       
             if (err) throw err;
        res.json(resp);
    });
});


module.exports = PromoRouter;