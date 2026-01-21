const db = require('../connection');

const messfeedback = async (req, res) => {
    let conn;
    try {
        const { rating, emojiId, emojiLabel, feedback, mealType } = req.body;
        const userId = req.user.id;

        if (!rating || !emojiId || !emojiLabel || !mealType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        conn = await db.getConnection();
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const result = await conn.execute(
            `INSERT INTO meal_feedback (
                user_id, day_of_week, meal_type, star_rating, 
                emoji_rating, emoji_label, feedback_text, submission_date
            ) VALUES (
                :userId, :dayOfWeek, :mealType, :rating,
                :emojiId, :emojiLabel, :feedback, SYSTIMESTAMP
            ) RETURNING id INTO :id`,
            {
                userId,
                dayOfWeek,
                mealType,
                rating,
                emojiId,
                emojiLabel,
                feedback: feedback || null,
                id: { dir: db.BIND_OUT, type: db.NUMBER }
            }
        );

        await conn.commit();
        res.status(201).json({ 
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId: result.outBinds.id[0]
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        if (conn) await conn.rollback();
        res.status(500).json({ error: 'Failed to submit feedback' });
    } finally {
        if (conn) await conn.close();
    }
};



const feedbackfetch = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        
        // First option: Use DBMS_LOB.SUBSTR to convert CLOB to VARCHAR2 in the query
        const result = await conn.execute(
            `SELECT 
                mf.id,
                u.fullName,
                mf.day_of_week,
                mf.meal_type,
                mf.star_rating,
                mf.emoji_rating,
                mf.emoji_label,
                DBMS_LOB.SUBSTR(mf.feedback_text, 4000, 1) AS feedback_text,
                TO_CHAR(mf.submission_date, 'YYYY-MM-DD HH24:MI:SS') AS submission_date
            FROM meal_feedback mf
            JOIN users u ON mf.user_id = u.id
            ORDER BY mf.submission_date DESC`
        );

        // Second option: If you can't modify the query, handle LOB objects manually
        const feedbacks = [];
        for (const row of result.rows) {
            let feedbackText = row[7]; // This is the LOB object
            
            // If it's a LOB, read its contents
            if (feedbackText && typeof feedbackText === 'object' && feedbackText.getData) {
                feedbackText = await new Promise((resolve, reject) => {
                    feedbackText.getData((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }

            feedbacks.push({
                id: row[0],
                username: row[1],
                dayOfWeek: row[2],
                mealType: row[3],
                starRating: row[4],
                emojiRating: row[5],
                emojiLabel: row[6],
                feedbackText: feedbackText || null,
                submissionDate: row[8]
            });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error.message); // Only log the message
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    } finally {
        if (conn) await conn.close();
    }
};

module.exports = {
    messfeedback,
    feedbackfetch
};
