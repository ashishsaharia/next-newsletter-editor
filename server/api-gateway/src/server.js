require ('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const helmet = require('helmet'); 
const proxy = require('express-http-proxy'); 

const authMiddleware = require("./middleware/auth-middleware");


const app = express()
const PORT = process.env.PORT || 5000; 

app.use(helmet());
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({extended : true})); 

//proxy options 
const proxyOptions = {
    proxyReqPathResolver : (req) => {
        return req.originalUrl.replace(/^\v1/, '/api')
    }, 
    proxyErrorHandler : (err, res, next) => {
        res.status(500).json({
            message : "internal server error", 
            error : err.message,
        })
    }
};

app.use('/v1/media',authMiddleware,  proxy(process.env.UPLOAD, {
    ...proxyOptions,
     parseReqBody : false,
}));

app.use('/v1/designs', authMiddleware, proxy(process.env.DESIGN, {
    ...proxyOptions,
}));

app.use('/v1/subscription',authMiddleware, proxy(process.env.SUBSCRIPTION, {
    ...proxyOptions,
}));


app.listen(PORT, ()=>{
    console.log("api gateway is running on port " + PORT); 
    console.log("desing service is running on port " + process.env.DESIGN); 
    console.log("upload service is running on port " + process.env.UPLOAD); 
    console.log("subscription service is running on port " + process.env.SUBSCRIPTION); 

})