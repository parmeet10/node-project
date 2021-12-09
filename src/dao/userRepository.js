const Database = require('../clients/database');

class UserRepository {
    constructor() {
        this.database = new Database();
    };

    async save(username, email,password) {
        const connection = await this.database.getConnection();
        const query = `
        INSERT INTO users (username, email, password,createdby, updatedby) 
        VALUES (?,?,?,?,?)`;
        const [responseObj] = await connection.query(query, [username, email, password,username, username]);
        return responseObj;
    }
    async findUserDetailsByUserId(userid) {
        const connection = await this.database.getConnection();
        const query = `SELECT USERNAME FROM USERS WHERE ID=?`;
        const [userDetailsArr] = await connection.query(query, [userid])
        return userDetailsArr;
    }

    async findUserDetailsByUsername(username) {
        const connection = await this.database.getConnection();
        const query = `SELECT id, username FROM USERS WHERE USERNAME=?`;
        const [userDetailsArr] = await connection.query(query, [username])
        return userDetailsArr;
    }

    async getUserFromId(id){
        const connection= await this.database.getConnection();
        const query=`SELECT * FROM USERS WHERE ID=?`;
        const [userDataArr]= await connection.query(query,[id]);
        return userDataArr;
    }

    async findUserByUsernameAndPassword(username, password) {
        const connection= await this.database.getConnection();
        const query = `SELECT * FROM USERS WHERE username=? and password = ?`;
        const [userDataArr] = await connection.query(query, [username, password]);
        return userDataArr;
    }
}

 module.exports = UserRepository; 