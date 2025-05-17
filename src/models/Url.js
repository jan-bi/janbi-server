import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    selectors: [
      {
        type: {
          type: String,
          enum: ["css", "xpath"],
          required: true,
        },
        selector: {
          type: String,
          required: true,
        },
      },
    ],
    previousHtml: {
      type: String,
      default: "",
    },
    slack: {
      token: {
        type: String
      },
      channelId: {
        type: String
      },
      channelName: {
        type: String
      },
      webhookUrl: {
        type: String
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
