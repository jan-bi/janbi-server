import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    checkInterval: {
      type: Number,
      default: 3600,
    },
    lastChecked: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
