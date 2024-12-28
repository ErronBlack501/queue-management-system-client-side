'use client'
import Header from '@/app/(app)/Header'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import React, { useEffect, useState } from 'react'
import qs from 'qs'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    Pagination,
    Spinner,
    TableCell,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    useDisclosure,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Progress,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import { EyeIcon } from '@/components/EyeIcon'
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon'
import { showToast } from '@/utils/toastHelper'
import { useEcho } from '@/hooks/echo'
import { useAuth } from '@/hooks/auth'

const columns = [
    { uid: 'id', name: 'CODE TICKET' },
    { uid: 'ticket_number', name: 'TICKET NUMBER' },
    { uid: 'ticket_status', name: 'TICKET STATUS' },
    { uid: 'service', name: 'SERVICE NAME' },
    { uid: 'counter', name: 'COUNTER NUMBER' },
    { uid: 'created_at', name: 'CREATED AT' },
    { uid: 'updated_at', name: 'UPDATED AT' },
    { uid: 'actions', name: 'ACTIONS' },
]

const Tickets = () => {
    const { user } = useAuth()
    const [selectedTicket, setSelectedTicket] = useState(null)
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))
    const [page, setPage] = useState(1)
    const [modalPurpose, setModalPurpose] = useState('')
    const query = qs.stringify(
        {
            filters: {
                $and: [
                    {
                        counter_id: {
                            $eq: user.counter.id,
                        },
                    },
                    {
                        ticket_status: {
                            $eq: 'waiting',
                        },
                    },
                ],
            },
        },
        { encodeValuesOnly: true },
    )
    const echo = useEcho()
    const iconClasses =
        'text-xl text-default-500 pointer-events-none flex-shrink-0'

    const {
        data: response,
        mutate,
        error,
        isLoading,
    } = useSWR(`/api/v1/tickets?${query}&page=${page}`, () =>
        axios
            .get(`/api/v1/tickets?${query}&page=${page}`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const nowServingTicketNumber = response?.nowServing?.ticket_number
    const firstTicketNumber = response?.tickets?.data[0]
    const isDisabled =
        !nowServingTicketNumber ||
        nowServingTicketNumber !== firstTicketNumber?.ticket_number

    useEffect(() => {
        if (echo) {
            echo.private('notifications').listen(
                'TicketCreatedEvent',
                ({ service_id, counter_id }) => {
                    if (
                        service_id === user.counter.service_id &&
                        counter_id === user.counter.id
                    ) {
                        showToast(
                            'success',
                            'A new ticket has been assigned to you.',
                        )
                        mutate()
                    }
                },
            )
        }
    }, [echo])

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const updateState = async ticketData => {
        await csrf()
        axios
            .patch(`/api/v1/tickets/${response?.nowServing?.id}`, ticketData)
            .then(() => {
                showToast(
                    'success',
                    'The ticket state has been updated successfully.',
                )
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                showToast('error', error.response.data.errors)
            })
    }

    const lPop = async () => {
        await csrf()
        axios
            .delete('/api/v1/queue/pop-first')
            .then(() => {
                mutate()
                onDispose()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                showToast('error', error?.message)
            })
    }

    const onDispose = () => {
        setSelectedTicket(null)
        setModalPurpose('')
        onClose()
    }

    const openModalWithPurpose = (purpose, ticket = null) => {
        setModalPurpose(purpose)
        setSelectedTicket(ticket)
        onOpen()
    }

    const renderModalContent = () => {
        switch (modalPurpose) {
            case 'viewForm':
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Ticket Details
                        </ModalHeader>
                        <ModalBody>
                            <p>{selectedTicket.id}</p>
                            <p>{selectedTicket.ticketNumber}</p>
                            <p>{selectedTicket.ticketStatus}</p>
                            <h1>Belongs to: </h1>
                            <p>{selectedTicket.service.id}</p>
                            <p>{selectedTicket.service.serviceName}</p>
                            <p>{selectedTicket.service.serviceDescription}</p>
                            <p>{selectedTicket.user.id}</p>
                            <p>{selectedTicket.user.name}</p>
                            <p>{selectedTicket.user.role}</p>
                            <div>
                                <div className="text-center">
                                    {dayjs(selectedTicket.createdAt).format(
                                        'DD MMM YYYY HH:mm:ss',
                                    )}
                                </div>
                                <div className="text-center">
                                    {dayjs(selectedTicket.updatedAt).format(
                                        'DD MMM YYYY HH:mm:ss',
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onDispose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onDispose}>
                                Ok
                            </Button>
                        </ModalFooter>
                    </>
                )
            case 'servingForm':
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Serving ticket:{selectedTicket?.ticket_number}
                        </ModalHeader>
                        <ModalBody>
                            {' '}
                            <Progress
                                size="sm"
                                isIndeterminate
                                aria-label="Loading..."
                                className="max-w-md"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onClick={async () => {
                                    await updateState({
                                        ticketStatus: 'completed',
                                        completedAt: dayjs().format(),
                                    })
                                    await lPop()
                                    onDispose()
                                }}>
                                Complete
                            </Button>
                        </ModalFooter>
                    </>
                )

            default:
                return null
        }
    }

    const renderCell = React.useCallback((ticket, columnKey) => {
        const cellValue = ticket[columnKey]

        switch (columnKey) {
            case 'id':
                return <div className="text-center">{cellValue}</div>
            case 'ticket_number':
                return <div className="text-center">{cellValue}</div>
            case 'ticket_status':
                return <div className="text-center">{cellValue}</div>
            case 'service':
                return (
                    <div className="text-center">{cellValue.service_name}</div>
                )
            case 'counter':
                return (
                    <div className="text-center">
                        {cellValue.counter_number}
                    </div>
                )
            case 'created_at':
            case 'updated_at':
                return (
                    <div className="text-center">
                        {dayjs(cellValue).format('DD MMM YYYY HH:mm:ss')}
                    </div>
                )
            case 'actions':
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    key="view"
                                    startContent={
                                        <EyeIcon className={iconClasses} />
                                    }
                                    onClick={() =>
                                        openModalWithPurpose('viewForm', ticket)
                                    }>
                                    View
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    if (error) return <div>{error.message}</div>

    return (
        <>
            <Header title="Tickets" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Table
                                aria-label="Table with services async pagination"
                                isStriped
                                isHeaderSticky
                                selectedKeys={selectedKeys}
                                selectionMode="multiple"
                                onSelectionChange={setSelectedKeys}
                                topContentPlacement="outside"
                                topContent={
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Now serving ticket:{' '}
                                            {
                                                response?.nowServing
                                                    ?.ticket_number
                                            }
                                        </div>
                                        <div>
                                            Counter status:{' '}
                                            {user.counter.counter_status}
                                        </div>
                                        <Button
                                            color="secondary"
                                            isDisabled={isDisabled}>
                                            Call
                                        </Button>
                                        <Button
                                            color="danger"
                                            onClick={async () => {
                                                await updateState({
                                                    ticketStatus: 'canceled',
                                                    canceledAt: dayjs().format(),
                                                })
                                                await lPop()
                                            }}
                                            isDisabled={isDisabled}>
                                            Cancel
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={async () => {
                                                await updateState({
                                                    processedAt: dayjs().format(),
                                                })

                                                openModalWithPurpose(
                                                    'servingForm',
                                                    firstTicketNumber,
                                                )
                                            }}
                                            isDisabled={isDisabled}>
                                            Serve
                                        </Button>
                                    </div>
                                }
                                bottomContent={
                                    !isLoading ? (
                                        <div className="flex w-full justify-center">
                                            <Pagination
                                                isCompact
                                                showControls
                                                showShadow
                                                color="primary"
                                                page={page}
                                                total={
                                                    response?.tickets
                                                        ?.last_page || 1
                                                }
                                                onChange={setPage}
                                            />
                                        </div>
                                    ) : null
                                }>
                                <TableHeader columns={columns}>
                                    {column => (
                                        <TableColumn
                                            key={column.uid}
                                            align="center">
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    emptyContent="You don't have any tickets assigned to you at the moment"
                                    items={response?.tickets?.data ?? []}
                                    isLoading={isLoading}
                                    loadingContent={
                                        <Spinner label="Loading..." />
                                    }>
                                    {item => (
                                        <TableRow key={item.id}>
                                            {columnKey => (
                                                <TableCell>
                                                    {renderCell(
                                                        item,
                                                        columnKey,
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                hideCloseButton
                isKeyboardDismissDisabled={true}
                isDismissable={false}
                isOpen={isOpen}
                onOpenChange={() => {
                    setSelectedTicket(null)
                    onOpenChange()
                }}>
                <ModalContent>{renderModalContent()}</ModalContent>
            </Modal>
        </>
    )
}

export default Tickets
