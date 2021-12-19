const blogRepository = require('../dao/blogRepository');
const UserService = require('../services/userService');


class BlogService {

    constructor() {
        this.blogRepository = new blogRepository();
        this.userService = new UserService();
    }


    async create(title, description, userid) {
        const userDetailsArr = await this.userService.getUserDetailsByUserId(userid);
        const responseobj = await this.blogRepository.save(title, description, userid, userDetailsArr[0].USERNAME);
        return responseobj;

    }
    async getBlog(id) {
        const blogDataArr = await this.blogRepository.getBlogFromId(id);
        return blogDataArr;
    }

    async getBlogById(blogId) {
        const blogDetailsArr = await this.blogRepository.findActiveUserBlogById(blogId);
        return blogDetailsArr;
    }

    async comments(comment, id, username) {
        const commentOnBlog = await this.blogRepository.blogComment(comment, id, username)
        return { success: true, data: commentOnBlog, message: "comment on blog done successfully" }
    }
    async findCommentsByBlog(userId, blogId) {
        const userDetailsArr = await this.userService.getUser(userId);
        if (userDetailsArr.length === 0) return { success: false, data: {}, message: 'User does not exist'};
        const blogDetailsArr = await this.getBlogById(blogId);
        if (blogDetailsArr.length === 0) return { success: false, data: {}, message: 'Blog does not exist'};
        const commentsArr = await this.blogRepository.findCommentsByBlogId(blogId)
        if (commentsArr.length === 0) return { success: true, data: {comments: []}, message: 'No comments'};
        return { success: true, data: {comments: commentsArr}, message: 'Comments fetched successfully.'};
    }
};
module.exports = BlogService;