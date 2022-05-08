const express = require('express');
const app = express();
const cors = require('cors');
const envDummy = require('./env_dummy.js');
const cookieParser = require("cookie-parser");

const port = process.env.PORT || envDummy.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); 

const router = require('./routes/router.js'); 

app.use('/api', router);

app.listen(port, () => console.log(`SERVER running on port ${port}`)); 