import React from "react";
import { Container } from "react-bootstrap";
import { ReactComponent as BackgroundStars } from '../images/bg-stars.svg';
import { ReactComponent as BackgroundHills } from '../images/pattern-hills.svg';
import './Background.css'
export default function Background() {
    return (
        <Container xs={12} fluid className="container" >
            <BackgroundStars className="bg" />
            <BackgroundHills className="hills" />
        </Container >
    )
}