import React from "react";

import UserAvatar from '../media/avatar.png';

const flexBetween = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}

export const UserInfor = () => {
    return (
        <div
            className="w-100 px-2 small_view small_view_flex"
            style={{
                ...flexBetween,
                marginTop: 16,
                marginBottom: 26,
            }}
        >
            <div style={{ ...flexBetween }}>
                <img src={UserAvatar} alt="Profile" style={{ marginRight: 14 }} />
                <div
                    className="flex-column"
                    style={{
                        display: 'flex',
                        flexDirection: 'row !important',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    }}
                >
                    <span
                        style={{
                            color: '#DF16FF',
                            fontSize: 14,
                        }}
                    >
                        Wallet Address
                    </span>
                    <span
                        style={{
                            color: '#A0A0A0',
                            fontSize: 12,
                            fontWeight: 300,
                        }}
                    >
                        buuTb13Zxp95..E9vz0
                    </span>
                </div>
            </div>
            <div
                style={{
                    backgroundColor: '#3F2146',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <i
                    className={"fa fa-bell-o"}
                    aria-hidden="true"
                    style={{
                        fontSize: 12,
                    }}
                >
                </i>
            </div>
        </div>
    )
};