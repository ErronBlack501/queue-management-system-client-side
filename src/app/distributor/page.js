'use client'

import Header from '@/app/(app)/Header'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Spinner,
} from '@nextui-org/react'
import ReactPDF from '@react-pdf/renderer'
import useSWR from 'swr'
import { axios } from '@/lib/axios'
import { showToast } from '@/utils/toastHelper'
import { useState } from 'react'
import TicketPdf from '@/components/TicketPdf'

const Distributor = () => {
    const [selectedService, setSelectedService] = useState(null)
    const [errors, setErrors] = useState(null)
    const {
        data: services,
        error,
        isLoading,
    } = useSWR('/api/v1/services', () =>
        axios
            .get('/api/v1/services')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const createTicket = async event => {
        event.preventDefault()

        await csrf()

        setErrors([])

        const data = {
            service_id: parseInt(selectedService.id),
        }

        axios
            .post('/api/v1/tickets', data)
            .then(async response => {
                const { newTicket, ticketsBefore } = response.data
                showToast(
                    'success',
                    'The ticket has been created successfully.',
                )
                setSelectedService(null)
                const blob = await ReactPDF.pdf(
                    <TicketPdf
                        ticket={newTicket}
                        ticketsBefore={ticketsBefore}
                    />,
                ).toBlob()

                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `ticket_${newTicket.ticketNumber}.pdf`
                link.click()

                URL.revokeObjectURL(url)
            })
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    if (isLoading) {
        return <Spinner label="loading..." color="success" />
    }

    if (error) {
        return <div>{error?.message}</div>
    }

    return (
        <>
            <Header title="Ticket's distributor" />
            <form onSubmit={createTicket}>
                <Card className="m-3">
                    <CardHeader className="flex justify-center items-center">
                        <h3 className="font-extrabold uppercase text-xl text-gray-600 text-center">
                            Selected service :
                            {` id: ${selectedService?.id}, service name: ${selectedService?.serviceName} `}
                        </h3>
                    </CardHeader>
                    <CardBody>
                        <div className="grid md:grid-cols-2 auto-rows-[200px] justify-center items-center">
                            {services.data.map(service => (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className="bg-neutral-50 rounded-xl border-2 m-2 p-2">
                                    <h2 className="font-extrabold text-xl text-center text-gray-600">
                                        {service.serviceName}
                                    </h2>
                                    <p>{service.serviceDescription}</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-center items-center gap-x-5">
                        <Button
                            type="reset"
                            onClick={() => setSelectedService(null)}>
                            Reset
                        </Button>
                        <Button
                            isDisabled={selectedService == null}
                            type="submit"
                            color="primary">
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    )
}

export default Distributor
