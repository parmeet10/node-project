 
const UserRepository = require('../dao/userRepository');
const Bcrypt=require('./bcrypt')
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
      
        const encryptPassword= await this.Bcrypt.encryptPassword(password)
        const responseObj = await this.userRepository.save(username, email, encryptPassword);
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
            const decryptedPassword=await this.Bcrypt.decryptPassword(password,userDetailsArr[0].password)
            if(decryptedPassword.success){
            const token = new Auth().encrypt({id: userDetailsArr[0].id});
            return { success: true , data: {token}, message: `user logged in successfully.`};
            }
            else return { success: false , data: {}, message: `either //username or password is incorrect.`};
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