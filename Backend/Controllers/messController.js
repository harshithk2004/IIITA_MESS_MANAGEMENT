const db = require("../connection");
const oracledb = require("oracledb");

// Helper function to convert LOB to string
async function lobToString(lob) {
  return new Promise((resolve, reject) => {
    let data = "";
    lob.setEncoding("utf8");
    lob.on("data", chunk => data += chunk);
    lob.on("end", () => resolve(data));
    lob.on("error", reject);
  });
}

// Get Mess Timings
const getMessTimings = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.execute(
      `SELECT meal_type, 
       TO_CHAR(start_time, 'HH24:MI') AS start_time, 
       TO_CHAR(end_time, 'HH24:MI') AS end_time 
       FROM MessTimings`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json({ 
      success: true, 
      timings: result.rows.map(timing => ({
        meal_type: timing.MEAL_TYPE,
        start_time: timing.START_TIME, // Already formatted as "HH:MM"
        end_time: timing.END_TIME      // Already formatted as "HH:MM"
      }))
    });
  } catch (error) {
    console.error("Error fetching mess timings:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch mess timings" 
    });
  } finally {
    if (conn) await conn.close();
  }
};

// Get Mess Menu
const getMessMenu = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.execute(
      `SELECT day_of_week, meal_type, items FROM MessMenu`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Process rows to convert LOBs to strings
    const menu = await Promise.all(result.rows.map(async row => ({
      day_of_week: row.DAY_OF_WEEK,
      meal_type: row.MEAL_TYPE,
      items: row.ITEMS instanceof oracledb.Lob 
        ? await lobToString(row.ITEMS) 
        : row.ITEMS
    })));

    res.json({ success: true, menu });
  } catch (error) {
    console.error("Error fetching mess menu:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch mess menu" 
    });
  } finally {
    if (conn) await conn.close();
  }
};


const updateMessMenu = async (req, res) => {
  let conn;
  try {
    const { day_of_week, meal_type, new_items } = req.body;

    if (!day_of_week || !meal_type || !new_items) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: day_of_week, meal_type, or new_items",
      });
    }

    const dayOfWeekUpper = day_of_week.trim().toUpperCase();  
    const mealTypeUpper = meal_type.trim().toUpperCase();     

    conn = await db.getConnection();
    const result = await conn.execute(
      `UPDATE MessMenu 
       SET ITEMS = :items 
       WHERE UPPER(TRIM(DAY_OF_WEEK)) = :day_of_week 
         AND UPPER(TRIM(MEAL_TYPE)) = :meal_type`,
      {
        items: new_items,
        day_of_week: dayOfWeekUpper,  
        meal_type: mealTypeUpper,    
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching record found to update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mess menu updated successfully",
    });
  } catch (error) {
    console.error("Error updating mess menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update mess menu",
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
};

module.exports = { getMessTimings, getMessMenu ,updateMessMenu};