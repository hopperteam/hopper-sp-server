import * as mongoose from 'mongoose';

interface IApp extends mongoose.Document {
    id: string;
    name: string;
    imageUrl: string;
    isHidden: boolean;
    baseUrl: string;
    manageUrl: string | undefined;
    contactEmail: string;
    cert: string;
    publicKey: string;
    privateKey: string;
    userId: string;
}

const AppSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    baseUrl: { type: String, required: true },
    manageUrl: { type: String },
    contactEmail: { type: String, required: true},
    cert: { type: String, required: true},
    publicKey: { type: String, required: true},
    privateKey: { type: String, required: true},
    userId: { type: String, required: true, index: true, select: false}
}, {
    versionKey: false
});

AppSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) { delete ret._id }
});

const App = mongoose.model<IApp>("App", AppSchema);
export default App;