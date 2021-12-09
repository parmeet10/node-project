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
        const query=`SELECT * FROM BLOGS WHERE ID=? `;
        const [userBlogArr]= await connection.query(query,id);
        return userBlogArr;
    }
    
}
module.exports = BlogRepository;