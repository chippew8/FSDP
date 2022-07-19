const express = require('express')
const router = express.Router();
const moment = require('moment');
const Promotion = require('../models/Promotion');
const flashMessage = require('../helpers/messenger');
// const ensureAuthenticated = require('../helpers/auth');

router.get('/listPromotions', (req, res) => {
    Promotion.findAll({
        order: [['code', 'DESC']],
        raw: true
    })
        .then((promotion) => {
            res.render('promos/listPromotions', { promotion });
        })
        .catch(err => console.log(err));
});

router.get('/addPromotion', (req, res) => {
    res.render('promos/addPromotion');
});

router.post('/addPromotion', (req, res) => {
    let headline = req.body.headline;
    let description = req.body.description.slice(0, 4999);
    // Multi-value components return array of strings or undefined
    let code = req.body.code;
    let promotionFound = Promotion.findOne({ where: { code: code } });
         if (promotionFound) {
             // If promotionFound is found, that means code is in use
             flashMessage(res, 'error', code + ' is already in use.');
            res.render('promos/addPromotion');
            }
        else {
            Promotion.create(
                { headline, description, code }
            )
            .then((promotion) => {
                console.log(promotion.toJSON());
                res.redirect('/promos/listPromotions');
            })
            .catch(err => console.log(err))
        }
});

router.get('/editPromotion/:id', (req, res) => {
    Promotion.findByPk(req.params.id)
        .then((promotion) => {
            res.render('promos/editPromotion', { promotion });
        })
        .catch(err => console.log(err));
});

router.post('/editPromotion/:id', (req, res) => {
    let headline = req.body.headline;
    let description = req.body.description.slice(0, 4999);
    // Multi-value components return array of strings or undefined
    let code = req.body.code;

    Promotion.update(
        { headline, description, code },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' Promotion updated');
            res.redirect('/promos/listPromotions');
        })
        .catch(err => console.log(err));
});

router.get('/deletePromotion/:id', async function(req, res) {
    try {
            let promo = await Promotion.findByPk(req.params.id);
            console.log(promo)
        if (!promo) {
            flashMessage(res, 'error', 'Promotion not found');
            res.redirect('/promos/listPromotions');
            return;
        }
        // if (req.user.id != video.userId) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/video/listVideos');
        //     return;
        // }   
        let result = await Promotion.destroy({ where: { id: promo.id } });
        console.log(result + ' Promotion deleted');
        res.redirect('/promos/listPromotions');
    }
    catch (err) {
        console.log(err);   
    }
});

module.exports = router;