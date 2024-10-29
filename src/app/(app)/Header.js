const Header = ({ title }) => {
    return (
        <header className="bg-green-600 shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h2 className="font-extrabold text-xl text-white leading-tight">
                    {title}
                </h2>
            </div>
        </header>
    )
}

export default Header
