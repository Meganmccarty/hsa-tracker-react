import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptsActions } from '../store/receiptsSlice';

function ReceiptRecordDetail() {
    const id = parseInt(useParams().id)
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const receipt = useSelector(state => state.receipts.receipt);

    useEffect(() => {
        dispatch(receiptsActions.addUserReceipts(user.receipt_records));
        dispatch(receiptsActions.getReceipt(id));
    }, [dispatch, user.receipt_records, id]);

    return (
        <>
        {receipt ? 
            <table>
                <tbody>
                    <tr>
                        <td>Date</td>
                        <td>{receipt.trans_date}</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td>{receipt.category}</td>
                    </tr>
                    <tr>
                        <td>Provider</td>
                        <td>{receipt.provider}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>{receipt.description}</td>
                    </tr>
                    <tr>
                        <td>Qualified Expense?</td>
                        <td>{receipt.qualified_exp}</td>
                    </tr>
                    <tr>
                        <td>Amount</td>
                        <td>{receipt.amount}</td>
                    </tr>
                    <tr>
                        <td>Payment Method</td>
                        <td>{receipt.payment_method}</td>
                    </tr>
                    <tr>
                        <td>Reimbursed?</td>
                        <td>{receipt.reimbursed}</td>
                    </tr>
                    <tr>
                        <td>Notes</td>
                        <td>{receipt.notes}</td>
                    </tr>
                    <tr>
                        <td>HSA transaction ID</td>
                        <td>{receipt.hsa_trans_id}</td>
                    </tr>
                </tbody>
            </table>
            : null }
        </>
    );
};

export default ReceiptRecordDetail;