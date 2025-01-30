import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import ApplicationLogo from '@/components/ApplicationLogo'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const ClientNavigation = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const pathname = usePathname()

    return (
        <>
            <Navbar isBlurred={false} className='bg-white'>
                <NavbarBrand>
                    <ApplicationLogo />
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {[
                        { name: 'Home', href: '/client' },
                        { name: 'Distributor', href: '/client/distributor' },
                        { name: 'Waiting list', href: '/client/waiting-list' },
                    ].map(({ name, href }) => (
                        <NavbarItem key={href}>
                            <Link href={href}>
                                <span
                                    className={clsx(
                                        'font-bold hover:text-gray-500 transition-colors',
                                        pathname === href ? 'text-yellow-400' : 'text-gray-300'
                                    )}>
                                    {name}
                                </span>
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify="end">
                    {user ? (
                        <Button
                            as={Link}
                            className="bg-yellow-500"
                            href="/dashboard"
                            variant="flat">
                            <span className="text-white font-bold hover:text-yellow-400">Dashboard</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                                />
                            </svg>
                        </Button>
                    ) : (
                        <Button
                            as={Link}
                            className="bg-yellow-500"
                            href="/login"
                            variant="flat">
                            <span className="text-white font-bold">Login</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                className="size-6 stroke-white">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                                />
                            </svg>
                        </Button>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    )
}

export default ClientNavigation
