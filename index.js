const express = require('express');
const app = express();
const cors = require('cors');
const envDummy = require('./env_dummy.js');
const cookieParser = require("cookie-parser");

const port = process.env.PORT || envDummy.PORT;

const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); 
app.use(cors(corsOptions));

const router = require('./routes/router.js'); 

app.use('/api', router);

if(process.env.DB_NAME){
    app.listen(); 
}else{
    app.listen(port, () => console.log(`SERVER running on port ${port}`)); 
}