import React from 'react';

export const Label = ({ content }) => {
    return (
        <label style={{
            fontWeight: 500,
            fontSize: 15,
            lineHeight: '36px',
            color: '#fff'
        }}>{content}</label>
    )
}