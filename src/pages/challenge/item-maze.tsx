import React, { type FC, useEffect, useState } from "react";

type RoomName = "bone" | "mail" | "banana" | "cactus" | "cheese" | "carrot" | "mushroom" | "flower" | "tree" | "bread" | "rock" | "sparkles";

type LockName = "monkey" | "rabbit" | "dog" | "mouse" | "duck";

type MiscName = "bag" | "door" | "no" | "yes" | "think" | "question";

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
    bag: "1f4bc",
    door: "1f6aa",
    no: "274c",
    yes: "2714",
    think: "1f4ad",
    question: "2754",
}


const getEmojiUrl = (name: EmojiName) => `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${emojis[name]}.svg`;

const getRoom = (name: RoomName): Room => {
    return rooms.find(room => room.id == name)!
}

type EmojiProps = {
    code: EmojiName,
}

const Emoji: FC<EmojiProps> = ({ code }: EmojiProps) => {
    const unicodeEmoji = String.fromCodePoint(parseInt(emojis[code], 16));

    return (
        <div className="h-10 w-10 inline">
            <img alt={unicodeEmoji} className="h-10 inline align-top" src={getEmojiUrl(code)} />
        </div>
    );
}

type BagProps = {
    visitedRooms: RoomName[];
    maxRooms: number;
    thinkingIcon: EmojiName;
}

const Bag: FC<BagProps> = ({ visitedRooms, maxRooms, thinkingIcon }) => {
    let displayedEmojis: EmojiName[] = [...visitedRooms];

    for (let i = visitedRooms.length; i < maxRooms; i++) {
        displayedEmojis.push("question");
    }

    return (
        <div className={"flex flex-row"}>
            <div className={""}>
                <div className={""}>
                    <Emoji code={"bag"} />
                </div>
                <div>
                    <Emoji code={thinkingIcon} />
                </div>

                <div className={"bg-green-300"}>
                    <Emoji code={visitedRooms.at(-1)!} />
                </div>
            </div>
            <div className={"bg-indigo-300"}>
                {
                    displayedEmojis.map((roomCode, index) => <Emoji key={index} code={roomCode} />)
                }
            </div>
        </div>
    )
}


type FootnoteProps = {
    reset: () => void;
}

const Footnote: FC<FootnoteProps> = ({ reset }) => {
    return (<>
        <div className={"text-gray-400 text-sm m-2"}>
            <button
                className={"block text-black text-lg font-bold rounded bg-gray-300 px-2 py-1 hover:bg-gray-400 active:bg-gray-500"}
                onClick={reset}> Resetovat
            </button>
        </div>
    </>
    )
};

type DoorProps = {
    enabled: boolean;
    linkedTo: RoomName;
    emoji: EmojiName | null;
    requiredItem: EmojiName | null;
    addRoom: (room: RoomName) => void;
}

const Door: FC<DoorProps> = ({ enabled, emoji, linkedTo, requiredItem = null, addRoom}) => {
    const [hasMouse, setHasMouse] = useState<boolean>(false)
    const shownEmoji: EmojiName =
        hasMouse
            ? enabled ? linkedTo : "no"
            : emoji ?? "door";

    return (
        <div
            style={{
                cursor: enabled ? "pointer" : "not-allowed"
            }}
            className={"inline-block m-1 rounded-xl min-w-fit"}
            onMouseEnter={() => setHasMouse(true)}
            onMouseLeave={() => setHasMouse(false)}
        >
            <button onClick={() => { if (enabled) addRoom(linkedTo);
            }}>
                <Emoji code={shownEmoji} />
            </button>
        </div>
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
        <div>
            <div className={"bg-amber-500"}>
                {
                    currentConnections.map((connection, index) => {
                        const canEnter = connection.lock == null ? true : hasVisited(visitedRooms, neededKey(connection.lock))

                        return (
                            <Door
                                key={index}
                                enabled={canEnter}
                                emoji={connection.lock}
                                linkedTo={connection.to}
                                requiredItem={canEnter ? null : neededKey(connection.lock!)}
                                addRoom={addRoom}
                            />

                        )
                    }
                    )
                }

            </div>

        </div>
    )
}

const ItemMaze = () => {
    const initialVisitedRooms: RoomName[] = ["sparkles"];
    const defaultThinkingIcon: EmojiName = "think";
    const maxRooms = 12;

    const [visitedRooms, setVisitedRooms] = useState<RoomName[]>(initialVisitedRooms);
    const [thinkingIcon, setThinkingIcon] = useState<EmojiName>(defaultThinkingIcon)
    const [currentConnections, setCurrentConnections] = useState<Connection[]>([])

    useEffect(() => reset(), [])

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
            <div className="flex flex-col w-2/3 lg:w-2/5 xl:w-1/3">
                <Bag thinkingIcon={thinkingIcon} visitedRooms={visitedRooms} maxRooms={maxRooms} />
                <Doors currentConnections={currentConnections} maxRooms={maxRooms} visitedRooms={visitedRooms} addRoom={addRoom}/>
                <Footnote reset={reset} />
            </div>
        </div>
    )
}

export default ItemMaze;
