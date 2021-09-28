import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import loadingGIF from '../loading.gif';

function ReceiptRecordsList() {
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.receipts.receiptList);
    const loading = useSelector(state => state.receipts.loading);

    useEffect(() => {
        fetch("/receipt-records")
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
    }, [])

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
            <h1>Receipt Records List</h1>
            {loading ?
                <img src={loadingGIF} alt="Loading..." width="25%" />
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