import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    name: { type: String, default: '' ,required: true },
    summary: { type: String, default: '' },
    isChatRealtime: { type: Boolean, default: false },
    wsId: { type: String, default: '' },
});

export default model('Session', sessionSchema);
