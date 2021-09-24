import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptsActions } from '../store/receiptsSlice';

import CSRFToken from './cookies';

function ReceiptRecordDetail() {
    const id = parseInt(useParams().id)
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const receipt = useSelector(state => state.receipts.receipt);

    useEffect(() => {
        dispatch(receiptsActions.addUserReceipts(user.receipt_records));
        dispatch(receiptsActions.getReceipt(id));
    }, [dispatch, user.receipt_records, id]);

    function handleDelete() {
        fetch(`/receipt-records/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": CSRFToken(document.cookie)
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            console.log(data)
            dispatch(receiptsActions.deleteReceipt(id))
        })
        history.push("/receipt-records");
    }

    return (
        <>
            {receipt ?
                <>
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
                                <td>{receipt.qualified_exp ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>Amount</td>
                                <td>{parseFloat(receipt.amount).toFixed(2)}</td>
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
                    <button>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
                : null}
        </>
    );
};

export default ReceiptRecordDetail;