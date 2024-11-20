// /hooks/useEcho.js
import { useEffect, useState } from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { axios } from '@/lib/axios'

window.Pusher = Pusher

export const useEcho = () => {
    const [echo, setEcho] = useState(null)

    useEffect(() => {
        // Creating the echo instance
        const echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            authorizer: channel => {
                return {
                    authorize: (socketId, callback) => {
                        axios
                            .post('/api/broadcasting/auth', {
                                socket_id: socketId,
                                channel_name: channel.name,
                            })
                            .then(response => {
                                callback(false, response.data)
                            })
                            .catch(error => {
                                callback(true, error)
                            })
                    },
                }
            },
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndPoint: process.env.NEXT_PUBLIC_BACKEND_URL + 'api/broadcasting/auth',
        })

        setEcho(echoInstance)

        // Clean up
        return () => {
            echoInstance.disconnect()
        }
    }, [])

    return echo
}
