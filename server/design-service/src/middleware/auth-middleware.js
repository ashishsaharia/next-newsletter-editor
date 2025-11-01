const autheticatedRequest = (req, res, next) => {   
    const userId = req.headers['x-user-id']; 
    if(!userId)
    {
        return res.status(401).json({
            error : "access denied! login to continue"
        })
    }

    req.user = {userId}; 
    next(); 
}

module.exports = autheticatedRequest; 