export default function HeadNavbar() {
    return (
        <nav className="bg-[#E8F8F8] fixed w-full top-0 start-0 z-[1000]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/home" className="flex items-center space-x-1 rtl:space-x-reverse">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/> */}
                    <span className="self-center text-3xl font-semibold text-blue-900">PSU</span>
                    <span className="self-center text-3xl whitespace-nowrap">Guide</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-3 ltr:space-x-reverse">
                    <p className="self-center text-lg">Sompong Somsri </p>
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
            </div>
        </nav>
    )
}