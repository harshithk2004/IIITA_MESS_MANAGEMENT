import React from 'react';
import styles from '../styles/Homepage.module.css';
import { FaUtensils, FaClipboardList, FaUserShield, FaChartLine, FaBell, FaUsers, FaCalendarAlt, FaWarehouse, FaMoneyBillWave } from 'react-icons/fa';
import Dashboard from '../styles/images/Dashboard.png'
import MessMenu from '../styles/images/MessMenu.png'
import Feedback from '../styles/images/Feedback.png'
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <FaUtensils className={styles.logoIcon} />
          <h1 className={styles.logoText}>Hostel Mess Manager Pro</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#dashboard" className={styles.navLink}>Dashboard</a>
          <a href="#screenshots" className={styles.navLink}>Screenshots</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
          <div className={styles.authButtons}>
          <Link to="/login" className={`${styles.button} ${styles.login}`}>
            Student Login
          </Link>
          <Link to="/login" className={`${styles.button} ${styles.primary}`}>
            Committee Login
          </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Comprehensive Hostel Mess Management</h2>
          <p className={styles.heroSubtitle}>
            Our advanced system provides complete control over mess operations including inventory tracking, 
            menu planning, expense management, and rebate processing - all in one platform.
          </p>
          <div className={styles.heroButtons}>
            <button className={`${styles.button} ${styles.cta}`}>Request Demo</button>
            <button className={`${styles.button} ${styles.secondary}`}>Learn More</button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imageOverlay}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <h3>500+</h3>
          <p>Students Served</p>
        </div>
        <div className={styles.statItem}>
          <h3>95%</h3>
          <p>Efficiency Gain</p>
        </div>
        <div className={styles.statItem}>
          <h3>30%</h3>
          <p>Cost Reduction</p>
        </div>
        <div className={styles.statItem}>
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionSubtitle}>Everything you need to manage your hostel mess efficiently</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaClipboardList className={styles.featureIcon} />
            </div>
            <h3>Menu Management</h3>
            <p>Plan and organize weekly menus with different meals for each day. Set recurring menus and special occasion meals.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaWarehouse className={styles.featureIcon} />
            </div>
            <h3>Inventory Control</h3>
            <p>Real-time tracking of stock levels with automatic low-stock alerts. Maintain optimal inventory levels.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaUserShield className={styles.featureIcon} />
            </div>
            <h3>Rebate System</h3>
            <p>Automated rebate processing with validation rules. Students can request rebates with proper notice period.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaMoneyBillWave className={styles.featureIcon} />
            </div>
            <h3>Expense Tracking</h3>
            <p>Track all mess expenses with detailed reports. Analyze spending patterns and optimize costs.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaUsers className={styles.featureIcon} />
            </div>
            <h3>Employee Management</h3>
            <p>Manage mess staff schedules, duties, and payroll. Track attendance and performance.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaChartLine className={styles.featureIcon} />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Visualize all mess operations data with interactive charts and reports for better decision making.</p>
          </div>
        </div>
      </section>

      {/* Dashboard Explanation Section */}
      <section id="dashboard" className={styles.dashboardInfo}>
        <div className={styles.dashboardContent}>
          <div className={styles.dashboardText}>
            <h2>Interactive Dashboard</h2>
            <p>
              Our comprehensive dashboard provides real-time insights into all aspects of mess management:
            </p>
            <ul className={styles.dashboardFeatures}>
              <li><strong>Inventory Status:</strong> Current stock levels with visual indicators</li>
              <li><strong>Expense Analytics:</strong> Monthly spending trends and comparisons</li>
              <li><strong>Rebate Tracking:</strong> Pending and approved rebate requests</li>
              <li><strong>Menu Compliance:</strong> Adherence to planned vs actual meals served</li>
              <li><strong>Feedback Summary:</strong> Student satisfaction metrics</li>
              <li><strong>Staff Performance:</strong> Employee productivity metrics</li>
            </ul>
            <button className={`${styles.button} ${styles.primary}`}>View Sample Dashboard</button>
          </div>
          <div className={styles.dashboardVisual}>
            <div className={styles.dashboardMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupNav}></div>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupSidebar}></div>
                <div className={styles.mockupMain}>
                  <div className={styles.mockupChart}></div>
                  <div className={styles.mockupStats}>
                    <div className={styles.mockupStat}></div>
                    <div className={styles.mockupStat}></div>
                    <div className={styles.mockupStat}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section id="screenshots" className={styles.screenshots}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>System Screenshots</h2>
              <p className={styles.sectionSubtitle}>See our system in action</p>
            </div>
            
            <div className={styles.screenshotGrid}>
              {/* Screenshot 1 */}
              <div className={styles.screenshotItem}>
                <img 
                  src={Dashboard} 
                  alt="Dashboard Overview"
                  className={styles.screenshotImg}
                />
                <p className={styles.screenshotCaption}>Dashboard Overview</p>
              </div>

              {/* Screenshot 2 */}
              <div className={styles.screenshotItem}>
                <img 
                  src={Feedback} 
                  alt="Inventory Management"
                  className={styles.screenshotImg}
                />
                <p className={styles.screenshotCaption}>Feedback</p>
              </div>

              {/* Screenshot 3 */}
              <div className={styles.screenshotItem}>
                <img 
                  src={MessMenu} 
                  alt="Menu Planning"
                  className={styles.screenshotImg}
                />
                <p className={styles.screenshotCaption}>Menu Planning</p>
              </div>

              {/* Screenshot 4 */}
              <div className={styles.screenshotItem}>
                <img 
                  src={Dashboard} 
                  alt="Rebate System"
                  className={styles.screenshotImg}
                />
                <p className={styles.screenshotCaption}>Rebate Management</p>
              </div>
            </div>
          </section>
      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2>Get In Touch</h2>
            <p>Have questions about our Hostel Mess Management System? Contact our team for more information.</p>
            <div className={styles.contactDetails}>
              <p><strong>Email:</strong> support@hostelmesspro.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Campus Drive, University District</p>
            </div>
          </div>
          <div className={styles.contactForm}>
            <form>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Your Email" />
              </div>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Subject" />
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className={`${styles.button} ${styles.primary}`}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerAbout}>
            <div className={styles.footerLogo}>
              <FaUtensils className={styles.logoIcon} />
              <span>Hostel Mess Pro</span>
            </div>
            <p>Comprehensive mess management solution for hostels and educational institutions.</p>
            <div className={styles.socialLinks}>
              <a href="#"><span className={styles.socialIcon}>FB</span></a>
              <a href="#"><span className={styles.socialIcon}>TW</span></a>
              <a href="#"><span className={styles.socialIcon}>IG</span></a>
              <a href="#"><span className={styles.socialIcon}>LI</span></a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#screenshots">Screenshots</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className={styles.footerNewsletter}>
            <h4>Newsletter</h4>
            <p>Subscribe to get updates about new features.</p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Your Email" />
              <button type="submit" className={styles.newsletterButton}>Subscribe</button>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Hostel Mess Manager Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;