import ResponsiveNavLink from './ResponsiveNavLink'
import { usePathname } from 'next/navigation'
const ResponsiveAdminNavigation = () => {
    return (
        <>
            <ResponsiveNavLink
                href="/dashboard"
                active={usePathname() === '/dashboard'}>
                Dashboard
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href="/dashboard/users"
                active={usePathname() === '/employees'}>
                Users
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href="/dashboard/services"
                active={usePathname() === '/services'}>
                Services
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href="/dashboard/counters"
                active={usePathname() === '/counters'}>
                Counters
            </ResponsiveNavLink>
        </>
    )
}
export default ResponsiveAdminNavigation
