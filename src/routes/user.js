const express = require('express');
const Auth = require('../utils/auth');
const AuthMiddleware = require('../middlewares/authMiddleware');
const UserService = require('../services/userService');
const BlogService = require('../services/blogService');
const router = express.Router();

router.post('/users/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!username)
        return res.status(400).send({ message: "username is required." });
    if (username.length < 2 && username.length > 50)
        return res.status(400).send({ message: "username must have minimum 2 characters and at most 50 characters" });
    if (!email)
        return res.status(400).send({ message: "email is required." });
    if (!emailRegex.test(email)) return res.status(400).send({ message: "please enter a valid email. eg: parmeet@gmail.com" });
    if (email.length > 100) return res.status(400).send({ message: "email must be less than 100 characters." });
    if (!password)
        return res.status(400).send({ message: "password is required." });
    if (password.length < 8 && password.length > 20)
        return res.status(400).send({ message: "password must have minimum 8 characters and at most 20 characters" });
    const userService = new UserService();
    let _username = username.toLowerCase()
    const responseObj = await userService.create(_username, email,password);
    if (!responseObj.success) return res.status(400).send({ message: responseObj.message });
    const token = new Auth().encrypt({ id: responseObj.insertId });
    return res.status(201).send({ id: responseObj.data.insertId, token });
})


router.get('/users', new AuthMiddleware().authFilter, async (req, res) => {
    const { id } = req.user;
    const userService = new UserService()
    const blogService = new BlogService()
    const userDataArr = await userService.getUser(id);
    const blogDataArr = await blogService.getBlog(id);
    // console.log(userDataArr) 
    // console.log(blogDataArr);
    return res.status(201).send({ userDataArr, blogDataArr });


});
router.post('/users/login',async (req,res)=>{
    const {username,password}=req.body;
    if (!username)
        return res.status(400).send({ message: "username is required." });
    if (username.length < 2 && username.length > 50)
        return res.status(400).send({ message: "username must have minimum 2 characters and at most 50 characters" });
        if (!password)
        return res.status(400).send({ message: "password is required." });
    if (password.length < 8 && password.length > 20)
        return res.status(400).send({ message: "password must have minimum 8 characters and at most 20 characters" });
    const userService = new UserService();
    const response = await userService.getUserDetailsByUsernameAndPassword(username, password);
    if (!response.success) return res.status(400).send({ message: response.message });
    return res.status(200).send(response.data);
})
module.exports = router;