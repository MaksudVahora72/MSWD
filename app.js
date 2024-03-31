const express = require('express')
const app = express();

const cookieParser = require('cookie-parser');

require('./config/dbconfig').dbconnect();

require('dotenv').config();
const port = process.env.PORT | 4000;

app.use(express.json());
app.use(cookieParser());

const userroute = require('./routes/userroute');
app.use('/api/v1', userroute);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to application</h1>");
})

app.listen(port, () => {
    console.log(`Server is running on :http://localhost:${port}`)
})