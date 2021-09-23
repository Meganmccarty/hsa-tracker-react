import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveReceipts, receiptsActions } from '../store/receiptsSlice';

import loadingGIF from '../loading.gif';

function ReceiptRecordsList() {
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.receipts.receipts);
    const loading = useSelector(state => state.receipts.loading);

    useEffect(() => {
        dispatch(retrieveReceipts());
        dispatch(receiptsActions.toggleLoading(false))
    }, [dispatch]);

    console.log(receipts);
    console.log(loading);

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
                        {displayReceipts}
                    </tbody>
                </table>
            }
        </>
    );
};

export default ReceiptRecordsList;