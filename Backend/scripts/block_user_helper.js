const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const blockUser = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = process.argv[2];

        if (!email) {
            console.log('Please provide an email as an argument.');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.status = 'blocked';
        await user.save();

        console.log(`User ${user.name} (${user.email}) has been blocked.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

blockUser();
