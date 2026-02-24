const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/ovs')
    .then(async () => {
        const users = await User.find({}).select('+password');
        console.log(`Users in ovs DB: ${users.length}`);
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}, Status: ${u.status}, PwdHash: ${u.password ? "Exists" : "MISSING"}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
