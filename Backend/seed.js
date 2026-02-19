const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Election = require('./models/Election');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if Main Admin exists
        const mainAdminExists = await User.findOne({ role: 'main_admin' });

        if (!mainAdminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'Super Admin',
                email: 'admin@ovs.com',
                password: hashedPassword,
                role: 'main_admin',
                status: 'approved'
            });
            console.log('Main Admin created: admin@ovs.com / admin123');
        } else {
            console.log('Main Admin already exists');
        }

        // Create sample Election if none
        const electionCount = await Election.countDocuments();
        if (electionCount === 0) {
            // We need a user ID for createdBy. Use Main Admin.
            const mainAdmin = await User.findOne({ role: 'main_admin' });
            if (mainAdmin) {
                await Election.create({
                    title: 'Student Council Election 2026',
                    description: 'Election for the university student council representatives.',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    status: 'active',
                    createdBy: mainAdmin._id
                });
                console.log('Sample Election created');
            }
        }

        console.log('Seeding completed');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
