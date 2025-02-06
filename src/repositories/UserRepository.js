import { userDao } from "../daos/persistence.js";
import UserDTO from "../dtos/UserDTO.js";
import GenericRepository from "./GenericRepository.js";

export default class UserRepository { //FIXME: extends GenericRepository
    constructor() {
        this.dao = userDao;
    }

    async findById(id) {
        const user = await this.dao.getById(id);
        return user ? new UserDTO(user) : null;
    }

    async findByEmail(email) {
        const user = await this.dao.getByEmail(email);
        return user ? new UserDTO(user) : null;
    }
}
