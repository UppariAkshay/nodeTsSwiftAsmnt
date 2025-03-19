import { model, Schema } from "mongoose";

const userSchema = new Schema({
    "id": Number,
    "name": String,
    "username": String,
    "email": String,
    "address": {
      "street": String,
      "suite": String,
      "city": String,
      "zipcode": String,
      "geo": {
        "lat": String,
        "lng": String
      }
    },
    "phone": String,
    "website": String,
    "company": {
      "name": String,
      "catchPhrase": String,
      "bs": String
    }
}) 

const User = model('User', userSchema)

export default User