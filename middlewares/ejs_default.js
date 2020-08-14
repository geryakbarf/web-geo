module.exports = (req, res, next)=>{
    res.locals.title = "Emam Indonesia";
    next();
}