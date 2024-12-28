'use client'

import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveAdminNavigation from '@/components/ResponsiveAdminNavigation'
import ResponsiveEmployeeNavigation from '@/components/ResponsiveEmployeeNavigation'
import { Avatar, Badge } from '@nextui-org/react'
import NotificationIcon from '@/components/NotificationIcon'
import { showToast } from '@/utils/toastHelper'
import { useEcho } from '@/hooks/echo'

const Navigation = ({ user }) => {
    const { logout } = useAuth()
    const echo = useEcho()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (echo) {
            if (user.role === 'employee') {
                const channel = echo?.join(`service.${user.counter.service_id}`)
                channel
                    .joining(user => {
                        showToast('info', `${user.name} is joining...`)
                    })
            }
        }
    }, [echo])

    return (
        <nav className="sticky top-0 z-10 bg-white bg-opacity-30 backdrop-blur-lg border-b border-gray-100">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <ApplicationLogo className="block" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={usePathname() === '/dashboard'}>
                                Dashboard
                            </NavLink>
                            {user?.role === 'admin' ? (
                                <>
                                    <NavLink
                                        href="/dashboard/employees"
                                        active={
                                            usePathname() ===
                                            '/dashboard/employees'
                                        }>
                                        Employees
                                    </NavLink>
                                    <NavLink
                                        href="/dashboard/services"
                                        active={
                                            usePathname() ===
                                            '/dashboard/services'
                                        }>
                                        Services
                                    </NavLink>
                                    <NavLink
                                        href="/dashboard/counters"
                                        active={
                                            usePathname() ===
                                            '/dashboard/counters'
                                        }>
                                        Counters
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        href="/dashboard/pending-tickets"
                                        active={
                                            usePathname() ===
                                            '/dashboard/pending-tickets'
                                        }>
                                        Pending Tickets
                                    </NavLink>
                                    <NavLink
                                        href="/dashboard/ticketHistories"
                                        active={
                                            usePathname() ===
                                            '/dashboard/ticketHistories'
                                        }>
                                        Ticket-Histories
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <NotificationIcon classname="mr-5" />
                        <div className="flex flex-col justify-center items-start text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                            <div className="text-gray-950">{user?.name}</div>
                            <div>{user?.role}</div>
                        </div>
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center">
                                    <div className="mx-2">
                                        <Badge
                                            content=""
                                            color="success"
                                            shape="circle"
                                            placement="bottom-right">
                                            <Avatar
                                                className="ml-2"
                                                isBordered
                                                name={user?.name}
                                            />
                                        </Badge>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton
                                onClick={() =>
                                    router.push('/dashboard/profile')
                                }>
                                Profile
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {user?.role === 'admin' ? (
                            <ResponsiveAdminNavigation />
                        ) : (
                            <ResponsiveEmployeeNavigation />
                        )}
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user?.email + ` role: ${user?.role}`}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
