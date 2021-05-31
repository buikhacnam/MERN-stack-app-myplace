import React from 'react'
import './Card.css'

interface ICardInterface {
    className: string
    children: React.ReactNode
    style?: any
}
export default function Card(props: ICardInterface) {
    return (
        <div className={`card ${props.className}`} style={props.style}>
            {props.children}
        </div>
    )
}
