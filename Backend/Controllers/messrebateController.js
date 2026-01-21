const db = require("../connection");

const submitRebateRequest = async (req, res) => {
  const { name, email, enroll, branch, hostel, dates } = req.body;
  const userId = req.user.id;
  let connection;

  try {
    connection = await db.getConnection();

    // Check if student exists
    const studentResult = await connection.execute(
      `SELECT enroll FROM students WHERE enroll = :enroll OR user_id = :userId`,
      [enroll, userId]
    );

    // Insert or update student record
    if (studentResult.rows.length === 0) {
      await connection.execute(
        `INSERT INTO students (enroll, name, email, branch, hostel, user_id)
         VALUES (:enroll, :name, :email, :branch, :hostel, :userId)`,
        [enroll, name, email, branch, hostel, userId],
        { autoCommit: true }
      );
    } else {
      // Update existing student record if needed
      await connection.execute(
        `UPDATE students 
         SET name = :name, email = :email, branch = :branch, hostel = :hostel
         WHERE enroll = :enroll OR user_id = :userId`,
        [name, email, branch, hostel, enroll, userId],
        { autoCommit: true }
      );
    }

    // Insert all date ranges
    for (const dateRange of dates) {
      const { startDate, endDate } = dateRange;
      await connection.execute(
        `INSERT INTO rebate_dates (enroll, start_date, end_date)
         VALUES (
           (SELECT enroll FROM students WHERE user_id = :userId),
           TO_DATE(:startDate, 'YYYY-MM-DD'), 
           TO_DATE(:endDate, 'YYYY-MM-DD')
         )`,
        [userId, startDate, endDate],
        { autoCommit: true }
      );
    }

    res.status(201).json({ message: 'Rebate request submitted successfully.' });

  } catch (err) {
    console.error('Error submitting rebate request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing connection:', closeErr);
      }
    }
  }
};

const getRebateRequests = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    
    const result = await connection.execute(`
      SELECT 
        r.id,
        s.enroll,
        s.name,
        s.email,
        s.branch,
        s.hostel,
        TO_CHAR(r.start_date, 'YYYY-MM-DD') as start_date,
        TO_CHAR(r.end_date, 'YYYY-MM-DD') as end_date,
        r.accepted_by_admin,
        s.name as submitted_by
      FROM rebate_dates r
      JOIN students s ON r.enroll = s.enroll
      ORDER BY r.start_date DESC
    `);
    console.log(result.rows);
    const requests = result.rows.map(row => ({
      id: row[0],
      enroll: row[1],
      name: row[2],
      email: row[3],
      branch: row[4],
      hostel: row[5],
      start_date: row[6],
      end_date: row[7],
      status: row[8],
      submitted_by: row[9]
    }));
    
    res.status(200).json(requests);
    
  } catch (err) {
    console.error('Error fetching rebate requests:', err);
    res.status(500).json({ error: 'Failed to fetch rebate requests' });
  } finally {
    if (connection) await connection.close();
  }
};

const updateRebateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let connection;
  
  try {
    connection = await db.getConnection();
    
    await connection.execute(
      `UPDATE rebate_dates 
       SET accepted_by_admin = :status 
       WHERE id = :id`,
      [status, id],
      { autoCommit: true }
    );
    
    res.status(200).json({ message: 'Status updated successfully' });
    
  } catch (err) {
    console.error('Error updating rebate status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  } finally {
    if (connection) await connection.close();
  }
};
module.exports = {
  submitRebateRequest,
  getRebateRequests,
  updateRebateStatus
};