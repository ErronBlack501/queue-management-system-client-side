import { Spinner } from '@nextui-org/react'

const Loading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
            <Spinner label=" Loading..." color="success" />
        </div>
    )
}

export default Loading
