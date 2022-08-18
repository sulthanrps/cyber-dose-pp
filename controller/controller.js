const {User, Profile, Post} = require('../models/index')
const bcryptjs = require('bcryptjs')
const quote = require('find-quote')

class Controller {

    static homePage(req, res){
        res.render('landingPage')
    }

    static registerForm(req, res) {
        let errors = req.query.errors
        res.render('registerForm', {errors})
    }

    static saveUser(req, res){
        let body = {
            email : req.body.email,
            password : req.body.password,
            role : req.body.role,
            username : req.body.username
        }

        User.create(body)
        .then(() => {
            res.redirect('/login')
        })
        .catch(err => {
            if(err.name = 'SequelizeValidationError'){
                let errors = err.errors.map(el => el.message)
                res.redirect(`/register?errors=${errors}`);
                return
            }
            res.send(err)
        })
    }

    static loginForm(req, res){
        let error = req.query.error
        res.render('loginForm', {error})
    }

    static redirectAfterLogin(req, res){
        let {username, password} = req.body
        User.findOne({
            where : {username}
        })
        .then(user => {
            if(user){
                if(user.role == "Admin"){
                    const canLogin = bcryptjs.compareSync(password, user.password)
    
                    if(canLogin){
                        req.session.userId = user.id
                        res.redirect('/admin')
                    }
                    
                    else {
                        let error = "Password Invalid"
                        res.redirect(`/login?error=${error}`)
                    }
                }
    
                else if(user.role == "User"){
                    // res.send('Hi From User Page')
                    const canLogin = bcryptjs.compareSync(password, user.password)
    
                    if(canLogin){
                        req.session.userId = user.id
                        res.redirect(`/user/${user.id}`)
                    }
                    
                    else {
                        let error = "Password Invalid"
                        res.redirect(`/login?error=${error}`)
                    }
                }
            }

            else {
                let error = "Username Invalid"
                res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err => {
            res.send(err)
        })
    }

    static adminPage(req, res){
        User.findAll({
            where : {
                role: 'User'
            }
        })
        .then(data => {
            res.render('adminPage', {data})
        })
    }

    static deleteUser(req, res){
        let id = +req.params.idUser;
        User.destroy({
            where: {id}
        })
        .then(() => {
            res.redirect('/admin')
        })
        .catch(err => {
            res.send(err)
        })
    }

    static logout(req, res){
        req.session.destroy((err) => {
            if(err) res.send(err)
            else {
                res.redirect('/login')
            }
        })
    }

    static userPage(req, res){
        let UserId = +req.params.userId
        User.findOne({
            where : {id: UserId},
            include : {
                model: Profile
            }
        })
        .then(data => {
            Post.findAll({
                include : {
                    all : true,
                    nested: true
                },
                order : [
                    ['id', 'ASC']
                ]
            })
            .then(allPost => {
                res.render('userPage', {data, allPost})
            })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static saveAddedProfile(req, res){
        let id = +req.params.userId
        let body = {
            firstName : req.body.firstName,
            lastName : req.body.lastName, 
            birthDate : req.body.birthDate, 
            profileImgurl : req.body.profileImgurl,
            UserId : id
        }

        Profile.create(body)
        .then(() => {
            res.redirect(`/user/${id}`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static showProfile(req, res){
        let UserId = +req.params.userId 
        Profile.findOne({
            where : {UserId},
            include : {
                model: User
            }
        })
        .then(data => {
            res.render('userProfile', {data})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static updateProfileForm(req, res){
        let UserId = +req.params.userId
        Profile.findOne({
            where : {UserId}
        })
        .then(data => {
            res.render('editProfile', {data})
        })
    }

    static saveProfileChanges(req, res){
        let UserId = +req.params.userId
        let {firstName, lastName, birthDate, profileImgurl} = req.body
        Profile.update({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            profileImgurl: profileImgurl
        }, {where : {UserId}})
        .then(() => {
            res.redirect(`/user/${UserId}/profile`)
        })
        .catch(err => {
            res.send(err)
        })
    }


    static allPost(req, res){
        let option;
        let sort = req.query.sort
        let UserId = +req.params.userId
        if(sort){
            option = {
                where : {UserId},
                include : {
                    all : true,
                    nested: true
                },
                order : [
                    [sort, 'DESC']
                ]
            }
        }

        else {
            option = {
                where : {UserId},
                include : {
                    all : true,
                    nested: true
                },
                order : [
                    ['id', 'DESC']
                ]
            }
        }
        Post.findAll(option)
        .then(data => {
            res.render('posts', {data, UserId})
        })
        
    }

    static addPost(req, res){
        let userId = +req.params.userId
        let caption = req.query.caption
        res.render('addPost', {userId, caption})
    }

    static savePost(req, res){
        let userId = +req.params.userId
        let body = {
            caption : req.body.caption,
            imgUrl : req.body.imgUrl,
            UserId: userId
        }

        Post.create(body)
        .then(() => {
            res.redirect(`/user/${userId}/posts`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static updatePostForm(req, res){
        let userId = +req.params.userId
        let postId = +req.params.postId
        Post.findOne({
            where : {id: postId}
        })
        .then(data => {
            res.render('editPost', {data, userId, postId})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static savePostChanges(req, res){
        let userId = +req.params.userId
        let postId = +req.params.postId
        let {caption, imgUrl} = req.body
        Post.update({
            caption : caption,
            imgUrl : imgUrl
        }, {
            where : {id : postId}
        })
        .then(() => {
            res.redirect(`/user/${userId}/posts`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static deletePost(req, res){
        let userId = +req.params.userId
        let postId = +req.params.postId
        Post.destroy({
            where : {id : postId}
        })
        .then(() => {
            res.redirect(`/user/${userId}/posts`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static addLike(req, res){
        let userId = +req.params.userId
        let postId = +req.params.postId
        Post.increment({
            like : 1
        }, {
            where : {id: postId}
        })
        .then(() => {
            res.redirect(`/user/${userId}/posts`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static quotePage(req, res){
        let userId = +req.params.userId
        let randomQuote = quote.getQuote() 
        res.render('quotePage', {randomQuote, userId})
    }

    static addLikeFromGlobal(req, res){
        let userId = +req.params.userId
        let postId = +req.params.postId
        Post.increment({
            like : 1
        }, {
            where : {id: postId}
        })
        .then(() => {
            res.redirect(`/user/${userId}`)
        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = Controller