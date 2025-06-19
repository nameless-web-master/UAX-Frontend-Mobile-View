import React from "react";

const datas = [
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 1
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 0
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 1
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 0
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 1
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 0
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 1
    },
    {
        coin: 'ERC',
        date: '26 March 2024',
        amount: 10,
        status: 0
    },
]

export const AllTxs = () => {
    return (
        <div
            className="dashboard_box_001____ px-4"
            style={{
                backgroundColor: "#222024",
                height: "100%",
                padding: '45px 64px 54px'
            }}
        >
            <div className="overflow-auto">
                <table
                    className="w-100"
                    style={{
                        minWidth: 600
                    }}
                >
                    <thead>
                        <tr style={{
                            backgroundColor: '#312C33'
                        }}>
                            <th
                                style={{
                                    padding: '6px 36px'
                                }}
                            >Coin</th>
                            <th
                                style={{
                                    padding: '6px 36px'
                                }}
                            >Date</th>
                            <th
                                style={{
                                    padding: '6px 36px'
                                }}
                            >Amount</th>
                            <th
                                style={{
                                    padding: '6px 36px'
                                }}
                            >Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((_itm, _idx) => (
                            <tr key={_idx}
                                style={{
                                    borderBottom: '1px solid #32323280',
                                }}
                            >
                                <td
                                    style={{
                                        padding: '32px 36px 14px'
                                    }}
                                >{_itm.coin}</td>
                                <td
                                    style={{
                                        padding: '32px 36px 14px',
                                        color: '#D10CF0'
                                    }}
                                >{_itm.date}</td>
                                <td
                                    style={{
                                        padding: '32px 36px 14px',
                                        color: '#30BF24'
                                    }}
                                >{`${_itm.amount} UAX`}</td>
                                <td
                                    style={{
                                        padding: '32px 36px 14px'
                                    }}
                                >{_itm.status ? 'Sent' : 'Receive'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}