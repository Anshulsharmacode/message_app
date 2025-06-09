import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  _id: string;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  email: string;
  password: string;
  username: string;
  verifycode: string;
  verifyexpire: Date;
  isVerified: boolean;
  isAcceptiveMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    verifycode: {
      type: String,
      required: [true, "Please provide a verifycode"],
    },
    verifyexpire: {
      type: Date,
      required: [true, "Please provide a verifyexpire"],
    },
    isAcceptiveMessage: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
