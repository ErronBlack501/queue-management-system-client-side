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
    Chip,
    Textarea,
    Input,
    RadioGroup,
    Radio,
} from '@nextui-org/react'
import { PlusIcon } from '@/components/PlusIcon'
import dayjs from 'dayjs'
import XCircleIcon from '@/components/XCircleIcon'
import { EyeIcon } from '@/components/EyeIcon'
import { EditIcon } from '@/components/EditIcon'
import { DeleteDocumentIcon } from '@/components/DeleteDocumentIcon'
import CheckIcon from '@/components/CheckIcon'
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon'
import Link from 'next/link'
import InputError from '@/components/InputError'
import { showToast } from '@/utils/toastHelper'

const columns = [
    { uid: 'id', name: 'ID SERVICE' },
    { uid: 'serviceName', name: 'SERVICE NAME' },
    { uid: 'serviceDescription', name: 'SERVICE DESCRIPTION' },
    { uid: 'estimatedDuration', name: 'ESTIMATED DURATION' },
    { uid: 'isActive', name: 'IS ACTIVE ?' },
    { uid: 'createdAt', name: 'CREATED AT' },
    { uid: 'updatedAt', name: 'UPDATED AT' },
    { uid: 'actions', name: 'ACTIONS' },
]

const Services = () => {
    const [selectedService, setSelectedService] = useState(null)
    const [serviceName, setServiceName] = useState('')
    const [notValid, setNotValid] = useState(false)
    const [serviceDescription, setServiceDescription] = useState('')
    const [isActive, setIsActive] = useState('true')
    const [errors, setErrors] = useState([])
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))
    const [page, setPage] = useState(1)
    const [modalPurpose, setModalPurpose] = useState('')
    const iconClasses =
        'text-xl text-default-500 pointer-events-none flex-shrink-0'

    const {
        data: services,
        mutate,
        error,
        isLoading,
    } = useSWR(`/api/v1/services?page=${page}`, () =>
        axios
            .get(`/api/v1/services?page=${page}`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const onSave = async event => {
        event.preventDefault()

        await csrf()

        const data = {
            serviceName: serviceName,
            serviceDescription: serviceDescription,
            isActive: isActive === 'true',
        }

        setErrors([])
        setNotValid(false)

        axios
            .patch(`/api/v1/services/${selectedService.id}`, data)
            .then(() => {
                showToast(
                    'success',
                    'The service has been updated successfully.',
                )
                mutate()
                resetFields()
                onDispose()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
                setNotValid(true)
            })
    }

    const onDispose = () => {
        setSelectedService(null)
        setModalPurpose('')
        onClose()
    }

    const openModalWithPurpose = (purpose, service = null) => {
        setModalPurpose(purpose)
        setSelectedService(service)
        onOpen()
    }

    const resetFields = () => {
        setServiceName('')
        setServiceDescription('')
    }

    const onDelete = async () => {
        await csrf()
        axios
            .delete(`/api/v1/services/${selectedService.id}`)
            .then(() => {
                mutate()
                showToast(
                    'success',
                    'The service has been deleted successfully.',
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
                            Service Details
                        </ModalHeader>
                        <ModalBody>
                            <p>{selectedService.id}</p>
                            <p>{selectedService.serviceName}</p>
                            <p>{selectedService.serviceDescription}</p>
                            <div>
                                {selectedService.isActive ? (
                                    <Chip variant="faded" color="success">
                                        Active
                                    </Chip>
                                ) : (
                                    <Chip variant="faded" color="danger">
                                        Inactive
                                    </Chip>
                                )}
                            </div>
                            <div>
                                <div className="text-center">
                                    {dayjs(selectedService.createdAt).format(
                                        'DD MMM YYYY HH:mm:ss',
                                    )}
                                </div>
                                <div className="text-center">
                                    {dayjs(selectedService.updatedAt).format(
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
            case 'editForm':
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Service Edit
                        </ModalHeader>
                        <form onSubmit={onSave}>
                            <ModalBody>
                                {/* Name */}
                                <div>
                                    <Input
                                        id="service_name"
                                        isRequired
                                        isClearable
                                        required
                                        label="SERVICE NAME"
                                        labelPlacement={'outside'}
                                        placeholder={
                                            selectedService?.serviceName
                                        }
                                        type="text"
                                        variant={'bordered'}
                                        value={serviceName}
                                        isInvalid={notValid}
                                        errorMessage={
                                            <InputError
                                                messages={errors?.service_name}
                                            />
                                        }
                                        className="block mt-1 w-full"
                                        onChange={event =>
                                            setServiceName(event.target.value)
                                        }
                                        autoFocus
                                    />
                                </div>

                                <div className="mt-4">
                                    <Textarea
                                        id="service_description"
                                        name="serviceDescription"
                                        label="SERVICE DESCRIPTION"
                                        defaultValue={
                                            selectedService?.serviceDescription
                                        }
                                        labelPlacement="outside"
                                        isInvalid={notValid}
                                        errorMessage={
                                            <InputError
                                                messages={
                                                    errors?.service_description
                                                }
                                            />
                                        }
                                        isRequired
                                        required
                                        variant="bordered"
                                        placeholder="Enter the service's description"
                                        onChange={event =>
                                            setServiceDescription(
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="mt-4">
                                    <RadioGroup
                                        id="is_active"
                                        label="IS ACTIVE ?"
                                        isRequired
                                        value={isActive}
                                        onValueChange={setIsActive}
                                        required
                                        orientation="horizontal">
                                        <Radio value="false">No</Radio>
                                        <Radio value="true">Yes</Radio>
                                    </RadioGroup>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        resetFields()
                                        onDispose()
                                    }}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Save
                                </Button>
                            </ModalFooter>
                        </form>
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
                                Are you sure you want to delete the service "
                                {selectedService?.serviceName}"?
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

    const renderCell = React.useCallback((service, columnKey) => {
        const cellValue = service[columnKey]

        switch (columnKey) {
            case 'id':
                return <div className="text-center">{cellValue}</div>
            case 'serviceName':
                return <div>{cellValue}</div>
            case 'serviceDescription':
                return <div className="whitespace-pre-wrap">{cellValue}</div>
            case 'estimatedDuration':
                return <div className="text-center">{cellValue || '?'}</div>
            case 'isActive':
                return (
                    <div className="flex justify-center">
                        {cellValue ? <CheckIcon /> : <XCircleIcon />}
                    </div>
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
                                            service,
                                        )
                                    }>
                                    View
                                </DropdownItem>
                                <DropdownItem
                                    key="edit"
                                    startContent={
                                        <EditIcon className={iconClasses} />
                                    }
                                    onClick={() => {
                                        openModalWithPurpose(
                                            'editForm',
                                            service,
                                        )
                                    }}>
                                    Edit
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
                                            service,
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
            <Header title="Services" />
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
                                            endContent={<PlusIcon />}>
                                            <Link href="/dashboard/services/create">
                                                Add new
                                            </Link>
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
                                                    services?.meta?.last_page ||
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
                                    items={services?.data ?? []}
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
                    setSelectedService(null)
                    resetFields()
                    onOpenChange()
                }}>
                <ModalContent>{renderModalContent()}</ModalContent>
            </Modal>
        </>
    )
}

export default Services
