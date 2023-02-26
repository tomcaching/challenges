import {FC, useEffect, useState} from "react";

type RoomName =
    "bone" | "mail" | "banana" | "cactus" |
    "cheese" | "carrot" | "mushroom" |
    "flower" | "tree" | "bread" | "rock" | "sparkles"


interface Room {
    id: RoomName;
    title: string;
    connections: Connection[];
}

type Connection = {
    to: RoomName;
    lock: LockName | null;
}

type LockName = "monkey" | "rabbit" | "dog" | "mouse" | "duck"

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
            {lock: null, to: "rock"},
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


/*const emojis =
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
    }*/

const emojis = {
    bone: "1F9B4",
    mail: "2709",
    banana: "1F34C",
    cactus: "1F335",
    cheese: "1F9C0",
    carrot: "1F955",
    mushroom: "1F344",
    flower: "1F33C",
    tree: "1F332",
    bread: "1F950",
    rock: "1FAA8",
    sparkles: "2728",
    monkey: "1F435",
    rabbit: "1F430",
    dog: "1F436",
    mouse: "1F42D",
    duck: "1F986",
    bag: "1F4BC",
    door: "1F6AA",
    no: "274C",
    yes: "2714",
    think: "1F4AD",
    question: "2754",
}
type MiscName = "bag" | "door" | "no" | "yes" | "think" | "question";
type EmojiName = RoomName | LockName | MiscName;
const getEmojiUrl = (name: EmojiName) => {
    const openmoji = `https://openmoji.org/data/color/svg/`//code.toUpperCase()
    const twemoji = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/`//code.toLowerCase()

    const code = emojis[name].toUpperCase();
    return openmoji + code + ".svg";

}

const getRoom = (name: RoomName) => {
    return rooms.find(room => room.id == name)!
}


const ItemMaze = () => {
    const initialVisitedRooms: RoomName[] = ["sparkles"];
    const defaultThinkingIcon: EmojiName = "think";
    const maxRooms = 12;

    const [visitedRooms, setVisitedRooms] = useState<RoomName[]>(initialVisitedRooms);
    const [thinkingIcon, setThinkingIcon] = useState<EmojiName>(defaultThinkingIcon)
    const [currentConnections, setCurrentConnections] = useState<Connection[]>([])

    useEffect(() => reset(), [])

    const addRoom = (roomCode: RoomName) => {
        setVisitedRooms([...visitedRooms, roomCode])
        //https://stackoverflow.com/a/46545530
        setCurrentConnections(
            getRoom(roomCode).connections.sort(() => .5 - Math.random())
        )

    }

    const hasVisited = (roomCode: RoomName) => {
        return visitedRooms.indexOf(roomCode) != -1;
    }

    const neededKey = (lockCode: LockName) => {
        const lock = locks.find(l => l.id == lockCode);
        return lock!.unlockedBy;
    }


    type EmojiProps = {
        code: EmojiName,
    }
    const Emoji: FC<EmojiProps> = ({code}: EmojiProps) => {
        const unicodeEmoji = String.fromCodePoint(parseInt(emojis[code], 16))

        return (
            <div className={"h-10 w-10 inline"}>
                {

                    /*unicode
                        ? <span className={"text-4xl"}>{emojis[code]}</span>
                        :*/
                    <img alt={unicodeEmoji} className={"h-10 inline align-top"} src={getEmojiUrl(code)}/>
                }
            </div>

        )
    }
    const Bag: FC = () => {

        let displayedEmojis: EmojiName[] = [...visitedRooms];
        for (let i = visitedRooms.length; i < maxRooms; i++) {
            displayedEmojis.push("question");
        }

        return (
            <div className={"flex flex-row"}>
                <div className={""}>
                    <div className={""}>
                        <Emoji code={"bag"}/>
                    </div>
                    <div>
                        <Emoji code={thinkingIcon}/>
                    </div>

                    <div className={"bg-green-300"}>
                        <Emoji code={visitedRooms.at(-1)!}/>
                    </div>
                </div>
                <div className={"bg-indigo-300 grid grid-cols-4"}>

                    {
                        displayedEmojis.map((roomCode, index) => <Emoji key={index} code={roomCode}/>)
                    }
                </div>
            </div>
        )
    }

    const Doors: FC = () => {
        if (visitedRooms.length == 0) return <></>;
        if (visitedRooms.length >= maxRooms) return <></>

        //const lastVisitedRoom: RoomName = visitedRooms.at(-1)!;
        //const currentRoom: Room = rooms.find(searchedRoom => searchedRoom.id == lastVisitedRoom)!

        type DoorProps = {
            enabled: boolean,
            emoji: EmojiName | null,
            linkedTo: RoomName,
            thinkingItem: EmojiName,
        }
        const Door: FC<DoorProps> = ({enabled, emoji, linkedTo, thinkingItem}) => {

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
                    onMouseEnter={() => {
                        setHasMouse(true);
                        if (thinkingItem) setThinkingIcon(thinkingItem)

                    }}
                    onMouseLeave={() => {
                        setHasMouse(false)
                        setThinkingIcon(defaultThinkingIcon)
                    }}
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
                <div className={"bg-amber-500"}>
                    {
                        currentConnections.map((connection, index) => {
                                const canEnter =
                                    connection.lock == null
                                        ? true
                                        : hasVisited(neededKey(connection.lock))

                                const missingItem =
                                    canEnter
                                        ? "yes"
                                        : neededKey(connection.lock!);

                                return (
                                    <Door
                                        key={index}
                                        enabled={canEnter}
                                        emoji={connection.lock}
                                        linkedTo={connection.to}
                                        thinkingItem={missingItem}
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
                        className={"block text-black text-lg font-bold rounded bg-gray-300 px-2 py-1 hover:bg-gray-400 active:bg-gray-500"}
                        onClick={reset}> Resetovat
                    </button>
                    {/*<div>
                        <input className={"m-1"} type={"checkbox"} defaultChecked={unicode}
                               onChange={(event) => setUnicode(event.target.checked)}/>
                        Použít unicode
                    </div>*/}
                    Stránka používá <a href={"https://openmoji.org"}>OpenMoji</a>. Licence: <a
                    href={"https://creativecommons.org/licenses/by-sa/4.0/#"}>CC BY-SA 4.0</a>
                </div>
            </>
        )
    }

    const reset = () => {
        setVisitedRooms(initialVisitedRooms);
        setCurrentConnections(getRoom("sparkles").connections.sort(() => .5 - Math.random()))
    };
    /*useEffect(() => {
        reset();
    }, [])*/


    return (
        <div className={"text-4xl flex h-screen"}>
            <div className={"m-auto bg-gray-100 p-1"}>

                {/*<Twemoji options={{folder: "svg", ext: ".svg"}}>*/}

                <Bag/>
                {
                    visitedRooms.length > 0 &&
                    <Doors/>
                }
                <Footnote/>
            </div>
        </div>
    )
}

export default ItemMaze;
