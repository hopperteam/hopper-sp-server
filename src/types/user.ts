import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    password: {type: String, required: true, select: false},
}, {
    versionKey: false
})

const User = mongoose.model<IUser>("User", UserSchema);
export default User;