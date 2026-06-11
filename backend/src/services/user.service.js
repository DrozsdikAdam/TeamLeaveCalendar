import userRepository from "../repositories/user.repository.js";

class UserService {
    async getAllUsers() {
        return userRepository.findAll();
    }
}

export default new UserService();