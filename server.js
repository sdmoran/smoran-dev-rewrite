const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const projectRoutes = require('./routes/projects');

app.set('view engine', 'ejs');

app.use('/files', express.static('files'));
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
    res.render('pages/index')
});

app.get('*', (req, res) => {
    res.render('pages/404')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})