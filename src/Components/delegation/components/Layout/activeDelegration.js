import React from 'react';

import { Modal } from '../Common/modal';

import { datas } from '../datas';

export const ActiveDelegration = ({ detail, setState, setDetail }) => {

    return (
        <Modal
            header={'Active Delegation'}
            setState={setState}
            setDetail={setDetail}
        >
            <div
                className='d-flex flex-column'
                style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #FFFFFF14'
                }}
            >
                <div
                    style={{
                        color: '#FFFFFFB8',
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: '30px'
                    }}
                >
                    <div
                        className='d-flex align-items-center justify-content-between'
                        style={{
                            margin: '11px 0'
                        }}
                    >
                        <div>To Address:</div>
                        <div className='text-white'>{datas[detail].address}</div>
                    </div>
                    <div
                        className='d-flex align-items-center justify-content-between'
                        style={{
                            margin: '11px 0'
                        }}
                    >
                        <div>Bandwidth:</div>
                        <div className='text-white'>{datas[detail].bandwidth}</div>
                    </div>
                </div>
            </div>
            <div
                className='d-flex flex-column align-items-center'
                style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #FFFFFF14'
                }}
            >
                <h3
                    className='m-0'
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: '#fff'
                    }}
                >
                    Time Remaining:
                </h3>
                <div
                    className='w-100'
                    style={{
                        height: 128,
                        border: '1px solid #C006DE',
                        margin: '12px 0 22px',
                        boxShadow: '0 4px 4px 2px #C006DE',
                        borderRadius: 6
                    }}
                ></div>
                <div
                    style={{
                        fontWeight: 400,
                        fontSize: 13,
                        textAlign: 'center',
                        color: '#C1C1C1',
                        marginBottom: 32
                    }}
                >
                    Info: If not completed by deadline, bandwidth will automatically revert.
                </div>
            </div>
        </Modal>
    )
}