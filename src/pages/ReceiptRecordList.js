import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';
import { userActions } from '../store/userSlice';
import getAPIurl from '../functions/url';
import cx from 'classnames';

import Loading from '../components/Loading';

import styles from './ReceiptRecordList.module.css';

function ReceiptRecordList() {
    const dispatch = useDispatch();

    const receipts = useSelector(state => state.receipts.receiptList);
    const loading = useSelector(state => state.receipts.loading);
    const receiptMessage = useSelector(state => state.receipts.message);
    const userMessage = useSelector(state => state.user.message);

    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState("All");
    const [sort, setSort] = useState({
        name: "trans_date",
        orderAsc: false
    })

    const qualifiedExpenses = totalQualifiedExpenses();
    const reimbursedExpenses = totalReimbursedExpenses();
    const HSAExpenses = totalHSAExpenses();

    useEffect(() => {
        fetch(`${getAPIurl()}/receipt-records`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(receipts => {
                        dispatch(receiptActions.addReceipts(receipts));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                };
            });
    }, [dispatch])

    function displayReceipts() {
        if (receipts) {
            return receipts
                .filter(receipt => {
                    return receipt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        receipt.provider.toLowerCase().includes(searchTerm.toLowerCase())
                })
                .filter(receipt => {
                    return year === "All" ? receipt : receipt.trans_date.startsWith(year)
                })
                .sort((a, b) => {
                    if (sort) {
                        if (sort.orderAsc && sort.name !== "amount") {
                            return a[sort.name].localeCompare(b[sort.name])
                        } else if (!sort.orderAsc && sort.name !== "amount") {
                            return b[sort.name].localeCompare(a[sort.name])
                        } else if (sort.orderAsc && sort.name === "amount") {
                            return a[sort.name] - b[sort.name]
                        } else {
                            return b[sort.name] - a[sort.name]
                        }
                    }
                })
                .map(receipt => {
                    return (
                        <tr key={receipt.id}>
                            <td><Link to={`/receipt-records/${receipt.id}`}>{receipt.trans_date}</Link></td>
                            <td>{receipt.category}</td>
                            <td>{receipt.provider}</td>
                            <td>{receipt.qualified_exp}</td>
                            <td>${parseFloat(receipt.amount).toFixed(2)}</td>
                            <td>{receipt.payment_method}</td>
                            <td>{receipt.reimbursed}</td>
                        </tr>
                    )
                })
        }
    }

    function handleSearch(e) {
        setSearchTerm(e.target.value)
    }

    function getYearButtons() {
        if (receipts) {
            const years = Array.from(new Set(receipts.map(receipt => receipt.trans_date.slice(0, 4))))
            return years.map(year => {
                return <button key={year} className={styles.blue} onClick={(e) => handleYear(e, year)}>{year}</button>
            })
        }
    }

    function handleYear(e, year) {
        document.querySelectorAll("button").forEach(button => button.classList.remove(styles.blueActive));
        e.target.classList.add(styles.blueActive);
        setYear(year);
    }

    function sumTotals(array) {
        let expenses = 0;
        array.map(element => {
            return expenses += element.amount
        })
        return expenses
    }

    function totalQualifiedExpenses() {
        if (receipts) {
            const qualifiedReceipts = receipts.filter(receipt => {
                return year === "All" ? receipt : receipt.trans_date.startsWith(year)
            })
                .filter(receipt => {
                    return receipt.qualified_exp === "Yes" ? receipt : null
                })
            return sumTotals(qualifiedReceipts)
        }
    }

    function totalReimbursedExpenses() {
        if (receipts) {
            const reimbursedReceipts = receipts.filter(receipt => {
                return year === "All" ? receipt : receipt.trans_date.startsWith(year)
            })
                .filter(receipt => {
                    return receipt.reimbursed === 'Yes' ? receipt : null
                })
            return sumTotals(reimbursedReceipts)
        }
    }

    function totalHSAExpenses() {
        if (receipts) {
            const HSAReceipts = receipts.filter(receipt => {
                return year === "All" ? receipt : receipt.trans_date.startsWith(year)
            })
                .filter(receipt => {
                    return receipt.payment_method === 'HSA Debit Card' ? receipt : null
                })
            return sumTotals(HSAReceipts)
        }
    }

    function handleSort(e) {
        document.querySelectorAll("th").forEach(header => header.classList.remove(styles.active, styles.false, styles.true));
        e.target.classList.add(styles.active, styles[!sort.orderAsc]);
        const headerName = e.target.innerText.toLowerCase().split(" ").join("_");
        let name;
        switch (headerName) {
            case "transaction_date":
                name = "trans_date";
                break;
            case "qualified_expense":
                name = "qualified_exp";
                break;
            default:
                name = headerName;
                break;
        }
        setSort({ name: name, orderAsc: !sort.orderAsc })
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(receiptActions.setMessage(""));
            dispatch(userActions.setMessage(""));
        }
    }, [dispatch])

    return (
        <section className={styles.receiptList}>
            <h2>My Receipts</h2>
            {receiptMessage ? <><div className={styles.message}>{receiptMessage}</div><br /></> : null}
            {userMessage ? <><div className={styles.message}>{userMessage}</div><br /></> : null}
            {loading ?
                <Loading />
                :
                <>
                    <input aria-label="Search" type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
                    <h3>Total Expenses ({year})</h3>
                    <div className={styles.expenses}>
                        <div className={styles.expenseCategory}>
                            <h4>Qualified Expenses</h4>
                            <h4>${parseFloat(qualifiedExpenses).toFixed(2)}</h4>
                        </div>
                        <div className={styles.expenseCategory}>
                            <h4>Reimbursed Expenses</h4>
                            <h4>${parseFloat(reimbursedExpenses).toFixed(2)}</h4>
                        </div>
                        <div className={styles.expenseCategory}>
                            <h4>Paid with HSA Card</h4>
                            <h4>${parseFloat(HSAExpenses).toFixed(2)}</h4>
                        </div>
                        <div className={styles.expenseCategory}>
                            <h4>Can Withdraw from HSA</h4>
                            <h4>${parseFloat(qualifiedExpenses - reimbursedExpenses - HSAExpenses).toFixed(2)}</h4>
                        </div>
                    </div>

                    <h3>Receipts</h3>
                    <div className={styles.buttons}>
                        <button className={cx(styles.blue, styles.blueActive)} onClick={(e) => handleYear(e, "All")}>All</button>
                        {getYearButtons()}
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th className={cx(styles.active, styles.false)} onClick={handleSort}>Transaction Date</th>
                                <th onClick={handleSort}>Category</th>
                                <th onClick={handleSort}>Provider</th>
                                <th onClick={handleSort}>Qualified Expense</th>
                                <th onClick={handleSort}>Amount</th>
                                <th onClick={handleSort}>Payment Method</th>
                                <th onClick={handleSort}>Reimbursed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayReceipts()}
                        </tbody>
                    </table>
                </>
            }
        </section>
    );
};

export default ReceiptRecordList;