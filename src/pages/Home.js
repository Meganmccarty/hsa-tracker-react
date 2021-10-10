import { Link } from 'react-router-dom';

import newReceipt from '../images/new-receipt.png';
import receiptTable from '../images/receipt-table.png';
import receiptDetail from '../images/receipt-detail.png';
import receiptImage from '../images/receipt-image.png';
import totalExpenses from '../images/total-expenses.png';
import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles.home}>
            <h1>Welcome to HSA Tracker!</h1>
            <h2>The app for tracking your Health Savings Account receipts!</h2>
            <section className={styles.details}>
                <img src={newReceipt} alt="New Receipt Form" />
                <h3>Easily add a new receipt and attach associated images!</h3>
            </section>
            <section className={styles.details}>
                <h3>See all of your receipts in a sortable, searchable table. You can also filter the table by year!</h3>
                <img src={receiptTable} alt="Receipt Records Table" />
            </section>
            <section className={styles.details}>
                <img src={receiptDetail} alt="Detailed Receipt Record" />
                <h3>View the details of an individual receipt with edit and delete options!</h3>
            </section>
            <section className={styles.details}>
                <h3>View your attached receipt images. You can add as many images as you'd like for each receipt!</h3>
                <img src={receiptImage} alt="Receipt Image" />
            </section>
            <section className={styles.details}>
                <img src={totalExpenses} alt="Total Expenses" />
                <h3>Make filing taxes easy by viewing all your expenses for the year!</h3>
            </section>
            <h2 className={styles.signup}>Ready to get started?</h2>
            <Link className={styles.signupLink} to="/signup">Create an account!</Link>
        </div>
    )
};

export default Home;