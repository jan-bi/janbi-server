import mongoose from "mongoose";

const changeLogSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  isChanged: {
    type: Boolean,
    default: false
  },
  changedSelectors: {
    type: [String],
    default: []
  },
  changedContents: [
    {
      selector: { type: String, required: true },
      before: { type: String, default: "" },
      after: { type: String, default: "" },
    },
  ],
  alreadyNotified: {
    type: Boolean,
    default: false
  },
});

export default mongoose.model("ChangeLog", changeLogSchema);
