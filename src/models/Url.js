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
    dayOfWeek: {
      type: String,
      enum: ["월", "화", "수", "목", "금", "토", "일"],
      required: true,
    },
    scheduleTime: {
      type: String,
      required: true,
    },
    lastChecked: {
      type: Date,
      default: null,
    },
    selectors: {
      type: [String],
      default: [],
    },
    previousHtml: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
