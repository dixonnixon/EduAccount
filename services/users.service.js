// import mongooseService from './mongoose.service.js'; //!!
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
        // res.statusCode = 400;
        res.json({ id: user._id });
    }

     async delete(id) {
        return   User.deleteOne ({_id: id}).exec()
        // .then((user) => {
        //     res.statusCode = 200;
        //     res.setHeader('Content-Type', 'application/json');
        //     res.json(user);
        // }, (err) => next(err))
        // .catch((err) => next(err));
    }
}



export default new UsersService();