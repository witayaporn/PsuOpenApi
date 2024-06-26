export default function SearchBar({ ...props }) {
    return (
        <div>
            <form onSubmit={props.onSubmit} className="grid grid-cols-6 gap-1">
                <input
                    type="text"
                    onChange={props.onChange}
                    className="col-span-5 bg-gray-50 border border-gray-700 text-md rounded-xl focus:border-blue-950 block w-full p-2.5"
                ></input>
                <button
                    type="submit"
                    className="w-full h-full bg-blue-950 text-white border hover:bg-white hover:text-blue-950 hover:border-blue-950 rounded-xl transition-all"
                >
                    <svg
                        className="w-6 h-6 m-auto sm:hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                    <p className="hidden sm:inline">ค้นหา</p>
                </button>
            </form>
        </div>
    );
}
