import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createReceipt } from '../store/receiptsSlice';

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
        dispatch(createReceipt(formData))
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