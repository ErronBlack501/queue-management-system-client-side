import Image from 'next/image'

const ApplicationLogo = props => {
    return (
        <Image
            src="/smmc.png"
            priority
            width={180}
            height={20}
            {...props}
            alt="Logo SMMC port Toamasina"
        />
    )
}

export default ApplicationLogo
