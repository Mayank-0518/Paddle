const jwt=require('jsonwebtoken');
const{JWT_SECRET_USER} = require('../config');

function userMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET_USER);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports={
    userMiddleware:userMiddleware
}