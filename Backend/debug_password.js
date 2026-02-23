const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const debugPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ role: 'main_admin' }).select('+password');

        if (!user) {
            console.log('User not found');
            process.exit();
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await bcrypt.compare('admin123', user.password);
        console.log('Match with "admin123":', isMatch);

        const testHash = await bcrypt.hash('admin123', 10);
        console.log('Test Hash of "admin123":', testHash);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugPassword();
