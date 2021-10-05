import { useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import Loading from './Loading';

function ReceiptRecordDetail() {
    const id = parseInt(useParams().id)
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.receipts.loading);
    const receipt = useSelector(state => state.receipts.receipt);
    const message = useSelector(state => state.receipts.message)

    useEffect(() => {
        fetch(`/receipt-records/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(receipt => {
                        dispatch(receiptActions.getReceipt(receipt.receipt_record));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                };
            });
    }, [dispatch, id])

    function handleDelete() {
        const configObj = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(`/receipt-records/${id}`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data);
                        dispatch(receiptActions.deleteReceipt(id));
                        dispatch(receiptActions.setMessage(data.status.message))
                        history.push("/receipt-records");
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                    });
                };
            });
    }

    function displayReceiptImages() {
        if (receipt && receipt.receipt_images) {
            return receipt.receipt_images.map(image => {
                return (
                    <img key={image.url} src={image.url} alt="receipt" width="25%" />
                )
            })
        }
    }

    return (
        <>
            {message ? message : null}
            {loading ? <Loading /> :
                receipt ?
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
                                    <td>{receipt.qualified_exp}</td>
                                </tr>
                                <tr>
                                    <td>Amount</td>
                                    <td>{parseFloat(receipt.amount).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Payment Method</td>
                                    <td>{receipt.payment_method}</td>
                                </tr>
                                {receipt.qualified_exp === "Yes" ?
                                    <tr>
                                        <td>Reimbursed?</td>
                                        <td>{receipt.reimbursed}</td>
                                    </tr>
                                    : null
                                }
                                {receipt.reimbursed_date ?
                                    <tr>
                                        <td>Reimbursed Date</td>
                                        <td>{receipt.reimbursed_date}</td>
                                    </tr>
                                    : null
                                }
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
                        <button><Link to={`/receipt-records/${id}/edit`}>Edit</Link></button>
                        <button onClick={handleDelete}>Delete</button>
                        {displayReceiptImages()}
                    </>
                    : null
            }
        </>
    );
};

export default ReceiptRecordDetail;