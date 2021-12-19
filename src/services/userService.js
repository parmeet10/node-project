 
const UserRepository = require('../dao/userRepository');
const Bcrypt = require('./brycpt');
const Auth = require('../utils/auth');
const res = require('express/lib/response');


class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.Bcrypt=new Bcrypt();
    };

    async create(username, email, password) {
        // check if username already exists in the database
        const userDetailsArr = await this.userRepository.findUserDetailsByUsername(username);
        if (userDetailsArr.length) {
            return { success: false, data: {}, message: `username (${username}) already exists please use a new username.`};
        }
        // encrypting the password
        const bcrypt = new Bcrypt();
        const encryptedPassword = await bcrypt.encryptPassword(password);
        const responseObj = await this.userRepository.save(username, email, encryptedPassword);
        return { success: true , data: responseObj, message: `user created successfully`};;
    }

    async getUserDetailsByUserId(userid) {
        const userDetailsArr = await this.userRepository.findUserDetailsByUserId(userid);
        return userDetailsArr;
    }

    async getUser(id){
        const userDataArr= await this.userRepository.getUserFromId(id);
        return userDataArr;
    }

    async getUserDetailsByUsernameAndPassword(username, password) {
        const userDetailsArr = await this.userRepository.findUserByUsernameAndPassword(username);
        if (userDetailsArr.length) {
            // comparing the password with hash
            const bcrypt = new Bcrypt();
            if (await bcrypt.decryptPassword(password, userDetailsArr[0].password)) {
                const token = new Auth().encrypt({id: userDetailsArr[0].id});
                return { success: true , data: {token}, message: `user logged in successfully.`};
            }
            else {
                return { success: false , data: {}, message: `either username or password is incorrect.`};
            }
        }
        else return { success: false , data: {}, message: `either username or password is incorrect.`};
    }
    async deleteUserById(id){
        const deletedUser= await this.userRepository.findUserByIdAndDelete(id);
         return deletedUser;
    }

    async listAllUsers(id){
        const usersList= await this.userRepository.listAllUsers(id);
        return usersList;
    }
}

module.exports = UserService;