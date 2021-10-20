import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { receiptActions } from '../../store/receiptSlice';
import getAPIurl from '../../functions/url';

import styles from './receipt-forms.module.css';

function ReceiptRecordForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [formData, setFormData] = useState({
        trans_date: "",
        category: "",
        provider: "",
        description: "",
        qualified_exp: "",
        amount: "",
        payment_method: "",
        reimbursed: "",
        reimbursed_date: "",
        notes: "",
        hsa_trans_id: "",
        receipt_images: []
    });

    function handleFormChange(e) {
        const name = e.target.name;
        const value = e.target.value;
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
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token")
            },
            body: finalForm
        };

        fetch(`${getAPIurl()}/receipt-records`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(receipt => {
                        console.log(receipt)
                        dispatch(receiptActions.createReceipt(receipt.receipt_record));
                        dispatch(receiptActions.setMessage(receipt.status.message))
                        dispatch(receiptActions.toggleLoading(false));
                        history.push(`/receipt-records/${receipt.receipt_record.id}`)
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
        <section className={styles.receiptForm}>
            <h1>New Receipt</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.fields}>
                    <div className={styles.labelAndInput}>
                        <label htmlFor="trans_date">Transaction date</label>
                        <input
                            type="date"
                            name="trans_date"
                            id="trans_date"
                            onChange={handleFormChange}
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
                        />
                    </div>
                    <div className={styles.labelAndInput}>
                        <label htmlFor="provider">Provider</label>
                        <input
                            type="text"
                            name="provider"
                            id="provider"
                            onChange={handleFormChange}
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
                        />
                    </div>
                    <div className={styles.labelAndInput}>
                        <label htmlFor="qualified_exp">Qualified Expense?</label>
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        <select name="qualified_exp" id="qualified_exp" onChange={handleFormChange} required={true}>
                            <option></option>
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
                            required={true}
                        />
                    </div>
                    <div className={styles.labelAndInput}>
                        <label htmlFor="payment_method">Payment Method</label>
                        <select name="payment_method" id="payment_method" onChange={handleFormChange} required={true}>
                            <option></option>
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
                                <select name="reimbursed" id="reimbursed" onChange={handleFormChange} required={true}>
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
                <div className={styles.buttons}>
                    <input type="submit" aria-label="Submit button" />
                </div>
            </form>
        </section>
    );
};

export default ReceiptRecordForm;