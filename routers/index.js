module.exports = (app) => {
    app.use(require('./web'))
    app.use('/admin',require('./admin'))
}