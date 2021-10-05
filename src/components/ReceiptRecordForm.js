import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { receiptActions } from '../store/receiptSlice';

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
        if (name === "qualified_exp" && value === "No") {
            setFormData({ ...formData, [e.target.name]: e.target.value, reimbursed: "", reimbursed_date: null })
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

        fetch("/receipt-records", configObj)
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
        <form onSubmit={handleSubmit}>
            <input
                type="date"
                name="trans_date"
                onChange={handleFormChange}
                placeholder="Transaction date"
                required={true}
            />
            <input
                type="text"
                name="category"
                onChange={handleFormChange}
                placeholder="Category"
            />
            <input
                type="text"
                name="provider"
                onChange={handleFormChange}
                placeholder="Provider"
                required={true}
            />
            <input
                type="text"
                name="description"
                onChange={handleFormChange}
                placeholder="Description"
            />
            <label htmlFor="qualified_exp">Qualified Expense?</label>
            <select name="qualified_exp" onChange={handleFormChange} required={true}>
                <option></option>
                <option>Yes</option>
                <option>No</option>
            </select>
            <input
                type="text"
                name="amount"
                onChange={handleFormChange}
                placeholder="Amount"
                required={true}
            />
            <label htmlFor="payment_method">Payment Method</label>
            <select name="payment_method" onChange={handleFormChange} required={true}>
                <option></option>
                <option>Cash</option>
                <option>Check</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
                <option>Electronic Bank Transfer</option>
                <option>HSA Debit Card</option>
            </select>
            {formData.qualified_exp === "Yes" ?
                <>
                    <label htmlFor="reimbursed">Reimbursed?</label>
                    <select name="reimbursed" onChange={handleFormChange} required={true}>
                        <option></option>
                        <option>Yes</option>
                        <option>No</option>
                        <option>N/A</option>
                    </select>
                    {formData.reimbursed === "Yes" ?
                        <input
                            type="date"
                            name="reimbursed_date"
                            onChange={handleFormChange}
                            value={formData.reimbursed_date}
                            required={true}
                        />
                        : null
                    }
                </>
                : null
            }
            <input
                type="text"
                name="notes"
                onChange={handleFormChange}
                placeholder="Notes"
            />
            <input
                type="text"
                name="hsa_trans_id"
                onChange={handleFormChange}
                placeholder="HSA transaction ID"
            />
            <input
                type="file"
                name="receipt_images"
                accept="image/*"
                multiple={true}
                onChange={handleImageChange}
            />
            <input type="submit" />
        </form>
    );
};

export default ReceiptRecordForm;