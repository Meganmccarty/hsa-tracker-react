import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiptActions } from '../../store/receiptSlice';
import getAPIurl from '../../functions/url';

import styles from './receipt-forms.module.css';

function ReceiptRecordEdit() {
    const id = parseInt(useParams().id);
    const history = useHistory();
    const dispatch = useDispatch();
    const receipt = useSelector(state => state.receipts.receipt);
    const [formData, setFormData] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const url = getAPIurl();

    function handlePopUp() {
        setShowPopUp(!showPopUp);
    }

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
                        setFormData({
                            trans_date: receipt.receipt_record.trans_date,
                            category: receipt.receipt_record.category ? receipt.receipt_record.category : "",
                            provider: receipt.receipt_record.provider,
                            description: receipt.receipt_record.description ? receipt.receipt_record.description : "",
                            qualified_exp: receipt.receipt_record.qualified_exp,
                            amount: receipt.receipt_record.amount,
                            payment_method: receipt.receipt_record.payment_method,
                            reimbursed: receipt.receipt_record.reimbursed,
                            reimbursed_date: receipt.receipt_record.reimbursed_date ? receipt.receipt_record.reimbursed_date : "",
                            notes: receipt.receipt_record.notes ? receipt.receipt_record.notes : "",
                            hsa_trans_id: receipt.receipt_record.hsa_trans_id ? receipt.receipt_record.hsa_trans_id : "",
                            receipt_images: [],
                            receipt_images_to_delete: []
                        })
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                };
            });
    }, [dispatch, id])

    function displayReceiptImages() {
        if (receipt && receipt.receipt_images) {
            return receipt.receipt_images.map(image => {
                return (
                    <div className={styles.imageCard} key={image.url}>
                        <img src={url ? `${url}/${image.url}` : image.url} alt={`${image.filename}: receipt for record ${receipt.provider} on ${receipt.trans_date}`} />
                        <button className={styles.red} onClick={(e) => handleDelete(e, image.id)}>Delete</button>
                    </div>
                )
            })
        }
    }

    function handleDelete(e, image) {
        e.target.parentElement.innerHTML = "";
        setFormData({ ...formData, receipt_images_to_delete: [...formData.receipt_images_to_delete, image] })
    }

    function handleFormChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setShowPopUp(false);
        if ((name === "qualified_exp" && value === "No") || (name === "payment_method" && value === "HSA Debit Card")) {
            setFormData({ ...formData, [e.target.name]: e.target.value, reimbursed: "N/A", reimbursed_date: null })
        } else if ((name === "reimbursed" && value === "No") || value === "N/A") {
            setFormData({ ...formData, [e.target.name]: e.target.value, reimbursed_date: null })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    function handleImageChange(e) {
        setFormData({ ...formData, receipt_images: Array.from(e.target.files) });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const finalForm = new FormData();
        for (const key in formData) {
            if (key !== "receipt_images") {
                finalForm.append(key, formData[key])
            } else {
                for (const image in formData.receipt_images) {
                    finalForm.append("receipt_images[]", formData.receipt_images[image])
                }
            }
        }

        const configObj = {
            method: "PATCH",
            headers: {
                Authorization: localStorage.getItem("token")
            },
            body: finalForm
        };

        fetch(`${getAPIurl()}/receipt-records/${id}`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(receipt => {
                        history.push(`/receipt-records/${receipt.receipt_record.id}`)
                        dispatch(receiptActions.patchReceipt(receipt.receipt_record));
                        dispatch(receiptActions.setMessage(receipt.status.message));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                };
            });
    }

    return (
        receipt && formData ?
            <section className={styles.receiptForm}>
                <h1>Edit Receipt for {receipt.provider} on {receipt.trans_date}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="trans_date">Transaction date</label>
                            <input
                                type="date"
                                name="trans_date"
                                id="trans_date"
                                onChange={handleFormChange}
                                value={formData.trans_date}
                                required={true}
                            />
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                onChange={handleFormChange}
                                value={formData.category}
                            />
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="provider">Provider</label>
                            <input
                                type="text"
                                name="provider"
                                id="provider"
                                onChange={handleFormChange}
                                value={formData.provider}
                                required={true}
                            />
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                onChange={handleFormChange}
                                value={formData.description}
                            />
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="qualified_exp">
                                Qualified Expense? <i className="fa fa-info-circle" onClick={handlePopUp}></i>
                            </label>
                            {showPopUp ?
                                <div className={styles.popup}>
                                    For more information on what constitutes a qualified expense, please visit
                                    the <a href="https://www.irs.gov/forms-pubs/about-publication-502">IRS's website</a>
                                </div>
                                : null
                            }
                            <select
                                name="qualified_exp"
                                id="qualified_exp"
                                onChange={handleFormChange}
                                value={formData.qualified_exp}
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                onChange={handleFormChange}
                                value={formData.amount}
                                required={true}
                            />
                        </div>
                        <div className={styles.labelAndInput}>
                            <label htmlFor="payment_method">Payment Method</label>
                            <select
                                name="payment_method"
                                id="payment_method"
                                onChange={handleFormChange}
                                value={formData.payment_method}
                            >
                                <option>Cash</option>
                                <option>Check</option>
                                <option>Debit Card</option>
                                <option>Credit Card</option>
                                <option>Electronic Bank Transfer</option>
                                <option>HSA Debit Card</option>
                            </select>
                        </div>
                        {
                            formData.qualified_exp === "Yes" &&
                                (formData.payment_method !== "HSA Debit Card" && formData.payment_method !== "") ?
                                <>
                                    <div className={styles.labelAndInput}>
                                        <label htmlFor="reimbursed">Reimbursed?</label>
                                        <select
                                            name="reimbursed"
                                            id="reimbursed"
                                            onChange={handleFormChange}
                                            value={formData.reimbursed}
                                            required={true}
                                        >
                                            <option></option>
                                            <option>Yes</option>
                                            <option>No</option>
                                        </select>
                                    </div>
                                    {formData.reimbursed === "Yes" ?
                                        <div className={styles.labelAndInput}>
                                            <label htmlFor="reimbursed_date">Reimbursed date</label>
                                            <input
                                                type="date"
                                                name="reimbursed_date"
                                                id="reimbursed_date"
                                                onChange={handleFormChange}
                                                value={formData.reimbursed_date}
                                                required={true}
                                            />
                                        </div>
                                        : null
                                    }
                                </>
                                : null
                        }
                        <div className={styles.labelAndInput}>
                            <label htmlFor="notes">Notes</label>
                            <input
                                type="text"
                                name="notes"
                                id="notes"
                                onChange={handleFormChange}
                                value={formData.notes}
                            />
                        </div>
                        <input
                            type="file"
                            name="receipt_images"
                            aria-label="Upload receipt images"
                            accept="image/*"
                            multiple={true}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className={styles.images}>
                        {displayReceiptImages()}
                    </div>
                    <div className={styles.buttons}>
                        <input type="submit" aria-label="Submit button" />
                        <Link className={styles.red} to={`/receipt-records/${id}`}>Cancel</Link>
                    </div>
                </form>
            </section>
            : null
    );
};

export default ReceiptRecordEdit;