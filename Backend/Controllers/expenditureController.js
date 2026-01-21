const db = require("../connection");

const fetchExpenditureData = async (req, res) => {
  let connection;
  try {
    const conn = await db.getConnection();
    const query = 'SELECT * FROM mess_inventory';
    const result = await conn.execute(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching expenditure data:', error);
    res.status(500).json({ message: 'Error fetching expenditure data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

const fetchEmployeesExpenditureData = async (req, res) => {
  let connection;
  try {
    const conn = await db.getConnection(); 
    const query = 'SELECT * FROM MessEmployees';
    const result = await conn.execute(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching employees expenditure data:', error);
    res.status(500).json({ message: 'Error fetching employees expenditure data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

module.exports = { fetchExpenditureData, fetchEmployeesExpenditureData };
