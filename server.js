const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs')

app.use('/files', express.static('files'))

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})