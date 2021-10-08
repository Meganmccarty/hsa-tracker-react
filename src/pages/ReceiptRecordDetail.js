import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import Loading from '../components/Loading';

import './ReceiptRecordDetail.css';

function ReceiptRecordDetail() {
    const id = parseInt(useParams().id);
    const history = useHistory();

    const dispatch = useDispatch();
    const loading = useSelector(state => state.receipts.loading);
    const receipt = useSelector(state => state.receipts.receipt);
    const message = useSelector(state => state.receipts.message);

    const [showModal, setShowModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState({
        show: false,
        image: ""
    });

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
                    <img
                        key={image.url}
                        src={image.url}
                        alt={`receipt for record ${receipt.provider} on ${receipt.trans_date}`}
                        onClick={() => setShowLightbox({show: true, image: image.url })}
                    />
                )
            })
        }
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(receiptActions.setMessage(""));
        };
    }, [dispatch]);

    return (
        <main id="receipt-detail">
            {showModal ?
                <section className="modal">
                    <div id="content">
                        <h2>Are you sure you want to delete this receipt record?</h2>
                        <h3>This action cannot be undone!</h3>

                        <div className="buttons">
                            <button id="cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="delete" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </section>
                : null
            }
            {showLightbox.show ?
                <section className="modal">
                    <img src={showLightbox.image} alt={`receipt for record ${receipt.provider} on ${receipt.trans_date}`} />
                    <button id="close" onClick={() => setShowLightbox({ show: false, image: "" })}>Close</button>
                </section>
                : null
            }
            {loading ? <Loading /> :
                receipt ?
                    <section>
                        <h1>Receipt Record for {receipt.provider} on {receipt.trans_date}</h1>
                        {message ? <><div id="message">{message}</div><br /></> : null}
                        <table id="detail-table">
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
                                    <>
                                        <tr>
                                            <td>Reimbursed?</td>
                                            <td>{receipt.reimbursed}</td>
                                        </tr>
                                        {receipt.reimbursed === "Yes" ?
                                            <tr>
                                                <td>Reimbursed Date</td>
                                                <td>{receipt.reimbursed_date}</td>
                                            </tr>
                                            : null
                                        }
                                    </>
                                    : null
                                }
                                <tr>
                                    <td>Notes</td>
                                    <td>{receipt.notes}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="buttons">
                            <button id="edit"><Link to={`/receipt-records/${id}/edit`}>Edit</Link></button>
                            <button className="delete" onClick={() => setShowModal(true)}>Delete</button>
                        </div>
                        {receipt.receipt_images ? <h2>Receipt Record Images</h2> : <h2>No Images</h2>}
                        <div className="images">
                            {displayReceiptImages()}
                        </div>
                    </section>
                    : null
            }
        </main>
    );
};

export default ReceiptRecordDetail;