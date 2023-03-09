import { Challenge, type Variable } from "@/components/components/FruitMath/Challenge";
import { MathJaxContext } from "better-react-mathjax";
import Head from "next/head";
import { FC, useState } from "react";

type ChallengeDefinition = {
    math: Array<string>;
    formula: string;
    variables: Array<Variable>;
    hintLink?: string;
};

const challenges: Array<ChallengeDefinition> = [
    {
        math: ["\\(🍏 + 5 = 15\\)"],
        formula: "x + 5 == 15",
        variables: [
            {
                emoji: "🍏",
                letter: "x"
            }
        ]
    },
    {
        math: [
            "\\(5🍉 + 4🍋 = 255\\)",
            "\\(10🍉 - 5🍋 = 185\\)"
        ],
        formula: "5*x + 4*y == 255 && 10*x - 5*y == 185",
        variables: [
            {
                emoji: "🍉",
                letter: "x"
            },
            {
                emoji: "🍋",
                letter: "y"
            }
        ]
    },
    {
        math: ["\\(\\frac{🍓}{🍌 + 🍍} + \\frac{🍌}{🍓 + 🍍} + \\frac{🍍}{🍌 + 🍓} = 4\\)"],
        formula: "(BigInt(x)/(BigInt(y) + BigInt(z))) + (BigInt(y)/(BigInt(x) + BigInt(z))) + (BigInt(z)/(BigInt(x)+BigInt(y))) === BigInt(4)",
        hintLink: "https://ami.uni-eszterhazy.hu/uploads/papers/finalpdf/AMI_43_from29to41.pdf",
        variables: [
            {
                emoji: "🍓",
                letter: "x"
            },
            {
                emoji: "🍌",
                letter: "y"
            },
            {
                emoji: "🍍",
                letter: "z"
            },
        ]
    }
];

const FruitMath: FC = () => {
    const [currentChallenge, setCurrentChallenge] = useState<number>(0);
    const moveToNextChallenge = () => {
        if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(current => current + 1);
            return;
        }

        window.alert("yoooo");
        // Get mystery cache solution
    };

    return (
        <>
            <Head>
                <title>🍏 + 3&times;🍒 - 2&times;🍑 = ?</title>
            </Head>
            <MathJaxContext>
                <main className="flex flex-col items-center justify-center min-h-screen">
                    {
                        challenges.map((challenge, i) => (
                            <div key={i} className={`${currentChallenge === i ? "block" : "hidden"} flex flex-col items-center gap-10`}>
                                <Challenge math={challenge.math} formula={challenge.formula} variables={challenge.variables} hintLink={challenge.hintLink} onSolved={() => moveToNextChallenge()}/>
                            </div>
                        ))
                    }
                </main>
            </MathJaxContext>
        </>
    );
};

export default FruitMath;