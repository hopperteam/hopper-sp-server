import * as mongoose from 'mongoose';

export interface IAddresser extends mongoose.Document {
    id: string;
    accountName: string | undefined;
    app: any;
    userId: string;
}

const AddresserSchema = new mongoose.Schema({
    id: { type: String, default: "", index: true},
    userId: { type: String, required: true, select: false, index: true },
    accountName: { type: String },
    app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true }
}, {
    versionKey: false
});

AddresserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) { delete ret._id }
});

const Addresser = mongoose.model<IAddresser>("Addresser", AddresserSchema);
export default Addresser;