import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose.default);

export default mongoose.model("User", userSchema);


