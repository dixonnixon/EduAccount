import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Educator = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    firstName: { type: String },
    lastName: { type: String },
    surName: { type: String },
    workplaces: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workplace'
    }],
    age: { type: Number },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    }],
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    dates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dates'
    }]
}, { id: false, timestamps: true });


export default mongoose.model("Educator", Educator);