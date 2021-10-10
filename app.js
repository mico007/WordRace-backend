const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const playerRoutes = require('./routes/player-routes');
const scoreRoutes = require('./routes/score-routes');

const app = express();

mongoose.connect(process.env.mongoDbUrl, { useUnifiedTopology: true, useNewUrlParser: true }).then(db => {
    console.log('MongoDB CONNECTED');
}).catch(err => {
    console.log('COULD NOT BE CONNECTED ' + err);
})

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    next();
});

app.use("/api/players", playerRoutes);
app.use("/api/score", scoreRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// this handles sending errors to front-end
app.use((error, req, res, next) => {

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})