'use client'
import Link from 'next/link'
import ParticlesBackground from '@/components/ParticlesBackground'

export default function HomePage() {
    return (
        <>
            <ParticlesBackground />
            <header
                style={{ background: '#00A651' }}
                className="relative z-10 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h2 className="font-extrabold text-xl text-white leading-tight">
                        Home Page
                    </h2>
                </div>
            </header>
            <div className="relative flex items-top justify-center min-h-screen sm:items-center sm:pt-0">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-4xl font-bold text-white">
                            WELCOME TO THE{' '}
                            <span className="text-yellow-400">
                                QUEUE MANAGEMENT SYSTEM
                            </span>
                        </h1>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sections.map(
                            (
                                { href, title, description, icon, color },
                                index,
                            ) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <div className="flex items-center">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            className={`w-8 h-8 ${color}`}>
                                            <path d={icon} />
                                        </svg>
                                        <div className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            <Link
                                                href={href}
                                                className="underline">
                                                {title}
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                                        {description}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="flex justify-center mt-12 text-white text-sm">
                        <p>
                            © 2025 SMMC - All rights reserved. Powered by
                            Laravel and Next.js.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

const sections = [
    {
        href: '/tickets',
        title: 'Manage Tickets',
        description:
            'Monitor and manage tickets in real time. Create, edit, and track the status of requests.',
        icon: 'M3 10h18M9 21v-8m6 8v-8',
        color: 'text-blue-500',
    },
    {
        href: '/guichets',
        title: 'Manage Counters',
        description: 'Configure and monitor counters to ensure a smooth flow.',
        icon: 'M13 16h-1v-4h-1m1 0h4v4h1v4h-1m-4 0h4m-6-8V8h6V6H9v2m0 2h1',
        color: 'text-green-500',
    },
    {
        href: '/historique',
        title: 'Ticket History',
        description:
            'Review the complete history of tickets and analyze the data.',
        icon: 'M12 8v8m0-8h-4m4 0h4',
        color: 'text-yellow-500',
    },
    {
        href: '/admin',
        title: 'Admin Interface',
        description:
            'Oversee the entire system and configure advanced settings.',
        icon: 'M12 4v16m8-8H4',
        color: 'text-red-500',
    },
]
