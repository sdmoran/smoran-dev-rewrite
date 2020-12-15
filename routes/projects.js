const express = require('express')
const router = express.Router()

router.get('/:projectname', (req, res) => {
    const project = {
        title: req.params.projectname,
        blurb: "Here is some information about this project!"
    }
    res.render("pages/project", project)
});

module.exports = router