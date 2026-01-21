const db = require("../connection");
const bcrypt = require('bcryptjs');

const createUser = async ({ firstName, lastName, phoneNumber, email, password }) => {
    let connection;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        connection = await db.getConnection();

        await connection.execute(
            `INSERT INTO users (firstname, lastname, phonenumber, email, password) VALUES (:firstname, :lastname, :phonenumber, :email, :password)`,
            { firstname: firstName, lastname: lastName, phonenumber: phoneNumber, email, password: hashedPassword },
            { autoCommit: true }
        );

    } catch (err) {
        console.error("Error inserting user:", err);
        throw err;

    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error closing DB connection:", closeErr);
            }
        }
    }
};

module.exports = { createUser };
