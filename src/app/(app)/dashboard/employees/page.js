'use client'

import Header from '@/app/(app)/Header'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import React, { useState } from 'react'
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
import { PlusIcon } from '@/components/PlusIcon'
import dayjs from 'dayjs'
import { EyeIcon } from '@/components/EyeIcon'
import { DeleteDocumentIcon } from '@/components/DeleteDocumentIcon'
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon'
import Link from 'next/link'
import { showToast } from '@/utils/toastHelper'

const columns = [
    { uid: 'id', name: 'ID EMPLOYEE' },
    { uid: 'name', name: 'EMPLOYEE NAME' },
    { uid: 'email', name: 'EMPLOYEE EMAIL' },
    { uid: 'counterNumber', name: 'COUNTER NUMBER' },
    { uid: 'createdAt', name: 'CREATED AT' },
    { uid: 'updatedAt', name: 'UPDATED AT' },
    { uid: 'actions', name: 'ACTIONS' },
]

const Employees = () => {
    const [selectedUser, setSelectedUser] = useState(null)
    const [errors, setErrors] = useState([])
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))
    const [page, setPage] = useState(1)
    const [modalPurpose, setModalPurpose] = useState('')
    const iconClasses =
        'text-xl text-default-500 pointer-events-none flex-shrink-0'

    const {
        data: users,
        mutate,
        error,
        isLoading,
    } = useSWR(`/api/v1/users?page=${page}`, () =>
        axios
            .get(`/api/v1/users?page=${page}`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const onDispose = () => {
        setSelectedUser(null)
        setModalPurpose('')
        onClose()
    }

    const openModalWithPurpose = (purpose, user = null) => {
        setModalPurpose(purpose)
        setSelectedUser(user)
        onOpen()
    }


    const onDelete = async () => {
        await csrf()
        axios
            .delete(`/api/v1/users/${selectedUser.id}`)
            .then(() => {
                mutate()
                showToast(
                    'success',
                    'The user has been deleted successfully.',
                )
                onDispose()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
                showToast('error', errors?.message)
            })
    }

    const renderModalContent = () => {
        switch (modalPurpose) {
            case 'viewForm':
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Employee Details
                        </ModalHeader>
                        <ModalBody>
                            <p>{selectedUser.id}</p>
                            <p>{selectedUser.name}</p>
                            <p>{selectedUser.email}</p>
                            <h1>Works at counter number: </h1>
                            <p>{selectedUser.counterNumber}</p>
                            <p>{selectedUser.role}</p>
                            <div>
                                <div className="text-center">
                                    {dayjs(selectedUser.createdAt).format(
                                        'DD MMM YYYY HH:mm:ss',
                                    )}
                                </div>
                                <div className="text-center">
                                    {dayjs(selectedUser.updatedAt).format(
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
            case 'deleteForm':
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Delete Service
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete this user"
                                {selectedUser?.userNumber}"?
                            </p>
                            <p>This action cannot be undone.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onDispose}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={onDelete}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )

            default:
                return null
        }
    }

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey]

        switch (columnKey) {
            case 'id':
                return <div className="text-center">{cellValue}</div>
            case 'name':
                return <div>{cellValue}</div>
            case 'email':
                return <div>{cellValue}</div>
            case 'counterNumber':
                return (
                    <div className="text-center">{cellValue}</div>
                )
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
                                    onClick={() =>
                                        openModalWithPurpose(
                                            'viewForm',
                                            user,
                                        )
                                    }>
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
                                    onClick={() =>
                                        openModalWithPurpose(
                                            'deleteForm',
                                            user,
                                        )
                                    }>
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
            <Header title="Employees" />
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
                                    <div className="flex justify-end">
                                        <Button
                                            color="primary"
                                            isDisabled
                                            endContent={<PlusIcon />}>
                                            <Link href="#">Add new</Link>
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
                                                    users?.meta?.last_page ||
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
                                    emptyContent="No services found"
                                    items={users?.data ?? []}
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
                    setSelectedUser(null)
                    onOpenChange()
                }}>
                <ModalContent>{renderModalContent()}</ModalContent>
            </Modal>
        </>
    )
}

export default Employees
