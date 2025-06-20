import React from 'react';

import { Modal } from '../Common/modal';
import TimerPage from '../timer/TimerPage';

import { datas } from '../datas';

const dayInMilliseconds = 1000 * 60 * 60 * 24;
const hourInMilliseconds = 1000 * 60 * 60;
const minuteInMilliseconds = 1000 * 60;
const secondInMilliseconds = 1000;

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
                    className='w-100 d-flex'
                    style={{
                        height: 128,
                        border: '1px solid #C006DE',
                        margin: '12px 0 22px',
                        boxShadow: '0 4px 4px 2px #C006DE',
                        borderRadius: 6,
                        padding: '0 32px'
                    }}
                >
                    <div className="w-25 d-flex align-items-center justify-content-center" >
                        <TimerPage intervalInMs={dayInMilliseconds} initialVal={2} label={'Days'} />
                        <span
                            className='position-absolute d-flex align-items-center'
                            style={{
                                top: 22,
                                right: 0,
                                fontSize: 32
                            }}
                        >:</span>
                    </div>
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <TimerPage intervalInMs={hourInMilliseconds} initialVal={0} maxVal={23} label={'Hours'} />
                        <span
                            className='position-absolute d-flex align-items-center'
                            style={{
                                top: 22,
                                right: 0,
                                fontSize: 32
                            }}
                        >:</span>
                    </div>
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <TimerPage intervalInMs={minuteInMilliseconds} initialVal={0} label={'Minutes'} />
                        <span
                            className='position-absolute d-flex align-items-center'
                            style={{
                                top: 22,
                                right: 0,
                                fontSize: 32
                            }}
                        >:</span>
                    </div>
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <TimerPage intervalInMs={secondInMilliseconds} initialVal={0} label={'Seconds'} />
                    </div>
                </div>
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