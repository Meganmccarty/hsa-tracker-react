import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

import CSRFToken from './cookies';

function ReceiptRecordEdit() {
    const id = parseInt(useParams().id);
    const history = useHistory();
    const dispatch = useDispatch();
    const receipt = useSelector(state => state.receipts.receipt);

    const [formData, setFormData] = useState({
        trans_date: receipt.trans_date,
        category: receipt.category,
        provider: receipt.provider,
        description: receipt.description,
        qualified_exp: receipt.qualified_exp,
        amount: receipt.amount,
        payment_method: receipt.payment_method,
        reimbursed: receipt.reimbursed,
        notes: receipt.notes,
        hsa_trans_id: receipt.hsa_trans_id,
        receipt_images: []
    });

    useEffect(() => {
        fetch(`/receipt-records/${id}`)
            .then(response => {
                if (response.ok) {
                    response.json().then(receipt => {
                        dispatch(receiptActions.getReceipt(receipt));
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

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleImageChange(e) {
        setFormData({ ...formData, receipt_images: Array.from(e.target.files) });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.qualified_exp === "Yes") {
            setFormData({ ...formData, qualified_exp: true })
        } else if (formData.qualified_exp === "No") {
            setFormData({ ...formData, qualified_exp: false })
        }

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
                "X-CSRF-Token": CSRFToken(document.cookie)
            },
            body: finalForm
        };

        fetch(`/receipt-records/${id}`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(receipt => {
                        dispatch(receiptActions.patchReceipt(receipt));
                        dispatch(receiptActions.toggleLoading(false));
                        history.push(`/receipt-records/${receipt.id}`)
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(receiptActions.setErrors(errors));
                        dispatch(receiptActions.toggleLoading(false));
                    });
                };
            });
    }

    console.log(formData);

    return (
        <>
            {receipt ?
                <>
                    <h1>Edit Receipt Record {receipt.id}</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="date" name="trans_date" onChange={handleFormChange} value={formData.trans_date} />
                        <input type="text" name="category" onChange={handleFormChange} value={formData.category} />
                        <input type="text" name="provider" onChange={handleFormChange} value={formData.provider} />
                        <input type="text" name="description" onChange={handleFormChange} value={formData.description} />
                        <label htmlFor="qualified_exp">Qualified Expense?</label>
                        <select name="qualified_exp" onChange={handleFormChange} value={formData.qualified_exp ? "Yes" : "No" }>
                            <option>--</option>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        <input type="text" name="amount" onChange={handleFormChange} value={formData.amount}/>
                        <input type="text" name="payment_method" onChange={handleFormChange} value={formData.payment_method} />
                        <label htmlFor="reimbursed">Reimbursed?</label>
                        <select name="reimbursed" onChange={handleFormChange} value={formData.reimbursed}>
                            <option>--</option>
                            <option>Yes</option>
                            <option>No</option>
                            <option>N/A</option>
                        </select>
                        <input type="text" name="notes" onChange={handleFormChange} value={formData.notes} />
                        <input type="text" name="hsa_trans_id" onChange={handleFormChange} value={formData.hsa_trans_id} />
                        <input type="file" name="receipt_images" accept="image/*" multiple={true} onChange={handleImageChange} />
                        <input type="submit" />
                        <button><Link to={`/receipt-records/${id}`}>Cancel</Link></button>
                    </form>
                </>
                : null
            }

        </>

    );
};

export default ReceiptRecordEdit;