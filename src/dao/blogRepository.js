const Database = require('../clients/database');

class BlogRepository {
    constructor() {
        this.Database = new Database();
    };

    async save(title, description, userid, username) {
        const connection = await this.Database.getConnection();
        const query = `INSERT INTO BLOGS (title, description, userid, createdby, updatedby)
                       VALUES(?,?,?,?,?)`;
        const [responseobj] = await connection.query(query, [title, description, userid, username, username]);
        return responseobj;
    }
    async getBlogFromId(id){
        const connection = await this.Database.getConnection();
        const query=`SELECT * FROM BLOGS WHERE USERID=? `;
        const [userBlogArr]= await connection.query(query,id);
        return userBlogArr;
    }
    async blogComment(comment,userid,username){
        const connection = await this.Database.getConnection();
        const query = `INSERT INTO BLOGCOMMENTS (comment, blogid, createdby, updatedby)
                       VALUES(?,?,?,?)`;
        const [responseCommentObj]=await connection.query(query, [comment,userid, username, username]);
        return responseCommentObj;
    }
    async findCommentsByBlogId(blogId){
        const connection = await this.Database.getConnection();
        const query=`
        SELECT * FROM blogcomments WHERE blogId = ?`;
        const [commentArr]= await connection.query(query,[blogId]);
        return commentArr;
    }

    async findActiveUserBlogById(blogId) {
        const connection = await this.Database.getConnection();
        const query = `
        SELECT * FROM blogs b
        WHERE b.id = ?;
        `;
        const [blogDetailsArr] = await connection.query(query, [blogId]);
        return blogDetailsArr;
    }

}
module.exports = BlogRepository;