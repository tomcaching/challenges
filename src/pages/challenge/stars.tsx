import { createChallenge, Position, positionEquals, StarsChallengeData, validationErrors } from "@/components/utils/starsUtils";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";


const color = (sector: string): string => {
    const mappings: Record<string, string> = {
        a: "bg-red-300 hover:bg-red-500",
        b: "bg-orange-300 hover:bg-orange-500",
        c: "bg-amber-300 hover:bg-amber-500",
        d: "bg-yellow-200 hover:bg-yellow-500",
        e: "bg-lime-200 hover:bg-lime-500",
        f: "bg-green-200 hover:bg-green-500",
        g: "bg-teal-200 hover:bg-teal-500",
        h: "bg-sky-200 hover:bg-sky-500",
        i: "bg-purple-200 hover:bg-purple-500",
        j: "bg-pink-300 hover:bg-pink-500"
    };

    return mappings[sector] ?? "";
}

const positionKey = (position: Position): string =>
    `${position.x}-${position.y}`;

type StarsPageProps = {
    challenge: StarsChallengeData
}

const Stars: NextPage<StarsPageProps> = ({ challenge }) => {
    const [data, setData] = useState<StarsChallengeData>(challenge);
    const [errors, setErrors] = useState<Array<Position>>([]);
    const [solved, setSolved] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>("");

    const toggleCell = (position: Position) => {
        setData(data => ({ ...data, grid: { ...data.grid, cells: data.grid.cells.map(cell => 
            positionEquals(cell.position, position) 
            ? {...cell, star: !cell.star} 
            : cell
        )}}));
    };

    useEffect(() => {
        const stars = data.grid.cells.filter(cell => cell.star).map(cell => cell.position);
        const errors = validationErrors(data.grid);
        const solved = errors.length === 0 && stars.length === data.grid.size * 2;

        setErrors(errors); 
        setSolved(solved);

        if (solved) {
            fetch("/api/check-stars", { method: "post", body: JSON.stringify({ stars })})
                .then(response => response.text())
                .then(response => { setAnswer(response); });
        }
    }, [data]);

    return (
        <>
            <Head>
                <title>⭐ 🌟 ⭐ 🌟 ⭐ 🌟</title>
            </Head>
            <main className={`min-h-screen flex flex-row items-center justify-center gap-10 transition-colors duration-1000 ${solved ? "bg-black" : ""}`}>
                <div className={`block p-2 m-2 border rounded-xl transition-colors duration-1000 ${solved ? "border-transparent" : ""}`}>
                    <div className="flex flex-row flex-wrap w-80">
                        {
                            data.grid.cells.map((cell) => {
                                return (
                                    <div key={positionKey(cell.position)} onClick={() => toggleCell(cell.position)} className={`flex items-center justify-center text-xl w-8 h-8 rounded-lg border-2 transition-colors duration-1000 cursor-pointer ${
                                        solved 
                                        ? `${cell.star ? "bg-transparent text-yellow-500 border-transparent shadow shadow-yellow-500 z-10" : "bg-black border-transparent"}` 
                                        : ((errors.some(error => positionEquals(error, cell.position)) ? "bg-red-900 text-white" : color(cell.sector)) + " transition-colors duration-1000 border-white")
                                    }`}>
                                        {cell.star && "★"}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <ul className="list-disc text-neutral-800">
                    <li>Žádné 2 hvězdy se nesmí dotýkat</li>
                    <li>Každý řádek musí obsahovat přesně 2 hvězdy</li>
                    <li>Každý sloupec musí obsahovat přesně 2 hvězdy</li>
                    <li>Každý barevný sektor musí obsahovat přesně 2 hvězdy</li>
                    <li className="text-white font-bold">Odpověď je {" "}
                        {
                            (solved && answer) && (<strong className="font-black underline">{answer}</strong>)
                        }
                    </li>
                </ul>
            </main>
        </>
    )
};

export const getStaticProps: GetStaticProps<StarsPageProps> = () => {
    return {
        props: {
            challenge: createChallenge()   
        }
    }
}

export default Stars;