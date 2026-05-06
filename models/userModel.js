// models/userModel.js
import mongoose from "mongoose";
import passportLocalMongooseImport from "passport-local-mongoose";

const passportLocalMongoose =
  passportLocalMongooseImport.default || passportLocalMongooseImport;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
