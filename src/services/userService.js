const UserRepository = require('../dao/userRepository');


const Auth = require('../utils/auth');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    };

    async create(username, email, password) {
        // check if username already exists in the database
        const userDetailsArr = await this.userRepository.findUserDetailsByUsername(username);
        if (userDetailsArr.length) {
            return { success: false, data: {}, message: `username (${username}) already exists please use a new username.`};
        }
        const responseObj = await this.userRepository.save(username, email, password);
        return { success: true , data: responseObj, message: `user created successfully`};;
    }

    async getUserDetailsByUserId(userid) {
        const userDetailsArr = await this.userRepository.findUserDetailsByUserId(userid);
        return userDetailsArr;
    }

    async getUser(id){
        const userDataArr= await this.userRepository.getUserFromId(id);
        const blogService = new BlogService()
        return userDataArr;
    }

    async getUserDetailsByUsernameAndPassword(username, password) {
        const userDetailsArr = await this.userRepository.findUserByUsernameAndPassword(username, password);
        if (userDetailsArr.length) {
            const token = new Auth().encrypt({id: userDetailsArr[0].id});
            return { success: true , data: {token}, message: `user logged in successfully.`};
        }
        else return { success: false , data: {}, message: `either username or password is incorrect.`};
    }
}

module.exports = UserService;