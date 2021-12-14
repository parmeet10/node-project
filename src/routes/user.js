const express = require('express');
const Auth = require('../utils/auth');
const AuthMiddleware = require('../middlewares/authMiddleware');
const UserService = require('../services/userService');
const BlogService = require('../services/blogService');
const req = require('express/lib/request');
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
    const responseObj = await userService.create(_username, email, password);
    if (!responseObj.success) return res.status(400).send({ message: responseObj.message });
    const token = new Auth().encrypt({ id: responseObj.data.insertId });
    return res.status(201).send({ id: responseObj.data.insertId, token });
})


router.get('/users', new AuthMiddleware().authFilter, async (req, res) => {  //api to extract userdetails and blogs of that user
    const { id } = req.user;
    const userService = new UserService()
    const blogService = new BlogService()
    const userDataArr = await userService.getUser(id);
    const blogDataArr = await blogService.getBlog(id);
    // console.log(userDataArr) 
     console.log(blogDataArr);
    return res.status(201).send({ userDataArr, blogDataArr });


});
router.post('/users/login', async (req, res) => {//api to login user using username and password
    const { username, password } = req.body;
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
router.delete('/users/delete', new AuthMiddleware().authFilter, async (req, res) => {//api to delete specific user
    const { id } = req.user;
    const userService = new UserService();
    const deletedUser = await userService.deleteUserById(id);
    if (deletedUser.success)
        return res.status(200).send({ message: `user succesfully deleted of id:${id}` })
    else
        return res.status(500).send({ message: `deletion is not successful` });
})
router.get('/users/listUsers',new AuthMiddleware().authFilter, async (req,res)=>{//api to list all users except current user
    const{id}=req.user;
    const userService=new UserService();
    const usersList=await userService.listAllUsers(id);
    return res.status(302).send(usersList);

})

router.get('/users/:id/blogs',async (req,res)=>{    //api to extract other users blogs
    const {id} = req.params;
    let blogs={
        title:[],
      
    }
    const blogService = new BlogService()
    const blogDataArr = await blogService.getBlog(id);
    for (let blog of blogDataArr)
    {
        blogs.title.push(blog.title)
        blogs.title.push(blog.description)
    }
    res.status(302).send(blogs.title);
})

router.post('/users/:userid/blogcomments', new AuthMiddleware().authFilter,async (req,res)=>{
    const {id}=req.user;
    const {userid}=req.params;
    const {comment}=req.body;
    const userService=new UserService();
    const blogService = new BlogService()
    const commentingUser= await userService.getUser(id);
    const userExistCheck=await userService.getUser(userid);
    if(!comment) 
                res.status(400).send({message:`comment field cannot be empty`})
    if(comment.length<1 &&comment.length>400)
                res.status(400).send({message:`comment must have minimum 2 characters and at most 400 characters`})
    if(userExistCheck.length){
                const userToCommented=await blogService.getBlog(userid)
    if(userToCommented.length){
                const commentOnBlog= await blogService.comments(comment,userToCommented[0].id,commentingUser[0].username)
    if(commentOnBlog.success)            
                        res.status(201).send({message:commentOnBlog.message});
    }else res.status(400).send({message:`there is no such blogs for  id:${userid}`})
    }else res.status(400).send({message:`user for id:${userid} does not exist `})


})
router.get('/users/getcomments',new AuthMiddleware().authFilter,async (req,res)=>{
    const {id}=req.user;
    let blogcomments=[]
    console.log(id)
    const blogService = new BlogService()
    const comments= await blogService.commentsOnBlog(id);
    if(comments.length){
        for( let comment of comments)
        {
            blogcomments.push(comment.comment)
        }res.status(201).send({blogcomments});
    }
    else res.status(400).send({message:`there is no comments on your written blogs`})
})
module.exports = router;