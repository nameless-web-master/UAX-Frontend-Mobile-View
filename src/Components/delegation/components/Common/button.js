import React from 'react';

export const Button = ({ content, action }) => {
    return (
        <button
            onClick={action}
            className='w-100 d-flex justify-content-center'
            style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '36px',
                color: '#fff',
                padding: '4px 0',
                backgroundColor: '#DF16FF',
                borderRadius: 6,
                border: '1px solid #C006DE',
                letterSpacing: 1
            }}
        >
            {content}
        </button>
    )
}