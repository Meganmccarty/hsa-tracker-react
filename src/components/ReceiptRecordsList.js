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
                        <td>{parseFloat(receipt.amount).toFixed(2)}</td>
                        <td>{receipt.payment_method}</td>
                        <td>{receipt.reimbursed}</td>
                    </tr>
                )
            })
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
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Provider</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Reimbursed?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayReceipts()}
                    </tbody>
                </table>
            }
        </>
    );
};

export default ReceiptRecordsList;