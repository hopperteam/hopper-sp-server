import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    password: {type: String, required: true, select: false},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
}, {
    versionKey: false
})

const User = mongoose.model<IUser>("User", UserSchema);
export default User;