import { Montserrat } from 'next/font/google'
import { NextUIProvider } from '@nextui-org/react'
import '@/app/global.css'
import ToastProvider from '@/components/ToastProvider'

const montSerratFont = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={`light ${montSerratFont.className}`}>
            <body className="antialiased bg-gray-100">
                <ToastProvider>
                    <NextUIProvider>{children}</NextUIProvider>
                </ToastProvider>
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
