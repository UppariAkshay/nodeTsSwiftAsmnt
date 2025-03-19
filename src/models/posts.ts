import { model, Schema } from "mongoose";

const postsSchema = new Schema({
        "userId": Number,
        "id": Number,
        "title": String,
        "body": String
})

const Post = model('post', postsSchema)

export default Post