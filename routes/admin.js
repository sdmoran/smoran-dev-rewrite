const express = require('express')
const router = express.Router()
const API = require("../db/API")
const mode = process.env.MODE || "prod";


const devOnly = function(req, res, next) {
    if(mode != "dev") {
        res.render("pages/404")
    }
    else {
        next()
    }
}

router.get('/add', devOnly, (req, res) => {
    res.render("admin/add_project")
})

router.get('/', devOnly, (req, res) => {
    res.render("admin/dashboard")
})

module.exports = router