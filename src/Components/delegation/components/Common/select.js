import React from 'react';

const datas = [
    {
        value: '1d',
        label: '1 day'
    },
    {
        value: '7d',
        label: '7 days'
    },
    {
        value: '15d',
        label: '15 days'
    },
    {
        value: '1m',
        label: '1 month'
    },
    {
        value: '3m',
        label: '3 months'
    },
    {
        value: '6m',
        label: '6 months'
    },
    {
        value: '1y',
        label: '1 year'
    },
]

export const Select = ({ value, setValue, placeholder }) => {
    return (
        <div
            style={{
                border: '1px solid #FFFFFF0A',
                backgroundImage: 'linear-gradient(#2C2430, #2218260F)',
                borderRadius: 6,
                padding: '15px 16px',

            }}
        >
            <select
                className='w-100'
                placeholder={placeholder}
                style={{
                    backgroundColor: 'transparent',
                    color: '#ffff',
                    border: 0
                }}
            >
                {
                    datas.map((_itm, _idx) => (
                        <option
                            key={_idx}
                            value={_itm.value}
                            style={{
                                backgroundColor: '#2C2430',
                            }}
                        >{_itm.label}</option>
                    ))
                }
            </select>
        </div>
    )
} 