import {FC, useEffect, useState} from "react";

type RoomCode =
    "bone" | "mail" | "banana" | "cactus" |
    "cheese" | "carrot" | "mushroom" |
    "flower" | "tree" | "bread" | "rock" | "sparkles"


interface Room {
    id: RoomCode;
    title: string;
    connections: Connection[];
}

type Connection = {
    to: RoomCode;
    lock: LockCode | null;
}

type LockCode = "monkey" | "rabbit" | "dog" | "mouse" | "duck"

type Lock = {
    id: LockCode;
    title: string;
    unlockedBy: RoomCode;
}


const rooms: Room[] = [

    //kost:
    {
        id: "bone",
        title: "Kost",
        connections: [
            {lock: null, to: "flower"},
            {lock: "rabbit", to: "bread"},
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
            {lock: "duck", to: "tree"},
            {lock: null, to: "bone"},
            {lock: "rabbit", to: "flower"},
        ]

    },
    //klacek:
    {
        id: "cactus",
        title: "Kaktus",
        connections: [
            {lock: "mouse", to: "mail"},
            {lock: null, to: "carrot"},
        ]

    },
    //klic:
    {
        id: "cheese",
        title: "Sýr",
        connections: [
            {lock: null, to: "bread"},
            {lock: "duck", to: "carrot"},
            {lock: null, to: "flower"},
        ]

    },
    //zeli:
    {
        id: "carrot",
        title: "Mrkev",
        connections: [
            {lock: "dog", to: "banana"},
            {lock: null, to: "rock"},
        ]

    },
    //houba:
    {
        id: "mushroom",
        title: "Houba",
        connections: [
            {lock: null, to: "flower"},
            {lock: "monkey", to: "cactus"},
            {lock: "mouse", to: "mail"},
            {lock: "rabbit", to: "rock"},
        ]

    },
    //mech:
    {
        id: "flower",
        title: "Kytka",
        connections: [
            {lock: "dog", to: "bread"},
            {lock: null, to: "cactus"},
        ]

    },
    //strom:
    {
        id: "tree",
        title: "Strom",
        connections: [
            {lock: null, to: "bone"},
            {lock: "monkey", to: "rock"},
            {lock: "duck", to: "mushroom"},
        ]

    },
    //cerv:
    {
        id: "bread",
        title: "Chleba",
        connections: [
            {lock: null, to: "cheese"},
            {lock: "dog", to: "carrot"},
        ]
    },
    //kamen:
    {
        id: "rock",
        title: "Kámen",
        connections: [
            {lock: "monkey", to: "cactus"},
            {lock: null, to: "banana"},
            {lock: null, to: "bread"},
            {lock: "dog", to: "flower"},
            {lock: null, to: "bone"},
        ]
    },
    //start:
    {
        id: "sparkles",
        title: "Zacatek",
        connections: [
            {lock: null, to: "rock"},
            {lock: null, to: "mushroom"},
        ]
    },

]
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

]


const emojis =
    {
        bone: "🦴",
        mail: "✉",
        banana: "🍌",
        cactus: "🌵",
        cheese: "🧀",
        carrot: "🥕",
        mushroom: "🍄",
        flower: "🌼",
        tree: "🌲",
        bread: "🍞",
        rock: "🥌",
        sparkles: "✨",
        monkey: "🐵",
        rabbit: "🐰",
        dog: "🐶",
        mouse: "🐭",
        duck: "🦆",
        bag: "💼",
        lock: "🔒",
        find: "🔎",
        door: "🚪",
        no: "❌",
        yes: "✔"
    }

type MiscCode = "bag" | "lock" | "find" | "door" | "no" | "yes";

type EmojiCode = RoomCode | LockCode | MiscCode;


const ItemMaze = () => {

    const [unicode, setUnicode] = useState<boolean>(false)
    const [visitedRooms, setVisitedRooms] = useState<RoomCode[]>([]);

    const addRoom = (roomCode: RoomCode) => {
        setVisitedRooms([...visitedRooms, roomCode])
    }

    const hasVisited = (roomCode: RoomCode) => {
        return visitedRooms.indexOf(roomCode) != -1;
    }

    const neededKey = (lockCode: LockCode) => {
        const lock = locks.find(l => l.id == lockCode);
        return lock!.unlockedBy;
    }


    type EmojiProps = {
        code: EmojiCode,
    }
    const Emoji: FC<EmojiProps> = ({code}: EmojiProps) => {
        return (
            <div className={"inline"}>
                {
                    unicode
                        ? <span className={"text-4xl"}>{emojis[code]}</span>
                        : <img alt={emojis[code]} className={"h-10 inline align-top"} src={`/emojis/${code}.svg`}/>
                }
            </div>

        )
    }
    const Bag: FC = () => {
        return (
            <div>
                <div className={"bg-indigo-300 inline-block m-4 rounded-xl p-2 min-w-fit"}>
                    <div className={"inline-block mr-10 ml-2"}>
                        <Emoji code={"bag"}/>
                    </div>
                    <div className={"inline-block"}>

                        {
                            visitedRooms.map((roomCode, index) => <Emoji key={index} code={roomCode}/>)
                        }
                    </div>
                </div>
            </div>
        )
    }

    const Doors: FC = () => {
        if (visitedRooms.length == 0) return <></>;
        const lastVisitedRoom: RoomCode = visitedRooms.at(-1)!;
        const currentRoom: Room = rooms.find(searchedRoom => searchedRoom.id == lastVisitedRoom)!

        //https://stackoverflow.com/a/46545530
        const shuffledConnections = currentRoom.connections.sort(() => .5 - Math.random());

        type DoorProps = {
            enabled: boolean,
            emoji: EmojiCode | null,
            linkedTo: RoomCode,
        }
        const Door: FC<DoorProps> = ({enabled, emoji, linkedTo}) => {

            const [hasMouse, setHasMouse] = useState<boolean>(false)
            const shownEmoji: EmojiCode =
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
                    <a onClick={() => {
                        if (enabled) addRoom(linkedTo);
                    }}>
                        <Emoji code={shownEmoji}/>
                    </a>
                </div>
            )

        }

        return (
            <div>

                <div className={"m-2 inline-block m-4 rounded-xl p-2 min-w-fit bg-amber-500"}>
                    {

                        shuffledConnections.map((connection, index) => {
                                const canEnter =
                                    connection.lock == null
                                        ? true
                                        : hasVisited(neededKey(connection.lock))


                                return (
                                    <Door
                                        key={index}
                                        enabled={canEnter}
                                        emoji={connection.lock}
                                        linkedTo={connection.to}
                                    />

                                )
                            }
                        )
                    }

                </div>

            </div>
        )
    }

    const Footnote: FC = () => {
        return (<>
                <div className={"text-gray-400 text-sm m-2"}>
                    <button
                        className={"text-black text-lg font-bold rounded bg-gray-300 px-2 py-1 hover:bg-gray-400 active:bg-gray-500"}
                        onClick={reset}> Resetovat
                    </button>
                    <div>
                        <input className={"m-1"} type={"checkbox"} defaultChecked={unicode}
                               onChange={(event) => setUnicode(event.target.checked)}/>
                        Použít unicode
                    </div>
                    Stránka používá <a href={"https://openmoji.org"}>OpenMoji</a>. Licence: <a
                    href={"https://creativecommons.org/licenses/by-sa/4.0/#"}>CC BY-SA 4.0</a>
                </div>
            </>
        )
    }

    const reset = () => setVisitedRooms(["sparkles"]);
    useEffect(() => {
        reset();
    }, [])


    return (
        <div className={"text-4xl"}>
            <Bag/>
            {
                visitedRooms.length > 0 &&
                <Doors/>
            }
            <Footnote/>
        </div>
    )
}

export default ItemMaze;
