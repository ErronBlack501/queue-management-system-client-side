import { Nunito } from 'next/font/google'
import {SWRConfig} from 'swr'
import { NextUIProvider } from '@nextui-org/react'
import '@/app/global.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={`light ${nunitoFont.className}`}>
            <body className="antialiased">
                <NextUIProvider>{children}</NextUIProvider>
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
