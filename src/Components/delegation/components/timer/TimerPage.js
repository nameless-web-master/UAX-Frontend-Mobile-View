import React, { useEffect, useReducer, useState } from "react";
import { useSpring, animated } from 'react-spring'


// import custom css
import './TimerPage.css'
import './Background.css'

function cTReducer(state, action) {
    switch (action.type) {
        case 'set': {
            return ({ value: action.value })
        }
        default: {
            return state;
        }
    }
}
export default function TimerPage({ label, initialVal = 3, intervalInMs = 1000, minVal = 0, maxVal = 59 }) {

    const [value, setValue] = useState(initialVal)
    const [contentTop, dispatchCT] = useReducer(cTReducer, { value: initialVal })
    const [contentTopInner, setContentTopInner] = useState(initialVal)
    const [contentBottom, setContentBottom] = useState(initialVal)
    const [topScaleY, setTopScaleY] = useState(1)
    const [topBgColor, setTopBgColor] = useState('#C006DF')

    const [{ x, }, setX] = useSpring(() => ({
        onRest: () => {
            setContentBottom(prev => prev - 1);
            setX({ x: 0, config: { duration: 0 }, delay: 0 })

        },
        onStart: () => {
            ;
            setTopBgColor('#C006DF');

        },
        onFrame: ({ x }) => {
            let rotationDegrees = x
            if (rotationDegrees > 90) {
                setTopBgColor('rgb(52, 44, 78)')
                setTopScaleY(-1)
            }
            if (rotationDegrees === 0) {
                setTopBgColor('#C006DF');
                setTopScaleY(1)
            }
        },
        from:
            { x: 0 }
    }))

    useEffect(() => {
        const intervalId = setInterval(() => {
            setValue((p) => {
                if (p - 1 >= minVal)
                    return (p - 1)
                else {
                    return maxVal
                }
            })
        }, intervalInMs)

        return () => clearInterval(intervalId);

    }, [intervalInMs, maxVal, minVal])

    useEffect(() => {
        if (x.value) {
            if (x.value > 90 && x !== Infinity) {
                contentTop.value !== contentTopInner && dispatchCT({ type: 'set', value: contentTopInner })
            }
            if (x.value > 160) {
                setContentBottom((cb) => cb !== contentTopInner ? contentTopInner : cb)
            }
        }
    }, [x.value, contentTop, x, contentTop.value, contentTopInner])

    useEffect(() => {
        if (value > minVal) {
            setContentTopInner((v) => (v - 1))
            dispatchCT({ type: 'set', value: value })
            setContentBottom(value)
        } else {
            setContentTopInner(maxVal)
            dispatchCT({ type: 'set', value: maxVal })
            setContentBottom(maxVal)
        }
        setX({ x: 181, config: { duration: 400 }, delay: 0 })
        return () => { }
    }, [value, maxVal, minVal, setX])



    return (
        <div className="d-flex flex-column align-items-center">
            <div className="pageCard">
                <div  >
                    <animated.div className="pageTop" style={{
                        transform: x.interpolate(x => `rotateX(${x}deg)`),
                        WebkitTransform: x.interpolate(x => `rotateX(${x}deg)`),
                        backgroundColor: topBgColor,
                    }}>
                        <animated.div className="numberTop " style={{
                            transform: `translate(0%,50%)  scaleY(${topScaleY})`,
                        }}>
                            <div className="innerPageText">{contentTop.value}</div>
                        </animated.div>
                    </animated.div>
                    <div className="pageTopInner" >
                        <div className="numberTop ">
                            <div className="innerPageText">{contentTopInner}</div>
                        </div>
                    </div>
                </div>
                <div  >
                    <div className="pageBottom ">
                        <div className="numberBottom " >
                            <div className="innerPageText">{contentBottom}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="timerPageLabel">{label}</div>
        </div>
    )
}