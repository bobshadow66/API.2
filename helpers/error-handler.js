function errorHandler(err, req, res, next) {
    if (err.name === 'UnathorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: "The user is not Authorized" });
    } 

    if (err.name === 'VaildationError') {
        //validation error
        return res.status(401).json({message: err})

   }
   // default to 500 server error
   return res.status(500).json({err})
}