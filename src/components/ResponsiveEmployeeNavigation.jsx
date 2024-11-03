import ResponsiveNavLink from './ResponsiveNavLink'
import { usePathname } from 'next/navigation'

const ResponsiveEmployeeNavigation = () => {
    return (
        <>
            <ResponsiveNavLink
                href="/dashboard/tickets"
                active={usePathname() === '/dashboard/tickets'}>
                Tickets
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href="/dashboard/ticketHistories"
                active={usePathname() === '/dashboard/ticketHistories'}>
                Ticket-Histories
            </ResponsiveNavLink>
        </>
    )
}

export default ResponsiveEmployeeNavigation
