const db = require("../connection");
const oracledb = require("oracledb");

const getProfile = async (req, res) => {
  let conn;
  try {
    const userId = req.user.id;
    conn = await db.getConnection();
    const [user, userInfo] = await Promise.all([
      conn.execute(
        `SELECT id, firstName, lastName, email, phoneNumber 
         FROM users WHERE id = :userId`,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      conn.execute(
        `SELECT street, city, state 
         FROM user_info WHERE user_id = :userId`,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const profileData = {
      ...user.rows[0],
      ...(userInfo.rows[0] || { street: null, city: null, state: null }),
    };

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  } finally {
    if (conn) conn.release();
  }
};

const updateProfile = async (req, res) => {
  let conn;
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, street, city, state } = req.body;
    console.log(firstName, lastName, phone, street, city, state);
    conn = await db.getConnection();

    await conn.execute(
      `UPDATE users 
       SET firstName = :firstName, 
           lastName = :lastName, 
           phoneNumber = :phone 
       WHERE id = :userId`,
      { firstName, lastName, phone, userId },
      { autoCommit: false }
    );

    const result = await conn.execute(
      `SELECT 1 FROM user_info WHERE user_id = :userId`,
      { userId }
    );

    const existingInfo = result.rows.length > 0;

    if (existingInfo) {
      await conn.execute(
        `UPDATE user_info 
         SET street = :street, 
             city = :city, 
             state = :state 
         WHERE user_id = :userId`,
        { street, city, state, userId },
        { autoCommit: false }
      );
    } else {
      await conn.execute(
        `INSERT INTO user_info (user_id, street, city, state) 
         VALUES (:userId, :street, :city, :state)`,
        { userId, street, city, state },
        { autoCommit: false }
      );
    }

    await conn.commit();

    res.json({ success: "Profile updated successfully" });
  } catch (error) {
    if (conn) await conn.rollback(); // Rollback changes on error
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  } finally {
    if (conn) conn.release();
  }
};



// GET all employees
const getEmployees = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.execute("SELECT * FROM MessEmployees");
    res.status(200).json({ employees: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get employees" });
  } finally {
    if (conn) await conn.close();
  }
};

// SEARCH employees
const searchEmployees = async (req, res) => {
  const { query } = req.query;
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.execute(
      `SELECT * FROM MessEmployees 
       WHERE LOWER(NAME) LIKE :q OR LOWER(EMAIL) LIKE :q OR LOWER(ROLE) LIKE :q`,
      { q: `%${query.toLowerCase()}%` }
    );
    res.status(200).json({ employees: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  } finally {
    if (conn) await conn.close();
  }
};

// ADD employee
const addEmployee = async (req, res) => {
  const {
    NAME: name,
    ROLE: role,
    PHONE: phone,
    EMAIL: email,
    SHIFT: shift,
  } = req.body;
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.execute(
      `INSERT INTO MessEmployees (NAME, ROLE, CONTACT_NUMBER, EMAIL, SHIFT_TIME, JOINING_DATE) 
       VALUES (:name, :role, :phone, :email, :shift, SYSDATE) RETURNING EMPLOYEE_ID INTO :id`,
      {
        name,
        role,
        phone,
        email,
        shift,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Employee added", id: result.outBinds.id[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Add failed" });
  } finally {
    if (conn) await conn.close();
  }
};

// UPDATE employee
const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const { NAME, ROLE, PHONE, EMAIL, SHIFT } = req.body;

  let conn;
  try {
    conn = await db.getConnection();
    await conn.execute(
      `UPDATE MessEmployees 
       SET NAME = :NAME, 
           ROLE = :ROLE, 
           CONTACT_NUMBER = :PHONE, 
           EMAIL = :EMAIL, 
           SHIFT_TIME = :SHIFT 
       WHERE EMPLOYEE_ID = :ID`,
      { NAME, ROLE, PHONE, EMAIL, SHIFT, ID: id },
      { autoCommit: true }
    );
    res.status(200).json({ message: "Employee updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  } finally {
    if (conn) await conn.close();
  }
};



// DELETE employee
const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  let conn;
  try {
    conn = await db.getConnection();
    await conn.execute("DELETE FROM MessEmployees WHERE EMPLOYEE_ID = :id", { id }, { autoCommit: true });
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  } finally {
    if (conn) await conn.close();
  }
};

const getEmployeeById = async (req, res) => {
  const id = req.params.id;
  let conn;

  try {
    conn = await db.getConnection();
    const result = await conn.execute(
      `SELECT EMPLOYEE_ID, NAME, ROLE, CONTACT_NUMBER, EMAIL, SHIFT_TIME, JOINING_DATE 
       FROM MessEmployees 
       WHERE EMPLOYEE_ID = :id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const [EMPLOYEE_ID, NAME, ROLE, CONTACT_NUMBER, EMAIL, SHIFT_TIME, JOINING_DATE] = result.rows[0];

    res.status(200).json({
      EMPLOYEE_ID,
      NAME,
      ROLE,
      CONTACT_NUMBER,
      EMAIL,
      SHIFT_TIME,
      JOINING_DATE,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee" });
  } finally {
    if (conn) await conn.close();
  }
};


module.exports = {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateProfile,
  getEmployeeById
};
