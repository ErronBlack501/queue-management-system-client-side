'use client'
import Header from '@/app/(app)/Header'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import React from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    Pagination,
    getKeyValue,
    Spinner,
    TableCell,
    Button,
} from '@nextui-org/react'
import Link from 'next/link'
import { PlusIcon } from '@/components/PlusIcon'

const columns = [
    {
        key: 'id',
        label: 'ID SERVICE',
    },
    {
        key: 'serviceName',
        label: 'SERVICE NAME',
    },
    {
        key: 'serviceDescription',
        label: 'SERVICE DESCRIPTION',
    },
    {
        key: 'estimatedDuration',
        label: 'ESTIMATED DURATION',
    },
    {
        key: 'isActive',
        label: 'IS ACTIVE ?',
    },
]

const Services = () => {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))
    const [page, setPage] = React.useState(1)

    const {
        data: services,
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
                                selectionMode={'multiple'}
                                onSelectionChange={setSelectedKeys}
                                topContentPlacement={'outside'}
                                topContent={
                                    <div className="flex justify-end">
                                        <Button
                                            color="primary"
                                            endContent={<PlusIcon />}>
                                            <Link
                                                href={
                                                    '/dashboard/services/create'
                                                }>
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
                                                total={services.meta.last_page}
                                                onChange={page => setPage(page)}
                                            />
                                        </div>
                                    ) : null
                                }>
                                <TableHeader columns={columns}>
                                    {column => (
                                        <TableColumn key={column.key}>
                                            {column.label}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    emptyContent={'No services found'}
                                    items={services?.data ?? []}
                                    isLoading={isLoading}
                                    loadingContent={
                                        <Spinner label="Loading..." />
                                    }>
                                    {item => (
                                        <TableRow key={item.key}>
                                            {columnKey => (
                                                <TableCell>
                                                    {getKeyValue(
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
        </>
    )
}

export default Services
