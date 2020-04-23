import * as mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
    id: string;
    addresser: any;
    userId: string;
    heading: string;
    timestamp: number;
    imageUrl: string;
    isDone: false;
    isSilent: boolean;
    isArchived: boolean;
    type: string;
    content: string;
}

const NotificationSchema = new mongoose.Schema({
    id: { type: String, required: true},
    userId: { type: String, required: true, select: false, index: true },
    addresser: { type: mongoose.Schema.Types.ObjectId, ref: 'Addresser', required: true },
    heading: { type: String, required: true },
    timestamp: { type: Number, required: true },
    imageUrl: { type: String },
    isDone: { type: Boolean, default: false },
    isSilent: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    type: { type: String, required: true },
    content: { type: String, required: true },
}, {
    versionKey: false
});

NotificationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) { delete ret._id }
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;