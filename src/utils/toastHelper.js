import { toast, Bounce } from 'react-toastify'

export const defaultToastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
}

/**
 * Display toast
 *
 * @param {string} type
 * @param {React.ReactNode} content
 * @param {Object} [options={}]
 * @return {string|number} - The ID of the toast
 */
export const showToast = (type, content, options = {}) => {
    const optionsToApply = { ...defaultToastOptions, ...options }

    switch (type) {
        case 'success':
            return toast.success(content, optionsToApply)
        case 'error':
            return toast.error(content, optionsToApply)
        case 'info':
            return toast.info(content, optionsToApply)
        case 'warning':
            return toast.warn(content, optionsToApply)
        case 'default':
            return toast(content, optionsToApply)
        default:
            return toast(content, optionsToApply)
    }
}
