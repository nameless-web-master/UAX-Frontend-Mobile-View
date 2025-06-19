import React from "react";

import { Modal } from '../Common/modal';
import { Tag } from "../Common/tag";
import { Button } from "../Common/button";

import { datas } from '../datas';

export const ExpiredDelegration = ({ detail, setState, setDetail }) => {
    return (
        <Modal
            header={'Expired Delegation'}
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
                        <div>Status:</div>
                        {Tag(datas[detail].state)}
                    </div>
                    <div
                        className='d-flex align-items-center justify-content-between'
                        style={{
                            margin: '11px 0'
                        }}
                    >
                        <div>Timestamp:</div>
                        <div className='text-white'>{datas[detail].timestamp}</div>
                    </div>
                </div>
                <div
                    style={{
                        padding: '6px 16px',
                        fontWeight: 400,
                        fontSize: 12,
                        color: '#FFFFFFCC',
                        backgroundColor: '#D9D9D90F',
                        border: '1px solid #FFFFFF0F',
                        borderRadius: 4
                    }}
                >
                    Bandwidth has been reverted to your account. If not, cancel the delegation
                </div>
                <div
                    style={{
                        margin: '26px 0'
                    }}
                >
                    <Button
                        action={() => {
                            setState('');
                            setDetail(null);
                        }}
                        content={'Cancel Delegation'}
                    />
                </div>
            </div>
        </Modal>
    )
}