const mongoose = require ('mongoose');

const connectDB = async () => {
    console.log('loaded MONGO_URI: ', process.env.MONGO_URI);
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error: ', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;