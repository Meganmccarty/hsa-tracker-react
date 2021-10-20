import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';
import getAPIurl from '../functions/url';

import Loading from '../components/Loading';

import styles from './ReceiptRecordDetail.module.css';

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
        image: "",
        filename: "",
        id: null
    });

    const url = getAPIurl();

    useEffect(() => {
        fetch(`${getAPIurl()}/receipt-records/${id}`, {
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
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        }
        fetch(`${getAPIurl()}/receipt-records/${id}`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then((data) => {
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

    function handleDownload(url) {
        const configObj = {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token")
            }
        };

        fetch(url, configObj)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    showLightbox.filename,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
        })
    }

    function displayReceiptImages() {
        if (receipt && receipt.receipt_images) {
            return receipt.receipt_images.map(image => {
                return (
                    <div className={styles.imageCard} key={image.url}>
                        <img
                            src={url ? `${url}${image.url}` : image.url}
                            alt={`${image.filename}: receipt for record ${receipt.provider} on ${receipt.trans_date}`}
                            onClick={() => setShowLightbox({
                                show: true,
                                image: (url ? `${url}${image.url}` : image.url),
                                filename: image.filename,
                                id: image.id
                            })}
                        />
                    </div>
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
        <>
            {showModal ?
                <section className={styles.modal}>
                    <div className={styles.content}>
                        <h2>Are you sure you want to delete this receipt record?</h2>
                        <h3>This action cannot be undone!</h3>

                        <div className={styles.buttons}>
                            <button className={styles.blue} onClick={() => setShowModal(false)}>Cancel</button>
                            <button className={styles.red} onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </section>
                : null
            }
            {showLightbox.show ?
                <section className={styles.modal}>
                    <img src={showLightbox.image} alt={`receipt for record ${receipt.provider} on ${receipt.trans_date}`} />
                    <div className={styles.buttons}>
                        <button className={styles.blue} onClick={() => handleDownload(`${getAPIurl()}/receipt-records/${id}/image-files/${showLightbox["id"]}`)}>Download File</button>
                        <button className={styles.white} onClick={() => setShowLightbox({ show: false, image: "" })}>Close</button>
                    </div>
                </section>
                : null
            }
            {loading ? <Loading /> :
                receipt ?
                    <section className={styles.receiptDetail}>
                        <h1>Receipt for {receipt.provider} on {receipt.trans_date}</h1>
                        {message ? <><div className={styles.message}>{message}</div><br /></> : null}
                        <div className={styles.table}>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Transaction Date</div>
                                <div className={styles.tableCell}>{receipt.trans_date}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Category</div>
                                <div className={styles.tableCell}>{receipt.category}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Provider</div>
                                <div className={styles.tableCell}>{receipt.provider}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Description</div>
                                <div className={styles.tableCell}>{receipt.description}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Qualified Expense</div>
                                <div className={styles.tableCell}>{receipt.qualified_exp}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Amount</div>
                                <div className={styles.tableCell}>
                                    ${parseFloat(receipt.amount).toFixed(2)}
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Payment Method</div>
                                <div className={styles.tableCell}>{receipt.payment_method}</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCell}>Reimbursed</div>
                                <div className={styles.tableCell}>{receipt.reimbursed}</div>
                            </div>
                            {receipt.qualified_exp === "Yes" && receipt.reimbursed === "Yes" ?
                                <div className={styles.tableRow}>
                                    <div className={styles.tableCell}>Reimbursed Date</div>
                                    <div className={styles.tableCell}>{receipt.reimbursed_date}</div>
                                </div>
                                : null
                            }
                            {receipt.notes ?
                                <div className={styles.tableRow}>
                                    <div className={styles.tableCell}>Notes</div>
                                    <div className={styles.tableCell}>{receipt.notes}</div>
                                </div>
                                : null
                            }
                        </div>
                        <div className={styles.buttons}>
                            <Link className={styles.blue} to={`/receipt-records/${id}/edit`}>Edit</Link>
                            <button className={styles.red} onClick={() => setShowModal(true)}>Delete</button>
                        </div>
                        {receipt.receipt_images ? <h2>Receipt Images</h2> : <h2>No Images</h2>}
                        <div className={styles.images}>
                            {displayReceiptImages()}
                        </div>
                    </section>
                    : null
            }
        </>
    );
};

export default ReceiptRecordDetail;