import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Queue Management System',
}

const Home = () => {
    redirect('/client')
}

export default Home
