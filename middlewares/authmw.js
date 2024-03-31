const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async(req, res, next) =>{
    try {
        const token = req.cookies.token || req.body.token || 
          req.header("Authorization").replace('Bearer ', ""); 

        //if token is missing then generate response
        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: 'Token missing, try again!',
            });
        }
        //Now verify the token
        try{
            const decodeval = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodeval;
            console.log(decodeval);
        } catch(error){
            return res.status(401).json({
                success: false,
                message: 'Token is invalid, try again!',
            })
        }
        next();
    } catch(error){
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}
exports.isStudent = async(req, res, next) =>{
    try {
        if(req.user.role!=='Student'){
            return res.status(401).json({
                success: false,
                message: 'No permission to render the page',
            })
        }
        next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: 'Invalid role, try again!',
        })
    }
}
exports.isAdmin = async(req, res, next) =>{
    console.log(req.user);
    try {
        if(req.user.role!=='Admin'){
            return res.status(401).json({
                success: false,
                message: 'No permission to render the page',
            })
        }
        next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: 'Invalid role, try again!',
        })
    }
}