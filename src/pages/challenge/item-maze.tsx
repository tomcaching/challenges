import React, { type FC, useEffect, useState } from "react";

type RoomName = "bone" | "mail" | "banana" | "cactus" | "cheese" | "carrot" | "mushroom" | "flower" | "tree" | "bread" | "rock" | "sparkles";

type LockName = "monkey" | "rabbit" | "dog" | "mouse" | "duck";

type MiscName = "door" | "question";

type EmojiName = RoomName | LockName | MiscName;

type Room = {
    id: RoomName;
    title: string;
    connections: Connection[];
}

type Connection = {
    to: RoomName;
    lock: LockName | null;
}

type Lock = {
    id: LockName;
    title: string;
    unlockedBy: RoomName;
}

const rooms: Room[] = [
    //kost:
    {
        id: "bone",
        title: "Kost",
        connections: [
            { lock: null, to: "flower" },
            { lock: "rabbit", to: "bread" },
        ]
    },
    //konec:
    {
        id: "mail",
        title: "Konec",
        connections: []
    },
    //lahev:
    {
        id: "banana",
        title: "",
        connections: [
            { lock: "duck", to: "tree" },
            { lock: null, to: "bone" },
            { lock: "rabbit", to: "flower" },
        ]

    },
    //klacek:
    {
        id: "cactus",
        title: "Kaktus",
        connections: [
            { lock: "mouse", to: "mail" },
            { lock: null, to: "carrot" },
        ]

    },
    //klic:
    {
        id: "cheese",
        title: "Sýr",
        connections: [
            { lock: null, to: "bread" },
            { lock: "duck", to: "carrot" },
            { lock: null, to: "flower" },
        ]

    },
    //zeli:
    {
        id: "carrot",
        title: "Mrkev",
        connections: [
            { lock: "dog", to: "banana" },
            { lock: null, to: "rock" },
        ]

    },
    //houba:
    {
        id: "mushroom",
        title: "Houba",
        connections: [
            { lock: null, to: "flower" },
            { lock: "monkey", to: "cactus" },
            { lock: "mouse", to: "mail" },
            { lock: "rabbit", to: "rock" },
        ]

    },
    //mech:
    {
        id: "flower",
        title: "Kytka",
        connections: [
            { lock: "dog", to: "bread" },
            { lock: null, to: "rock" },
        ]

    },
    //strom:
    {
        id: "tree",
        title: "Strom",
        connections: [
            { lock: null, to: "bone" },
            { lock: "monkey", to: "rock" },
            { lock: "duck", to: "mushroom" },
        ]

    },
    //cerv:
    {
        id: "bread",
        title: "Chleba",
        connections: [
            { lock: null, to: "cheese" },
            { lock: "dog", to: "carrot" },
        ]
    },
    //kamen:
    {
        id: "rock",
        title: "Kámen",
        connections: [
            { lock: "monkey", to: "cactus" },
            { lock: null, to: "banana" },
            { lock: null, to: "bread" },
            { lock: "dog", to: "flower" },
            { lock: null, to: "bone" },
        ]
    },
    //start:
    {
        id: "sparkles",
        title: "Zacatek",
        connections: [
            { lock: null, to: "rock" },
            { lock: null, to: "mushroom" },
        ]
    }
];

const locks: Lock[] = [
    //clovek:
    {
        id: "monkey",
        title: "Opice",
        unlockedBy: "banana",
    },
    //kralik:
    {
        id: "rabbit",
        title: "Králík",
        unlockedBy: "carrot",
    },
    //pes:
    {
        id: "dog",
        title: "Pes",
        unlockedBy: "bone",
    },
    //dvere:
    {
        id: "mouse",
        title: "Myš",
        unlockedBy: "cheese",
    },
    //vrana:
    {
        id: "duck",
        title: "Kachna",
        unlockedBy: "bread"
    }
];

const emojis: Record<EmojiName, string> = {
    bone: "1f9b4",
    mail: "2709",
    banana: "1f34c",
    cactus: "1f335",
    cheese: "1f9c0",
    carrot: "1f955",
    mushroom: "1f344",
    flower: "1f33c",
    tree: "1f332",
    bread: "1f950",
    rock: "1faa8",
    sparkles: "2728",
    monkey: "1f435",
    rabbit: "1f430",
    dog: "1f436",
    mouse: "1f42d",
    duck: "1f986",
    door: "1f6aa",
    question: "2754",
}


const getEmojiUrl = (name: EmojiName) => `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${emojis[name]}.svg`;

const getRoom = (name: RoomName): Room => {
    return rooms.find(room => room.id == name)!
}

type EmojiSize = "small" | "large";

type EmojiProps = {
    code: EmojiName;
    small?: boolean;
    className?: string;
}

const Emoji: FC<EmojiProps> = ({ code, small = false, className = "" }: EmojiProps) => {
    const unicodeEmoji = String.fromCodePoint(parseInt(emojis[code], 16));

    return (
        <div className={`${small ? "h-5 w-5" : "h-10 w-10"} inline-flex items-center justify-center ${className}`}>
            <img alt={unicodeEmoji} className={`inline align-top ${small ? "h-5" : "h-10"}`} src={getEmojiUrl(code)} />
        </div>
    );
}

type BagProps = {
    maxRooms: number;
    visitedRooms: RoomName[];
}

const Bag: FC<BagProps> = ({ visitedRooms, maxRooms }) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 p-4 gap-4 bg-black rounded-xl">
            {
                visitedRooms.map((roomCode, index) => 
                    <div className="w-10 h-10" key={index}>
                        <Emoji code={roomCode} /> 
                    </div>
                )
            }
            {
                [...new Array(maxRooms - visitedRooms.length)].map((_, index) => 
                    <div key={index} className={`${index === 0 ? "bg-neutral-300 ring-4 ring-neutral-600" : "bg-neutral-700"} w-8 h-8 m-1 rounded-full transition-all`}></div>
                )
            }
        </div>
    );
}

type FootnoteProps = {
    reset: () => void;
}

const Footnote: FC<FootnoteProps> = ({ reset }) => {
    return (
        <button className="text-black text-lg font-bold rounded-xl transition-all bg-gray-200 px-4 py-2 hover:bg-gray-300 active:bg-gray-500" onClick={reset}> 
            Resetovat
        </button>
    );
};

type DoorProps = {
    locked: boolean;
    linkedTo: RoomName;
    emoji: EmojiName | null;
    requiredItem: EmojiName | null;
    addRoom: (room: RoomName) => void;
}

const Door: FC<DoorProps> = ({ locked, emoji, linkedTo, requiredItem = null, addRoom }) => {
    const [hover, setHover] = useState<boolean>(false)
    const shownEmoji: EmojiName = (hover && !locked)
        ? linkedTo
        : (emoji ?? "door");

    return (
        <button
            className={`
                group relative p-4 border-2 bg-white rounded-xl transition-all
                enabled:border-neutral-300 enabled:shadow enabled:hover:border-neutral-500 enabled:hover:shadow-xl
                ${locked ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => addRoom(linkedTo)}
            disabled={locked}
        >
            <Emoji code={shownEmoji} className="group-disabled:opacity-50"/>
            {
                locked && (
                    <div className="absolute flex flex-row items-center justify-center bg-white border-2 rounded-full bottom-0 transform translate-y-5 w-10 h-10">
                        <Emoji code={requiredItem!} small/>
                    </div>
                )
            }
        </button>
    )
}

const hasVisited = (visitedRooms: Array<RoomName>, roomCode: RoomName): boolean => {
    return visitedRooms.includes(roomCode);
}

const neededKey = (lockCode: LockName): RoomName => {
    return locks.find(l => l.id == lockCode)!.unlockedBy;
}

type DoorsProps = {
    maxRooms: number;
    visitedRooms: Array<RoomName>;
    currentConnections: Array<Connection>;
    addRoom: (room: RoomName) => void;
};

const Doors: FC<DoorsProps> = ({ visitedRooms, maxRooms, currentConnections, addRoom }) => {
    if (visitedRooms.length == 0) return <></>;
    if (visitedRooms.length >= maxRooms) return <></>

    return (
        <div className="flex flex-row items-center justify-center p-2 gap-4 bg-neutral-100 rounded-2xl">
            {
                currentConnections.map((connection, index) => {
                    const canEnter = connection.lock == null ? true : hasVisited(visitedRooms, neededKey(connection.lock))

                    return (
                        <Door
                            key={index}
                            emoji={connection.lock}
                            linkedTo={connection.to}
                            addRoom={addRoom}
                            locked={!canEnter}
                            requiredItem={canEnter ? null : neededKey(connection.lock!)}
                        />
                    )
                })
            }
        </div>
    )
}

const ItemMaze = () => {
    const maxRooms = 12;
    const initialVisitedRooms: RoomName[] = ["sparkles"];

    const [visitedRooms, setVisitedRooms] = useState<RoomName[]>(initialVisitedRooms);
    const [currentConnections, setCurrentConnections] = useState<Connection[]>([])

    useEffect(() => reset(), []);

    const addRoom = (room: RoomName) => {
        setVisitedRooms(visitedRooms => [...visitedRooms, room]);
        //https://stackoverflow.com/a/46545530
        setCurrentConnections(getRoom(room).connections.sort(() => .5 - Math.random()));
    }

    const reset = () => {
        setVisitedRooms(initialVisitedRooms);
        setCurrentConnections(getRoom("sparkles").connections.sort(() => 0.5 - Math.random()))
    };

    return (
        <div className="text-4xl flex flex-col min-h-screen justify-center items-center">
            <div className="flex flex-col w-2/3 lg:w-2/5 xl:w-1/3 items-center gap-8">
                <Bag visitedRooms={visitedRooms} maxRooms={maxRooms} />
                <Doors currentConnections={currentConnections} maxRooms={maxRooms} visitedRooms={visitedRooms} addRoom={addRoom} />
                <Footnote reset={reset} />
            </div>
        </div>
    )
}

export default ItemMaze;
