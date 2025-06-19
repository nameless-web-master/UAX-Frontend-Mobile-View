import React from 'react';

export const Input = ({ value, setValue, placeholder, back = false }) => {
    return (
        <div
            className='d-flex align-items-center justify-content-between'
            style={{
                border: '1px solid #FFFFFF0A',
                backgroundImage: 'linear-gradient(#2C2430, #2218260F)',
                borderRadius: 6,
                padding: (back ? '9px 10px 9px 16px' : '15px 16px')
            }}
        >
            <input
                value={value}
                onChange={setValue}
                placeholder={placeholder}
                style={{
                    outline: 'none',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 400,
                    backgroundColor: 'transparent',
                    color: '#fff',
                    flex: 1
                }}
            />
            {back ? back : <></>}
        </div>
    )
};