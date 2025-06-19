import React from 'react';

import { Box } from '../Common/box';
import { Label } from '../Common/label';
import { Select } from '../Common/select';
import { Input } from '../Common/input';
import { Button } from '../Common/button';

export const DelegateBandwidth = ({ form, setForm, setDetail, setState }) => {
    const handleForm = (key, value) => setForm(prev => ({
        ...prev, [key]: value
    }));

    return (
        <div
            className='h-100'
        >
            <Box
                minHead="Enter the recipient' s address and bandwidth for transfer"
                head='Delegate Bandwidth'
            >
                <div style={{ padding: '0px 6px' }}>
                    <div style={{
                        marginBottom: 24
                    }}>
                        <Label content={'Enter Bandwidth'} />
                        <Input
                            placeholder={'Enter bandwidth'}
                            value={form.bandwidth}
                            setValue={e => handleForm('bandwidth', e.target.value)}
                            back={<button
                                type="button"
                                className="text-white text-sm primary_btnn___"
                                style={{
                                    borderRadius: 4,
                                    fontWeight: 500,
                                    fontSize: 12,
                                    lineHeight: '26px',
                                    padding: '0 8px',
                                    letterSpacing: 1
                                }}
                            >
                                MAX
                            </button>}
                        />
                        <div className='d-flex align-items-center gap-1'>
                            <h6
                                style={{
                                    fontWeight: 300,
                                    fontSize: 15,
                                    lineHeight: '36px',
                                    color: '#FFFFFFB2',
                                    margin: 0,
                                    textAlign: 'center'
                                }}
                            >Available Bandwidth:</h6>
                            <span style={{
                                fontSize: 14,
                                color: '#C006DE',
                                lineHeight: '36px',
                                fontWeight: 400
                            }}>212 Bandwidth</span>
                            <i className="fa fa-question-circle"></i>
                        </div>
                    </div>
                    <div style={{
                        marginBottom: 24
                    }}>
                        <Label content={'Receiving Address'} />
                        <Input
                            placeholder={'Enter the receiving address'}
                            value={form.address}
                            setValue={e => handleForm('address', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label content={'Select Duration'} />
                        <Select
                            value={form.duration}
                            setValue={e => (handleForm('duration', e.target.value))}
                            placeholder={'Select duration:1,2,3,5 days....'}
                        />
                    </div>
                    <div style={{
                        marginTop: 12,
                        marginBottom: 24
                    }}>
                        <h6
                            style={{
                                fontWeight: 300,
                                fontSize: 13,
                                color: '#FFFFFFB2',
                            }}
                        ><span className='text-white'>Note:</span> If delegation is not completed with in the duration, the bandwidth will revert back. You can cancel after the duration ends.</h6>
                    </div>
                    <div style={{ margin: '6px 0' }}>
                        <Button action={() => {
                            setState('confirm');
                            setDetail(null);
                        }} content={'Continue'} />
                    </div>
                </div>
            </Box>
        </div >
    )
}