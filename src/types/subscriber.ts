import * as mongoose from 'mongoose';

export interface ISubscriber extends mongoose.Document {
    id: string;
    accountName: string | undefined;
    app: any;
    userId: string;
}

const SubscriberSchema = new mongoose.Schema({
    id: { type: String, default: "", index: true},
    userId: { type: String, required: true, select: false, index: true },
    accountName: { type: String },
    app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true }
}, {
    versionKey: false
});

SubscriberSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) { delete ret._id }
});

const Subscriber = mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
export default Subscriber;