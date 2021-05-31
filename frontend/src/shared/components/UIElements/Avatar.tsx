import React from 'react'
import './Avatar.css'

interface IAvatarInterface {
    image: string
    alt: string
    className?: string
    style?: any
    width?: any
    height?: any
}
export default function Avatar(props: IAvatarInterface) {
    return (
        <div className={`avatar ${props.className}`} style={props.style}>
            <img 
                src={props.image}
                alt={props.alt}
                style={{ width: props.width, height: props.height}}
            />
        </div>
    )
}
