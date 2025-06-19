import React from 'react';

import { Modal } from '../Common/modal';
import { Button } from '../Common/button';
import { datas } from '../datas';

export const CompletedDelegration = ({ detail, setState, setDetail }) => {
    return (
        <Modal
            header={'Confirm Delegation'}
            setState={setState}
            setDetail={setDetail}
        >
            <div
                className='d-flex flex-column'
                style={{
                    padding: '16px 24px'
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
                <div
                    style={{
                        margin: '26px 0'
                    }}
                >
                    <Button
                        action={() => { }}
                        content={'Delegate Now'}
                    />
                </div>
            </div>
        </Modal>
    )
}