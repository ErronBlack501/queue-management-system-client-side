'use client'

import { useState } from 'react'
import Header from '@/app/(app)/Header'
import { RadioGroup, Radio, Textarea, Input, Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { axios } from '@/lib/axios'
import InputError from '@/components/InputError'

const CreatePage = () => {
    const router = useRouter()
    const [serviceName, setServiceName] = useState('')
    const [notValide, setNotValide] = useState(false)
    const [serviceDescription, setServiceDescription] = useState('')
    const [isActive, setIsActive] = useState('true')
    const [errors, setErrors] = useState([])

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const submitForm = async event => {
        event.preventDefault()

        await csrf()

        const data = {
            serviceName: serviceName,
            serviceDescription: serviceDescription,
            isActive: isActive === 'true',
        }

        setErrors([])

        axios
            .post('/api/v1/services', data)
            .then(() => router.back())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
                setNotValide(true)
            })
    }

    return (
        <>
            <Header title="Create Service" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div>
                            <form onSubmit={submitForm}>
                                {/* Name */}
                                <div>
                                    <Input
                                        id="service_name"
                                        isRequired
                                        isClearable
                                        required
                                        label="SERVICE NAME"
                                        labelPlacement={'outside'}
                                        placeholder="Enter the service name"
                                        type="text"
                                        variant={'bordered'}
                                        value={serviceName}
                                        isInvalid={notValide}
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

                                {/* Email Address */}
                                <div className="mt-4">
                                    <Textarea
                                        id="service_description"
                                        name="serviceDescription"
                                        label="SERVICE DESCRIPTION"
                                        labelPlacement="outside"
                                        isInvalid={notValide}
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
                                        value={serviceDescription}
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
                                        required
                                        value={isActive}
                                        onValueChange={setIsActive}
                                        orientation="horizontal">
                                        <Radio value="false">No</Radio>
                                        <Radio value="true">Yes</Radio>
                                    </RadioGroup>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Button
                                        className="ml-4"
                                        onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type={'submit'}
                                        className="ml-4"
                                        color={'primary'}>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePage
