import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('MongoDB Connected Successfully')
    }
    catch (err) {
        process.exit(1)
        console.log(err)
    }
}

export default connect