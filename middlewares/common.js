module.exports = {
    commingsoon : function(req, res, next) {
        if(process.env.COMINGSOON && process.env.COMINGSOON == 'true'){
            return res.redirect('coming-soon');
        }
        next();
    }
}