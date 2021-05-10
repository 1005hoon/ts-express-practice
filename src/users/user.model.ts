import * as mongoose from "mongoose";
import User from "./user.interface";

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
    address: addressSchema,
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
