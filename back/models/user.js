import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, index: true, unique: true },
    avatarUrl: { type: String, required: false },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
