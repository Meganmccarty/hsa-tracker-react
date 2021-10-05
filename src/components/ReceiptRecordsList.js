import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import Loading from './Loading';

function ReceiptRecordsList() {
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.receipts.receiptList);
    const loading = useSelector(state => state.receipts.loading);
    const userMessage = useSelector(state => state.user.message);
    const receiptMessage = useSelector(state => state.receipts.message);

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
            return receipts.map(receipt => {
                return (
                    <tr key={receipt.id}>
                        <td><Link to={`/receipt-records/${receipt.id}`}>{receipt.trans_date}</Link></td>
                        <td>{receipt.provider}</td>
                        <td>{receipt.decription}</td>
                        <td>{receipt.qualified_exp}</td>
                        <td>{parseFloat(receipt.amount).toFixed(2)}</td>
                        <td>{receipt.payment_method}</td>
                        <td>{receipt.reimbursed}</td>
                    </tr>
                )
            })
        }
    }

    const qualifiedExpenses = totalQualifiedExpenses();
    const reimbursedExpenses = totalReimbursedExpenses();
    const HSAExpenses = totalHSAExpenses();

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
                return receipt.qualified_exp === 'Yes' ? receipt : null
            })
            return sumTotals(qualifiedReceipts)
        }
    }

    function totalReimbursedExpenses() {
        if (receipts) {
            const reimbursedReceipts = receipts.filter(receipt => {
                return receipt.reimbursed === 'Yes' ? receipt : null
            })
            return sumTotals(reimbursedReceipts)
        }
    }

    function totalHSAExpenses() {
        if (receipts) {
            const HSAReceipts = receipts.filter(receipt => {
                return receipt.payment_method === 'HSA Debit Card' ? receipt : null
            })
            return sumTotals(HSAReceipts)
        }
    }

    return (
        <>
            { userMessage ? userMessage : null }
            { receiptMessage ? receiptMessage : null }
            <h1>Receipt Records List</h1>
            {loading ?
                <Loading />
                :
                <>
                <h3>Total Qualified Expenses</h3>
                {parseFloat(qualifiedExpenses).toFixed(2)}
                <h3>Total Reimbursed Expenses</h3>
                {parseFloat(reimbursedExpenses).toFixed(2)}
                <h3>Total Expenses Paid with HSA Card</h3>
                {parseFloat(HSAExpenses).toFixed(2)}
                <h3>Remaining Safe Amount to Withdraw from HSA</h3>
                {parseFloat(qualifiedExpenses - reimbursedExpenses - HSAExpenses).toFixed(2)}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Provider</th>
                            <th>Description</th>
                            <th>Qualified Expense?</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Reimbursed?</th>
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