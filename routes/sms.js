const express = require('express')
const router = express.Router()
const API = require("../db/API")

const SMS_SECRET = process.env.SMS_SECRET;

const secretConfigured = function(req, res, next) {
    if(!SMS_SECRET) {
        res.render("pages/404")
    }
    else {
        next()
    }
}

router.post('/incoming/' + SMS_SECRET, secretConfigured, (req, res) => {
    console.log(req.body);
    API.addMessage(req.body);
    res.status(200).send("OK")
})

router.get('/messages/' + SMS_SECRET, secretConfigured, (req, res) => {
    API.getMessages()
    .then(
        msgs => {
            console.log(msgs)
            res.status(200).send(msgs);
        }
    )
})

module.exports = router;