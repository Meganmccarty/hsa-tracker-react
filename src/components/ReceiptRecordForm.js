import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { receiptsActions } from '../store/receiptsSlice';

import CSRFToken from './cookies';

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
        hsa_trans_id: ""
    });

    console.log(formData.qualified_exp);

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.qualified_exp === "Yes") {
            setFormData({ ...formData, qualified_exp: true })
        } else if (formData.qualified_exp === "No") {
            setFormData({ ...formData, qualified_exp: false })
        }
        fetch("/receipt-records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": CSRFToken(document.cookie)
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            dispatch(receiptsActions.createReceipt(data))
        })
        history.push("/receipt-records")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="date" name="trans_date" onChange={handleFormChange} placeholder="Transaction date" />
            <input type="text" name="category" onChange={handleFormChange} placeholder="Category" />
            <input type="text" name="provider" onChange={handleFormChange} placeholder="Provider" />
            <input type="text" name="description" onChange={handleFormChange} placeholder="Description" />
            <label htmlFor="qualified_exp">Qualified Expense?</label>
            <select name="qualified_exp" onChange={handleFormChange}>
                <option>--</option>
                <option>Yes</option>
                <option>No</option>
            </select>
            <input type="text" name="amount" onChange={handleFormChange} placeholder="Amount" />
            <input type="text" name="payment_method" onChange={handleFormChange} placeholder="Payment Method" />
            <label htmlFor="reimbursed">Reimbursed?</label>
            <select name="reimbursed" onChange={handleFormChange}>
                <option>--</option>
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
            </select>
            <input type="text" name="notes" onChange={handleFormChange} placeholder="Notes" />
            <input type="text" name="hsa_trans_id" onChange={handleFormChange} placeholder="HSA transaction ID" />
            <input type="submit" />
        </form>
    );
};

export default ReceiptRecordForm;