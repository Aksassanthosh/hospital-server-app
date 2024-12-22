const express = require('express');
const bodyParser = require('body-parser');
const hospitalsRouter = require('./routes/hospitals');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


app.use('/hospitals', hospitalsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
