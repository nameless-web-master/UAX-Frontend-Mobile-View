import React, { useState } from "react";

import './ResponsiveSvgButton.css'
export default function ResponsiveSvgButton({ component: Component, color, className }) {

    const [c, setC] = useState(undefined)

    const onMouseOver = () => {
        setC(color)
    }
    const onMouseOut = () => {
        setC(undefined)
    }
    return (
        <a className={`${className} rButton`} >
            <Component onMouseOut={onMouseOut} onMouseOver={onMouseOver} fill={c} />
        </a>
    )
}