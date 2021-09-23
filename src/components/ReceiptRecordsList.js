import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveReceipts } from '../store/receiptsSlice';

function ReceiptRecordsList() {
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.receipts.receipts);
    
    useEffect(() => {
        dispatch(retrieveReceipts());
    }, [dispatch]);

    console.log(receipts);

    return <h1>Receipt Records List</h1>
};

export default ReceiptRecordsList;