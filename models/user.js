import mongooseService from '../services/mongoose.service.js';
import passportLocalMongoose  from 'passport-local-mongoose';
let Schema = mongooseService.getMongoose().Schema;


let User = new Schema({
    email: { type: String },
    username: { type: String },
    admin: {
        type: Boolean,
        default: false
    },
});

User.plugin(passportLocalMongoose);

export default mongooseService.getMongoose().model("User", User);