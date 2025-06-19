import React from 'react';

export const Modal = ({ children, header, setState, setDetail }) => {
    return (
        <div
            className='position-fixed w-100 p-4 d-flex justify-content-center'
            style={{
                height: '100vh',
                backgroundColor: '#FFFFFFBA',
                left: 0,
                top: 0,
                zIndex: 1500,
            }}
        >
            <div
                className='w-100'
                style={{
                    backgroundColor: '#1E1D1F',
                    border: '1px solid #3333334D',
                    borderRadius: 20,
                    height: 'max-content',
                    maxWidth: 432,
                    transform: 'translate(0, 30%)'
                }}
            >
                <div
                    className='d-flex justify-content-center align-items-center'
                    style={{
                        padding: '42px 0 24px 0',
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
                        {header}
                    </h3>
                    <span
                        className='position-absolute'
                        style={{
                            fontSize: 22,
                            color: '#fff',
                            right: 22,
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setState('');
                            setDetail(null);
                        }}
                    >×</span>
                </div>
                {children}
            </div>
        </div>
    )
}