import styles from "../../styles/FeedbackForm.module.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth(); 
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealType, setMealType] = useState('Lunch');

  const emojis = [
    { id: 1, emoji: '😞', label: 'Very Dissatisfied' },
    { id: 2, emoji: '🙁', label: 'Dissatisfied' },
    { id: 3, emoji: '😐', label: 'Neutral' },
    { id: 4, emoji: '🙂', label: 'Satisfied' },
    { id: 5, emoji: '😊', label: 'Very Satisfied' }
  ];

  const determineMealType = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) return 'Breakfast';
    if (hours >= 11 && hours < 20) return 'Lunch';
    return 'Dinner';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log(user[0],rating,selectedEmoji,feedback,determineMealType());
      const token=localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/mess/feedback', {
        userId: user[0] || null,
        rating,
        emojiId: selectedEmoji,
        emojiLabel: emojis.find(e => e.id === selectedEmoji)?.label || '',
        feedback,
        mealType: determineMealType()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError(err.response?.data?.message || 
              err.message || 
              'An error occurred while submitting feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHover(0);
    setFeedback('');
    setSelectedEmoji(null);
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successMessage}>
          <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
            <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h3>Thank You!</h3>
          <p>Your feedback has been submitted successfully.</p>
          <button onClick={resetForm} className={styles.submitButton}>
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.title}>We'd love your feedback!</h2>
      <p className={styles.subtitle}>How would you rate today's {determineMealType()}?</p>
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.feedbackForm}>
        <div className={styles.ratingContainer}>
          <div className={styles.starRating}>
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? styles.starFilled : styles.starEmpty}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                  disabled={isLoading}
                >
                  <span className={styles.star}>&#9733;</span>
                </button>
              );
            })}
          </div>
          <div className={styles.ratingText}>
            {rating === 0 ? 'Select rating' : `${rating} star${rating > 1 ? 's' : ''}`}
          </div>
        </div>

        <div className={styles.emojiContainer}>
          <p>How did you feel about our service?</p>
          <div className={styles.emojiOptions}>
            {emojis.map((emoji) => (
              <label key={emoji.id} className={styles.emojiLabel}>
                <input
                  type="radio"
                  name="emoji"
                  className={styles.emojiInput}
                  checked={selectedEmoji === emoji.id}
                  onChange={() => setSelectedEmoji(emoji.id)}
                  disabled={isLoading}
                />
                <span className={`${styles.emoji} ${selectedEmoji === emoji.id ? styles.emojiSelected : ''}`}>
                  {emoji.emoji}
                  <span className={styles.emojiTooltip}>{emoji.label}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.textareaContainer}>
          <label htmlFor="feedback" className={styles.textareaLabel}>
            What could we improve?
          </label>
          <textarea
            id="feedback"
            className={styles.textarea}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your suggestions help us improve..."
            rows="4"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!rating || !selectedEmoji || isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span> Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
};

export default Feedback;