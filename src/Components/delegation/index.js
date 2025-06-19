import React, { useState } from 'react';

import { DelegateBandwidth } from './components/Layout/bandwidth';
import { TransferHistory } from './components/Layout/transfer';
import { ConfirmDelegration } from './components/Layout/confirmDelegration';
import { ActiveDelegration } from './components/Layout/activeDelegration';
import { ExpiredDelegration } from './components/Layout/expiredDelegration';
import { CompletedDelegration } from './components/Layout/completedDelegration';

export const Delegation = () => {
    const [form, setForm] = useState({
        bandwidth: '',
        address: '',
        duration: ''
    });
    const [detail, setDetail] = useState(5);

    const [state, setState] = useState('')

    return (
        <div
            className='row flex delegrate'
        >
            <DelegateBandwidth form={form} setForm={setForm} setDetail={setDetail} setState={setState} />
            <TransferHistory setDetail={setDetail} setState={setState} />
            {state === 'confirm' &&
                <ConfirmDelegration form={form} setState={setState} setDetail={setDetail} />}
            {(state === 'active' && detail) &&
                <ActiveDelegration detail={detail} setState={setState} setDetail={setDetail} />}
            {(state === 'expired' && detail) &&
                <ExpiredDelegration detail={detail} setState={setState} setDetail={setDetail} />}
            {(state === 'completed' && detail) &&
                <CompletedDelegration detail={detail} setState={setState} setDetail={setDetail} />}
        </div>
    )
};