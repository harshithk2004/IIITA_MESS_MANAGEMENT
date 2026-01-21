const oracledb = require('oracledb');
const db = require("../connection");


const messinventory = async (req, res) => {
  const items = req.body.items;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items array." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection();
    for (const item of items) {
      const { name, quantity, cost } = item;
      const total = parseFloat(quantity) * parseFloat(cost);

      await connection.execute(
        `INSERT INTO mess_inventory (item_name, quantity, cost_per_unit, total_cost)
         VALUES (:name, :quantity, :cost, :total)`,
        { name, quantity, cost, total },
        { autoCommit: false }
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Items saved successfully." });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error saving inventory." });

  } finally {
    if (connection) await connection.close();
  }
};

const inventoryfetch = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection();

    const result = await connection.execute(
      `SELECT id, item_name, quantity, cost_per_unit, total_cost 
       FROM mess_inventory 
       ORDER BY updated_at DESC`
    );
    const items = result.rows.map((row) => ({
      id: row[0],
      name: row[1],
      quantity: row[2],
      cost: row[3],
      total: row[4],
    }));
    console.log(items);
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ success: false, message: "Failed to fetch inventory" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
  }
};

module.exports={messinventory,inventoryfetch}