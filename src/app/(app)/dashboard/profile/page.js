'use client'

import { useAuth } from '@/hooks/auth'

const ProfilePage = () => {
    const { user } = useAuth()
    return (
        <>
            <div>{user?.name}</div>
            <div>{user?.email}</div>
            <div>{user?.role}</div>
            <div>{user?.counter.id}</div>
        </>
    )
}

export default ProfilePage
