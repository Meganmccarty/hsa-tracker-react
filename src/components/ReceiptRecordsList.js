import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import Loading from './Loading';

function ReceiptRecordsList() {
    const dispatch = useDispatch();

    const receipts = useSelector(state => state.receipts.receiptList);
    const loading = useSelector(state => state.receipts.loading);

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
        fetch("/receipt-records", {
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
                    return receipt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <td>{receipt.provider}</td>
                            <td>{receipt.description}</td>
                            <td>{receipt.qualified_exp}</td>
                            <td>{parseFloat(receipt.amount).toFixed(2)}</td>
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
                return <button key={year} onClick={() => handleYear(year)}>{year}</button>
            })
        }
    }

    function handleYear(year) {
        setYear(year)
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
        document.querySelectorAll("th").forEach(header => header.classList.remove("active", "false", "true"));
        e.target.classList.add("active", !sort.orderAsc)
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
        setSort({name: name, orderAsc: !sort.orderAsc})
    }

    return (
        <>
            <h1>Receipt Records List</h1>
            {loading ?
                <Loading />
                :
                <>
                    <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
                    <h3>Total Qualified Expenses -- {year}</h3>
                    {parseFloat(qualifiedExpenses).toFixed(2)}

                    <h3>Total Reimbursed Expenses -- {year}</h3>
                    {parseFloat(reimbursedExpenses).toFixed(2)}

                    <h3>Total Expenses Paid with HSA Card -- {year}</h3>
                    {parseFloat(HSAExpenses).toFixed(2)}

                    <h3>Remaining Safe Amount to Withdraw from HSA -- {year}</h3>
                    {parseFloat(qualifiedExpenses - reimbursedExpenses - HSAExpenses).toFixed(2)}

                    <button onClick={() => handleYear("All")}>All</button>
                    {getYearButtons()}

                    <table>
                        <thead>
                            <tr>
                                <th className="active false" onClick={handleSort}>Transaction Date</th>
                                <th onClick={handleSort}>Provider</th>
                                <th onClick={handleSort}>Description</th>
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
        </>
    );
};

export default ReceiptRecordsList;