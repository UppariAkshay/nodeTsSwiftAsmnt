import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
    "postId": Number,
    "id": Number,
    "name": String,
    "email": String,
    "body": String
})

const Comment = model('Comment', CommentSchema)

export default Comment