import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminFeedbackPage.module.css'; 

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/feedbacks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFeedbacks(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Failed to load feedbacks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const emojiMap = {
        1: '😞',
        2: '😕',
        3: '😐',
        4: '😊',
        5: '😍',
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Meal Feedback Submissions</h1>
                <p className={styles.subtitle}>Review all submitted meal feedback from users</p>
            </div>
            {loading ? (
                <div className={styles.loader}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <div className="overflow-x-auto">
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={styles.tableCell}>User</th>
                                    <th className={styles.tableCell}>Day</th>
                                    <th className={styles.tableCell}>Meal</th>
                                    <th className={styles.tableCell}>Rating</th>
                                    <th className={styles.tableCell}>Feedback</th>
                                    <th className={styles.tableCell}>Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb) => (
                                    <tr key={fb.id} className={styles.tableRow}>
                                        <td className={styles.tableCell}>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {fb.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{fb.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className="text-sm text-gray-900">{fb.dayOfWeek}</div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {fb.mealType}
                                            </span>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 text-lg mr-1">{'⭐'.repeat(fb.starRating)}</span>
                                                <span className="text-2xl ml-2">{emojiMap[fb.emojiRating]}</span>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {fb.feedbackText || 'No feedback provided'}
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            {new Date(fb.submissionDate).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbacks;