'use client'
import Header from '@/app/(app)/Header'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@nextui-org/react'

const Counters = () => {
    const {
        data: counters,
        error,
        isLoading,
    } = useSWR('/api/v1/counters', () =>
        axios
            .get('/api/v1/counters')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )
    if (isLoading) return <div>is Loading....</div>
    if (error) return <div>{error.message}</div>

    return (
        <>
            <Header title="Counters" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Laravel - Counters
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>ID</TableColumn>
                                    <TableColumn>COUNTER NUMBER</TableColumn>
                                    <TableColumn>COUNTER STATUS</TableColumn>
                                    <TableColumn>CREATED AT</TableColumn>
                                    <TableColumn>UPDATED AT</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {counters.data.map(counter => (
                                        <TableRow key={counter.id}>
                                            <TableCell>{counter.id}</TableCell>
                                            <TableCell>
                                                {counter.counterNumber}
                                            </TableCell>
                                            <TableCell>
                                                {counter.counterStatus}
                                            </TableCell>
                                            <TableCell>
                                                {counter.createdAt}
                                            </TableCell>
                                            <TableCell>
                                                {counter.updatedAt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Counters
