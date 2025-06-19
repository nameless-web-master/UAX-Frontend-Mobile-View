import React from 'react';

import { Box } from '../Common/box';
import { Tag } from '../Common/tag';

import { datas } from '../datas';

export const TransferHistory = ({ setState, setDetail }) => {

    return (
        <div
            className='h-100'
        >
            <Box
                head="Transfer History"
            >
                <div
                    style={{
                        maxHeight: 500,
                        overflow: 'auto'
                    }}
                >
                    <div>
                        {
                            datas.map((_itm, _idx) => (
                                <div
                                    className='d-flex'
                                    key={_idx}
                                    style={{
                                        borderBottom: '1px solid #FFFFFF0D',
                                        paddingBottom: 9,
                                        marginBottom: 12,
                                        gap: 9,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setDetail(_idx);
                                        if (_itm.state === -1) {
                                            setState('expired');
                                        }
                                        else if (_itm.state === 0) {
                                            setState('active');
                                        }
                                        else if (_itm.state === 1) {
                                            setState('completed');
                                        }
                                    }}
                                >
                                    <div>
                                        <img src={_itm.icon} alt='No Icon' />
                                    </div>
                                    <div
                                        className='flex-fill d-flex flex-column'
                                        style={{
                                            gap: 6
                                        }}
                                    >
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div style={{
                                                fontSize: 15,
                                                fontWeight: 500,
                                                lineHeight: '22px',
                                                color: '#fff'
                                            }}>Completed <span style={{
                                                color: '#909090'
                                            }}>(Transfer):</span> <span style={{
                                                color: '#D909FB'
                                            }}>212</span></div>
                                            <div style={{
                                                color: '#A8A8A8',
                                                fontWeight: 400,
                                                fontSize: 14,
                                                lineHeight: '22px'
                                            }}>{_itm.timestamp}</div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div
                                                style={{
                                                    color: '#A8A8A8',
                                                    fontWeight: 400,
                                                    fontSize: 14,
                                                    lineHeight: '22px'
                                                }}
                                            >
                                                <span style={{ color: "#24BF67" }}>TxId: </span>
                                                {_itm.txid}
                                            </div>
                                            {Tag(_itm.state)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Box>
        </div >
    )
}