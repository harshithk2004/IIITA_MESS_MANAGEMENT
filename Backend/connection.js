const oracledb = require('oracledb');

async function connectDB() {
    try {
        await oracledb.createPool({
            user: "MYAPP",
            password: "MySecurePassword",
            connectString: "localhost:1521/freepdb1",  
            poolAlias: "default",
            poolMin: 5,
            poolMax: 20,
            poolIncrement: 5,
            queueTimeout: 0
        });
        console.log("Connected to Oracle DB");
    } catch (err) {
        console.error("Error connecting to Oracle DB:", err);
        process.exit(1);
    }
}

async function getConnection() {
    try {
        return await oracledb.getConnection("default");
    } catch (err) {
        console.error("Error getting DB connection:", err);
        throw err;
    }
}

module.exports = {
    connectDB,
    getConnection,
    BIND_OUT: oracledb.BIND_OUT,
    NUMBER: oracledb.NUMBER
};
