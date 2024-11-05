'use client'

import 'react-toastify/dist/ReactToastify.css'
import '../app/global.css'
import { ToastContainer } from 'react-toastify'

export default function ToastProvider({ children }) {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    )
}
