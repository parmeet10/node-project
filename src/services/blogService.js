const blogRepository = require('../dao/blogRepository');
const UserService = require('../services/userService');


class BlogService {

    constructor() {
        this.blogRepository = new blogRepository();
        this.UserService= new UserService();
    }
    
    
    async create(title, description, userid) {
        const userDetailsArr = await this.UserService.getUserDetailsByUserId(userid);
        const responseobj = await this.blogRepository.save(title, description, userid, userDetailsArr[0].USERNAME);
        return responseobj;

    }
    async getBlog(id){
        const blogDataArr=await this.blogRepository.getBlogFromId(id);
        return blogDataArr;
    }
    async comments(comment,id,username){
        const commentOnBlog=await this.blogRepository.blogComment(comment,id,username)
        return {success:true,data:commentOnBlog,message:"comment on blog done successfully"}
    }
    async commentsOnBlog(id){
        const commentOnBlog=await this.blogRepository.findComment(id)
        return commentOnBlog;
    }
};
module.exports=BlogService;