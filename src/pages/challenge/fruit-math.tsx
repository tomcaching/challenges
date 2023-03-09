import { Challenge, type Variable } from "@/components/components/FruitMath/Challenge";
import { MathJaxContext } from "better-react-mathjax";
import Head from "next/head";
import { FC, useState } from "react";

type ChallengeDefinition = {
    math: string;
    formula: string;
    variables: Array<Variable>;
};

const challenges: Array<ChallengeDefinition> = [
    {
        math: "\\(🍏 + 5 = 15\\)",
        formula: "x + 5 == 15",
        variables: [
            {
                emoji: "🍏",
                letter: "x"
            }
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
                            <div key={i} className={`${currentChallenge === i ? "visible" : "invisible"} flex flex-col items-center gap-10`}>
                                <Challenge math={challenge.math} formula={challenge.formula} variables={challenge.variables} onSolved={() => moveToNextChallenge()} />
                            </div>
                        ))
                    }
                </main>
            </MathJaxContext>
        </>
    );
};

export default FruitMath;