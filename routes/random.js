const express = require('express')
const router = express.Router()
const API = require("../db/API")

let count = 0;
const padding = 5;

router.get('/count', (req, res) => {
    res.status(200).send(`${String(count).padStart(padding, '0')}`);
    count++;
});

router.post('/count', (req, res) => {
    try {
        for(let key in req.body) {
            const newVal = parseInt(key);
            console.log(newVal);
            console.log(newVal < 99999);

            if(newVal < 99999) {
                count = newVal > 0 ? newVal : 0;
                res.status(200).send(`${String(count).padStart(padding, '0')}`);
                break;
            }
        }
        res.status(401).send(`${String(count).padStart(padding, '0')}`);
    }
    catch(e) {
        console.log("failed: \n" + e)
        res.status(401).send(`${String(count).padStart(padding, '0')}`);
    }
});

module.exports = router;