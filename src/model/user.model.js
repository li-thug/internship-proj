import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePhoto: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1202093022/photo/the-concept-of-unity-cooperation-teamwork-and-charity.jpg?s=1024x1024&w=is&k=20&c=VRzXl1K8etgidKepPi38dzq9hu2Cm54yTAfKz1DG4GQ=",
    },
    bio: {
      type: String,
      default: "Nothing to say yet",
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
