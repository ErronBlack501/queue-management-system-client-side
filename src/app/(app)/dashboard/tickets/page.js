'use client'
import Header from '@/app/(app)/Header'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import React, { useEffect, useState } from 'react'
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
    cn,
    useDisclosure,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import { EyeIcon } from '@/components/EyeIcon'
import { DeleteDocumentIcon } from '@/components/DeleteDocumentIcon'
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon'
import { showToast } from '@/utils/toastHelper'
import { useEcho } from '@/hooks/echo'

const columns = [
    { uid: 'id', name: 'CODE TICKET' },
    { uid: 'ticketNumber', name: 'TICKET NUMBER' },
    { uid: 'ticketStatus', name: 'TICKET STATUS' },
    { uid: 'service', name: 'SERVICE NAME' },
    { uid: 'counter', name: 'COUNTER NUMBER' },
    { uid: 'createdAt', name: 'CREATED AT' },
    { uid: 'updatedAt', name: 'UPDATED AT' },
    { uid: 'actions', name: 'ACTIONS' },
]

const Tickets = () => {
    const [selectedTicket, setSelectedTicket] = useState(null)
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))
    const [page, setPage] = useState(1)
    const echo = useEcho()
    const iconClasses =
        'text-xl text-default-500 pointer-events-none flex-shrink-0'

    const {
        data: tickets,
        mutate,
        error,
        isLoading,
    } = useSWR(`/api/v1/tickets?page=${page}`, () =>
        axios
            .get(`/api/v1/tickets?page=${page}`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    useEffect(() => {
        if (echo) {
            echo.private('notifications').listen('TicketCreatedEvent', () => {
                showToast('success', 'A new ticket has been created successfully.')
                mutate()
            })
        }
    }, [echo])

    const onDispose = () => {
        setSelectedTicket(null)
        onClose()
    }

    const openModal = ticket => {
        setSelectedTicket(ticket)
        onOpen()
    }

    const renderCell = React.useCallback((ticket, columnKey) => {
        const cellValue = ticket[columnKey]

        switch (columnKey) {
            case 'id':
                return <div className="text-center">{cellValue}</div>
            case 'ticketNumber':
                return <div className="text-center">{cellValue}</div>
            case 'ticketStatus':
                return <div className="text-center">{cellValue}</div>
            case 'service':
                return (
                    <div className="text-center">{cellValue.serviceName}</div>
                )
            case 'counter':
                return <div className="text-center">{cellValue.counterNumber}</div>
            case 'createdAt':
            case 'updatedAt':
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
                                    onClick={() => openModal(ticket)}>
                                    View
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                        <DeleteDocumentIcon
                                            className={cn(
                                                iconClasses,
                                                'text-danger',
                                            )}
                                        />
                                    }
                                    onClick={() => openModal(ticket)}>
                                    Delete
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
                                aria-label="Table with tickets async pagination"
                                isStriped
                                isHeaderSticky
                                selectedKeys={selectedKeys}
                                selectionMode="multiple"
                                onSelectionChange={setSelectedKeys}
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
                                                    tickets?.meta?.last_page ||
                                                    1
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
                                            align={
                                                column.uid === 'actions'
                                                    ? 'center'
                                                    : 'start'
                                            }>
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    emptyContent="No tickets found"
                                    items={tickets?.data ?? []}
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
                isOpen={isOpen}
                onOpenChange={() => {
                    setSelectedTicket(null)
                    onOpenChange()
                }}>
                <ModalContent>
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
                            <p>{selectedTicket.counter.id}</p>
                            <p>{selectedTicket.counter.counterNumber}</p>
                            <p>{selectedTicket.counter.counterStatus}</p>
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
                </ModalContent>
            </Modal>
        </>
    )
}

export default Tickets
