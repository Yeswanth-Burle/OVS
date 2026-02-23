const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedMainAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const mainAdminExists = await User.findOne({ role: 'main_admin' });

        if (mainAdminExists) {
            console.log('Main Admin already exists. Resetting password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            mainAdminExists.password = hashedPassword;
            await mainAdminExists.save();
            console.log('Main Admin password reset to: admin123');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const mainAdmin = await User.create({
            name: 'Main Admin',
            email: 'admin@ovs.com',
            password: hashedPassword,
            role: 'main_admin',
            status: 'approved'
        });

        console.log(`Main Admin created: ${mainAdmin.email}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedMainAdmin();
