const app = require('./bootstrap')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listen the app at :${port}`)
})