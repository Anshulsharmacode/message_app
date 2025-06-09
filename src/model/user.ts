
import mongoose ,{ Document, Schema } from 'mongoose';

//define data types and use extned to create make document because we are using mongoose
export interface Message extends Document{
    content : string;
    createdAt : Date;
    _id : string;
}
//<> use for custom schema 
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        required: true,
    }

})

export interface User extends Document{
    
    email: string;
    _id: string;
    password: string;
    username: string;
    verifycode : string;
    verifyexpire : Date;
    isVerified: boolean;
    isAcceptiveMessage: boolean;
    messages: Message[];//we are using array of messages  because one user can have multiple messages
}

const UserSchema: Schema <User> = new Schema({
    username:{
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    _id:{
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    
    email:{
        type: String,
        required: [true, 'Please provide a email'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
    },
    verifycode:{
        type: String,
        required: [true, 'Please provide a verifycode'],
    },
    verifyexpire:{
        type: Date,
        required: [true, 'Please provide a verifyexpire'],
    },
    isAcceptiveMessage:{
        type: Boolean,
        default: true,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema]

    

},{timestamps: true});



// edge time to create a model because we are using nextjs in other node express the backend are running on other server 

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema);

//first model if exist the model and other if not create a new model

export default UserModel;