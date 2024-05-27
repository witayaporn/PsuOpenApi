"use client";

import SearchBar from "../../components/searchBar";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

export default function MapSearchPage() {
    const router = useRouter();
    const Map = dynamic(() => import("./map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

    const handleSearchChange = (e: any) => {
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        router.push(`/mapSearch/?search=${e.target[0].value}`);
    };

    return (
        <section>
            <div className="grid grid-cols-1 gap-4 mb-3">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <p className="text-4xl font-bold text-right">
                            เเผนที่เเละอาคาร
                        </p>
                    </div>
                    <SearchBar
                        onSubmit={handleSubmit}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div>
                <Map />
            </div>
        </section>
    );
}
