const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000
const routes = require('./routes/index')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : true}))
app.use(session({
    secret: "Rahasia Dagang",
    resave: false,
    saveUninitialized: false,
    cookie : {
        secure: false,
        sameSite: true
    }
}))
app.use(routes)

app.listen(port, () => {
    console.log(`This Project is running on port ${port}`);
})