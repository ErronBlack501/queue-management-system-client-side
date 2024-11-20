'use client'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import AdminDashboard from '@/components/AdminDashboard'
const Dashboard = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Dashboard" />
            {user?.role === 'employee' ? (
                <EmployeeDashboard />
            ) : (
                <AdminDashboard />
            )}
        </>
    )
}

export default Dashboard
