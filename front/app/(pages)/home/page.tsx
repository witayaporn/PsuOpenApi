
export default function HomePage(){
    return (
        <>
            <div className="grid grid-rows-3 md:grid-rows-2 grid-cols-1 md:grid-cols-2 gap-4 h-fit">
                <button className="row-span-1 col-span-1 h-44 bg-emerald-200 rounded hover:shadow">
                    <p>1</p>
                </button>
                <button className="row-span-1 h-44 bg-emerald-100 box-border rounded hover:shadow">
                    <p>2</p>
                </button>
                <button className="col-span-1 md:col-span-2 h-44 bg-emerald-300 box-border rounded hover:shadow">
                    <p>3</p>
                </button>
            </div>
        </>
    )
}