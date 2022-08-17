const Controller = require('../controller/controller')

const routes = require('express').Router()

// ENDPOINT REGISTER
routes.get('/register', Controller.registerForm)
routes.post('/register', Controller.saveUser)

// ENDPOINT LOGIN
routes.get('/login', Controller.loginForm)
routes.post('/login', Controller.redirectAfterLogin)

// MIDDLEWARE TO CHECK IF THE USER / ADMIN HAS LOGIN BEFOREWARDS
routes.use((req, res, next) => {
    if(req.session.userId){
        next()
    }

    else {
        let error = "Please Login First !"
        res.redirect(`/login?error=${error}`)
    }
})

// ENDPOINT LOGOUT
routes.get('/logout', Controller.logout)

// ENDPOINT ADMIN
routes.get('/admin', Controller.adminPage)
routes.get('/admin/delete/:idUser', Controller.deleteUser)

// ENDPOINT USER
routes.get('/user/:userId', Controller.userPage)
routes.get('/user/:userId/profile', Controller.showProfile)
routes.get('/user/:userId/profile/editProfile', Controller.updateProfileForm)
routes.post('/user/:userId/profile/editProfile', Controller.saveProfileChanges)
routes.get('/user/:userId/posts', Controller.allPost)
routes.get('/user/:userId/posts/add', Controller.addPost)
routes.post('/user/:userId/posts/add', Controller.savePost)
routes.get('/user/:userId/posts/edit/:idPost', Controller.updatePostForm)
routes.post('/user/:userId/posts/edit/:idPost', Controller.savePostChanges)
routes.get('/user/:userId/posts/delete/:idPost', Controller.deletePost)

// ENDPOINT MVP (MOVIE QUOTES)

module.exports = routes