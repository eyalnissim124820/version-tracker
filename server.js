const express = require('express')
const PORT = process.env.PORT || 8080;
const app = express();

const gitRoute = require('./routes/gitRoute')

app.use(express.json())

app.use('/git', gitRoute)

app.use('/', (req, res) => {
    res.send('main route');
})



app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});

module.exports = app;
