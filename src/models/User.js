import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  refreshToken: {
    type: String
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
