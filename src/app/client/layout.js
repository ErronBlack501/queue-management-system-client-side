'use client'
import ClientNavigation from '@/app/client/ClientNavigation'

const ClientLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <ClientNavigation />
            <main>{children}</main>
        </div>
    )
}

export default ClientLayout
