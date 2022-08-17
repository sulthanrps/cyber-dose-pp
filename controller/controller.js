const {User, Profile} = require('../models/index')
const bcryptjs = require('bcryptjs')

class Controller {
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
        Profile.findOne({
            where : {UserId},
            include : {
                model: User
            }
        })
        .then(data => {
            res.render('userPage', {data})
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
        let UserId = +req.params.userId
        res.send('tampilin semua post dari id ' + UserId)
    }

    static addPost(req, res){
        let UserId = +req.params.userId
        res.send('tampilin form add post dengan id ' + UserId)
    }

    static savePost(req, res){
        let UserId = +req.params.userId
        res.send('save data post untuk user id ' + UserId)
    }

    static updatePostForm(req, res){
        let UserId = +req.params.userId
        res.send('tampilin form edit post untuk user id ' + UserId)
    }

    static savePostChanges(req, res){
        let UserId = +req.params.userId
        res.send('save edited data post untuk user id ' + UserId)
    }

    static deletePost(req, res){
        let UserId = +req.params.userId
        res.send('delete data post untuk user id ' + UserId)
    }
}

module.exports = Controller