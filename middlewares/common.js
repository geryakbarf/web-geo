module.exports = {
    commingsoon : function(req, res, next) {
        if(process.env.COMINGSOON && process.env.COMINGSOON == 'true'){
            res.redirect('coming-soon');
        }
        next();
    }
}