import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
    next();
});

export default model('User', userSchema);
