import React from 'react';

export const Box = ({ children, head, minHead = false }) => {
    return (
        <div
            className='h-100 d-flex flex-column box-template'
            style={{
                backgroundColor: '#1E1D1F',
                border: '1px solid #3333334D',
                borderRadius: 12,
            }}
        >
            <div>
                <h5
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: (minHead ? 11 : 33),
                        textAlign: 'center'
                    }}
                >{head}</h5>
                <h6
                    style={{
                        fontWeight: 300,
                        fontSize: 15,
                        color: '#FFFFFFB2',
                        marginBottom: 46,
                        textAlign: 'center'
                    }}
                >{minHead}</h6>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}