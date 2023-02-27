import mongoose from 'mongoose';
import passportLocalMongoose  from 'passport-local-mongoose';
let Schema = mongoose.Schema;


let User = new Schema({
    email: { type: String },
    username: { type: String },
    admin: {
        type: Boolean,
        default: false
    },
});

User.plugin(passportLocalMongoose);

export default mongoose.model("User", User);