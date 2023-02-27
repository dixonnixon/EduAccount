import mongoose from 'mongoose';
import passportLocalMongoose  from 'passport-local-mongoose';
// let Schema = mongoose.Schema;
import mongooseService from '../services/mongoose.service.js';

const Schema = mongooseService.getMongoose().Schema;

let User = new Schema({
    email: { type: String }, 

    admin: {
        type: Boolean,
        default: false
    },
});

User.plugin(passportLocalMongoose);

export default mongoose.model("User", User);