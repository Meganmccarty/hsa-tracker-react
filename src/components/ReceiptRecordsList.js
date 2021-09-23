import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveReceipts } from '../store/receiptsSlice';

function ReceiptRecordsList() {
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.receipts.receipts);
    
    useEffect(() => {
        dispatch(retrieveReceipts());
    }, [dispatch]);

    console.log(receipts);

    const displayReceipts = receipts.map(receipt => {
        return (
            <tr key={receipt.id}>
                <td>{receipt.trans_date}</td>
                <td>{receipt.provider}</td>
                <td>{receipt.decription}</td>
                <td>{receipt.amount}</td>
                <td>{receipt.payment_method}</td>
                <td>{receipt.reimbursed}</td>
            </tr>
        )
    })

    return (
        <>
            <h1>Receipt Records List</h1>
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
                    {displayReceipts}
                </tbody>
            </table>
        </>
    );
};

export default ReceiptRecordsList;