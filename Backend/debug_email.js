const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const debugEmail = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ role: 'main_admin' });
        if (user) {
            console.log('EMAIL_START');
            console.log(user.email);
            console.log('EMAIL_END');
        } else {
            console.log('MAIN_ADMIN_NOT_FOUND');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugEmail();
