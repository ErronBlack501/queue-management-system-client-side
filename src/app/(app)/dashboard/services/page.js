'use client'
import Header from '@/app/(app)/Header'
import axios from '@/lib/axios'
import useSWR from 'swr'

const Services = () => {
    const { data: user, error } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )
    return (
        <>
            <Header title="Services" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Laravel - Services
                            {JSON.stringify(user)}
                            {JSON.stringify(error)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Services
