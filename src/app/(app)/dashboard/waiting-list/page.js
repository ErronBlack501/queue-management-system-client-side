'use client'

import useSWR from 'swr'
import { axios } from '@/lib/axios'
import { Card, Spacer, CardHeader, CardBody } from '@nextui-org/react'
import { useEffect } from 'react'
import { showToast } from '@/utils/toastHelper'
import { useEcho } from '@/hooks/echo'
import Header from '@/app/(app)/Header'

const WaitingList = () => {
    const echo = useEcho()
    const {
        data,
        mutate,
        error,
        isLoading,
    } = useSWR('/api/v1/queue', async () => {
        try {
            const res = await axios.get('/api/v1/queue')
            return res.data
        } catch (error) {
            if (error.response?.status !== 409) throw error
        }
    })

    useEffect(() => {
        if (echo) {
            echo.private('notifications').listen('TicketCreatedEvent', () => {
                showToast('success', 'A new ticket has been created.')
                mutate()
            })
        }
    }, [echo])

    if (isLoading)
        return <div className="text-center text-gray-500">Loading...</div>

    if (error)
        return (
            <div className="text-center text-red-500">
                An error occurred: {error.message}
            </div>
        )

    return (
        <>
            <Header title="Waiting List" />
            <div className="p-6">
                <Spacer y={1} />

                {/* Now Serving Ticket */}
                {data.nowServingTicket ? (
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            Now Serving
                        </h2>
                        <Card variant="bordered" className="inline-block shadow-md w-80 mx-auto">
                            <CardHeader>
                                <h4 className="text-blue-500">
                                    Ticket #{data.nowServingTicket.ticket_number}
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <p>
                                    <strong>Service Name:</strong>
                                    {` ${data.nowServingTicket.service_name}`}
                                </p>
                                <p>
                                    <strong>Counter Number:</strong>
                                    {` ${data.nowServingTicket.counter_number}`}
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mb-10">
                        No ticket is currently being served.
                    </div>
                )}

                {/* Waiting List */}
                {data.tickets && data.tickets.length > 0 ? (
                    <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Tickets in Waiting List
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.tickets.map(ticket => (
                                <Card
                                    key={ticket.id}
                                    variant="bordered"
                                    className="shadow-md">
                                    <CardHeader>
                                        <h4 className="text-blue-500">
                                            Ticket #{ticket.ticket_number}
                                        </h4>
                                    </CardHeader>
                                    <CardBody>
                                        <p>
                                            <strong>Service Name:</strong>
                                            {` ${ticket.service_name}`}
                                        </p>
                                        <p>
                                            <strong>Counter Number:</strong>
                                            {` ${ticket.counter_number}`}
                                        </p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        No tickets in the waiting list.
                    </div>
                )}
            </div>
        </>
    )
}

export default WaitingList
