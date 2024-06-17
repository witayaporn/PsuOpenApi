export default function CommentSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="flex">
                <div className="w-9 h-8 rounded-full bg-slate-300 my-auto"></div>
                <div className="flex flex-col w-full">
                    <div className="mx-2 my-1 h-[0.75rem] w-3/5 bg-slate-300"></div>
                    <div className="mx-2 my-1 h-[0.65rem] w-2/5 bg-slate-300"></div>
                </div>
            </div>
            <div className="px-3 py-3 border-l-2 border-solid">
                <div className="mx-2 my-1 h-[0.75rem] w-3/5 bg-slate-300"></div>
                <div className="mx-2 my-1 h-[0.75rem] w-3/5 bg-slate-300"></div>
                <div className="mx-2 my-1 h-[0.75rem] w-3/5 bg-slate-300"></div>
                <div className="mx-2 my-1 h-[0.75rem] w-3/5 bg-slate-300"></div>
                <div className="mx-2 my-1 h-[0.65rem] w-1/5 bg-slate-300"></div>
            </div>
        </div>
    );
}
