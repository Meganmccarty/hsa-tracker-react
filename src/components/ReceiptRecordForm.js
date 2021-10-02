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
        notes: "",
        hsa_trans_id: "",
        receipt_images: []
    });

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleImageChange(e) {
        setFormData({ ...formData, receipt_images: Array.from(e.target.files) });
    }

    function handleSubmit(e) {
        e.preventDefault();
        // if (formData.qualified_exp === "Yes") {
        //     setFormData({ ...formData, qualified_exp: true })
        // } else if (formData.qualified_exp === "No") {
        //     setFormData({ ...formData, qualified_exp: false })
        // }

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
            <select name="qualified_exp" onChange={handleFormChange}>
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
            <input
                type="text"
                name="payment_method"
                onChange={handleFormChange}
                placeholder="Payment method"
                required={true}
            />
            <label htmlFor="reimbursed">Reimbursed?</label>
            <select name="reimbursed" onChange={handleFormChange}>
                <option>No</option>
                <option>Yes</option>
                <option>N/A</option>
            </select>
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