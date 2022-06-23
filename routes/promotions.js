const express = require('express')

const bodyParser = require('body-parser')

const Promotions = require('../models/promotions')

const authenticate = require('../authenticate')

const promoRouter = express.Router();

promoRouter.use(bodyParser.json())

promoRouter.route('/')
    .get((req, res) => {
        Promotions.find()
            .then((promotions) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (error) => next(err))
            .catch((error) => next(error))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Promotions.create(req.body)
            .then((promotion) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            }, (error) => next(error))
            .catch((error) => next(error))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /promotions`)
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Promotions.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (error) => next(error))
            .catch((error) => next(error))
    })

promoRouter.route('/:promotionId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promotionId)
            .then((promotion) => {
                console.log(`promotion = ${promotion}`)
                console.log('(promotion == null)')
                if (promotion == null) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ "error": "not found" })
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            }, (error) => next(error))
            .catch((error) => next(error))
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promotionId, { $set: req.body }, { new: true })
            .then((promotion) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            })
            .catch((error) => next(error))
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promotionId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = promoRouter