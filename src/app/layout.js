import { Nunito } from 'next/font/google'
import { NextUIProvider } from '@nextui-org/react'
import '@/app/global.css'
import ToastProvider from '@/components/ToastProvider'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={`light ${nunitoFont.className}`}>
            <body className="antialiased">
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
