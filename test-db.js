const mongoose = require('mongoose');

// Need to match exactly what app sees
const MONGODB_URI = 'mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.useDb('test'); // The default db
    const users = await db.collection('users').find({ role: { $regex: /^admin$/i } }).toArray();
    console.log("Users:", JSON.stringify(users, null, 2));

    const roles = await db.collection('roles').find({ name: 'Admin' }).toArray();
    console.log("Roles:", JSON.stringify(roles, null, 2));

    await mongoose.disconnect();
}

main().catch(console.error);
