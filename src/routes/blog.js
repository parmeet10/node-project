const express = require('express');
const AuthMiddleware = require('../middlewares/authMiddleware');
const BlogService = require('../services/blogService');
const router = express.Router();

router.post('/blog', new AuthMiddleware().authFilter, async (req, res) => {
    const { title, description } = req.body;
    const { id: userid } = req.user;
    const blogservice = new BlogService();
    const resposneobj = await blogservice.create(title, description, userid);
    return res.status(201).send({ id: resposneobj.insertId });
});
module.exports = router;