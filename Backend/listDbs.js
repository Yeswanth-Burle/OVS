const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/OVS')
    .then(async () => {
        const adminDb = mongoose.connection.db.admin();
        const dbs = await adminDb.listDatabases();
        console.log("Databases:");
        dbs.databases.forEach(db => console.log(db.name));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
