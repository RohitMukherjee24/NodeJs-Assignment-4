var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Dishes = require('../models/dishes');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get( Verify.verifyOrdinaryUser, (req, res, next)=> {
    Dishes.find({},  (err, dish)=> {
        if (err) throw err;
        res.json(dish);
    });
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Dishes.create(req.body,  (err, dish) =>{
        if (err) throw err;
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next) =>{
    Dishes.remove({},  (err, resp)=> {
        if (err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId')
.get( Verify.verifyOrdinaryUser,(req, res, next)=> {
    Dishes.findById(req.params.dishId,  (err, dish) =>{
        if (err) throw err;
        res.json(dish);
    });
})

.put( Verify.verifyOrdinaryUser,Verify.verifyAdmin,(req, res, next)=> {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    },  (err, dish) =>{
        if (err) throw err;
        res.json(dish);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Dishes.findByIdAndRemove(req.params.dishId,  (err, resp)=> {        
        if (err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId/comments')
.get( Verify.verifyOrdinaryUser,(req, res, next)=> {
    Dishes.findById(req.params.dishId,  (err, dish)=> {
        if (err) throw err;
        res.json(dish.comments);
    });
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Dishes.findById(req.params.dishId,  (err, dish)=> {
        if (err) throw err;
        dish.comments.push(req.body);
        dish.save( (err, dish)=> {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Dishes.findById(req.params.dishId,  (err, dish)=> {
        if (err) throw err;
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save( (err, result)=> {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.get( Verify.verifyOrdinaryUser,(req, res, next) =>{
    Dishes.findById(req.params.dishId,  (err, dish) =>{
        if (err) throw err;
        res.json(dish.comments.id(req.params.commentId));
    });
})

.put( Verify.verifyOrdinaryUser,Verify.verifyAdmin,(req, res, next) =>{
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId,  (err, dish) =>{
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        dish.comments.push(req.body);
        dish.save( (err, dish)=> {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete( Verify.verifyOrdinaryUser,Verify.verifyAdmin, (req, res, next)=> {
    Dishes.findById(req.params.dishId,  (err, dish) =>{
        dish.comments.id(req.params.commentId).remove();
        dish.save( (err, resp)=> {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = dishRouter;