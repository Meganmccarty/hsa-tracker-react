import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiptActions } from '../../store/receiptSlice';

function ReceiptRecordEdit() {
    const id = parseInt(useParams().id);
    const history = useHistory();
    const dispatch = useDispatch();
    const receipt = useSelector(state => state.receipts.receipt);
    const [formData, setFormData] = useState(null);

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
                    <div key={image.url}>
                        <img src={image.url} alt="receipt" width="25%" />
                        <button onClick={(e) => handleDelete(e, image.id)}>Delete</button>
                    </div>
                )
            })
        }
    }

    function handleDelete(e, image) {
        e.target.parentElement.innerHTML = "";
        console.log(image)
        setFormData({ ...formData, receipt_images_to_delete: [...formData.receipt_images_to_delete, image] })
    }

    function handleFormChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "qualified_exp" && value === "No") {
            setFormData({ ...formData, [e.target.name]: e.target.value, reimbursed: "", reimbursed_date: null})
        } else if ((name === "reimbursed" && value === "No") || value === "N/A") {
            setFormData({ ...formData, [e.target.name]: e.target.value, reimbursed_date: null})
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
            body: finalForm
        };

        fetch(`/receipt-records/${id}`, configObj)
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
        <>
            {receipt && formData ?
                <>
                    <h1>Edit Receipt Record {receipt.id}</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="date"
                            name="trans_date"
                            aria-label="Transaction date"
                            onChange={handleFormChange}
                            value={formData.trans_date}
                            placeholder="Transaction date"
                            required={true}
                        />
                        <input
                            type="text"
                            name="category"
                            aria-label="category"
                            onChange={handleFormChange}
                            value={formData.category}
                            placeholder="Category"
                        />
                        <input
                            type="text"
                            name="provider"
                            aria-label="Provider"
                            onChange={handleFormChange}
                            value={formData.provider}
                            placeholder="Provider"
                            required={true}
                        />
                        <input
                            type="text"
                            name="description"
                            aria-label="Description"
                            onChange={handleFormChange}
                            value={formData.description}
                            placeholder="Description"
                        />
                        <label htmlFor="qualified_exp">Qualified Expense?</label>
                        <select
                            name="qualified_exp"
                            id="qualified_exp"
                            onChange={handleFormChange}
                            value={formData.qualified_exp}
                        >
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        <input
                            type="text"
                            name="amount"
                            aria-label="Amount"
                            onChange={handleFormChange}
                            value={parseFloat(formData.amount).toFixed(2)}
                            placeholder="Amount"
                            required={true}
                        />
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
                        {formData.qualified_exp === "Yes" ?
                            <>
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
                                    <option>N/A</option>
                                </select>
                                {formData.reimbursed === "Yes" ?
                                    <input
                                        type="date"
                                        name="reimbursed_date"
                                        aria-label="Reimbursed Date"
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
                            aria-label="Notes"
                            onChange={handleFormChange}
                            value={formData.notes}
                            placeholder="Notes"
                        />
                        <input
                            type="text"
                            name="hsa_trans_id"
                            aria-label="HSA transaction ID"
                            onChange={handleFormChange}
                            value={formData.hsa_trans_id}
                            placeholder="HSA transaction ID"
                        />
                        <input
                            type="file"
                            name="receipt_images"
                            aria-label="Upload images"
                            accept="image/*"
                            multiple={true}
                            onChange={handleImageChange}
                        />
                        <input type="submit" aria-label="Submit button" />
                        <button><Link to={`/receipt-records/${id}`}>Cancel</Link></button>
                    </form>
                    {displayReceiptImages()}
                </>
                : null
            }

        </>

    );
};

export default ReceiptRecordEdit;