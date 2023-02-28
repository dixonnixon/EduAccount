import mongooseService from './mongoose.service.js'; //!!
import User from '../models/user.js';
import debug from 'debug';


class UsersService {

    async getUserByEmail(email) {
        return User.findOne({email: email}).exec();
    }

    async createUser(req, res, next) {
        const user = new User({
            
            ...req.body,
            permissionFlags: 1
        });
        await user.save();
        res.json({ id: user._id });
    }
}



export default new UsersService();