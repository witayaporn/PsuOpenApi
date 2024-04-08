
export default function HomePage(){
    return (
        <section>
            <div className="grid grid-rows-3 md:grid-rows-2 grid-cols-1 md:grid-cols-2 gap-4 h-fit ">
                <a href="/classSearch" className="row-span-1 col-span-1 h-44 bg-emerald-200 rounded hover:shadow hover:scale-[1.01] transition-all ">
                    <p>1</p>
                    <p class = "text-2xl font-bold text-center pt-12 ">Class Search :P</p>
                </a>
                <a href="/mapSearch" className="row-span-1 h-44 bg-emerald-100 box-border rounded hover:shadow hover:scale-[1.01] transition-all ">
                    <p>2</p>
                    <h1 class = "text-2xl font-bold text-center pt-12">Searching :P</h1>
                </a>
                <a href="/plan" className="col-span-1 md:col-span-2 h-44 bg-emerald-300 box-border rounded hover:shadow hover:scale-[1.01] transition-all">
                    <p>3</p>
                    <h1 class = "text-2xl font-bold text-center pt-12">Planing :P</h1>
                </a>
            </div>
        </section>
    )
}