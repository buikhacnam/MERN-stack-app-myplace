import React from 'react'
import UserList from '../components/UserList'

export default function User() {
    const USERS = [
        {
            id: 'u1',
            name: 'Nam',
            image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
            places: 3
        }
    ]
    return (
        <UserList items={USERS}/>
    )
}
