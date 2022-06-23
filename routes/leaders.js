const express = require('express')

const bodyParser = require('body-parser')

const Leaders = require('../models/leaders')

var authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .get((req, res) => {
        Leaders.find()
            .then((leaders) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (error) => next(err))
            .catch((error) => next(error))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Leaders.create(req.body)
            .then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (error) => next(error))
            .catch((error) => next(error))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /leaders`)
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Leaders.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (error) => next(error))
            .catch((error) => next(error))
    })

leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                console.log(`leader = ${leader}`)
                console.log('(leader == null)')
                if (leader == null) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ "error": "not found" })
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (error) => next(error))
            .catch((error) => next(error))
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
            .then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            })
            .catch((error) => next(error))
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = leaderRouter