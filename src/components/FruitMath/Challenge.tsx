import { MathJax } from "better-react-mathjax";
import { FC, useState } from "react";

export type Variable = {
    emoji: string;
    letter: string;
}

export type ChallengeProps = {
    math: string;
    formula: string;
    variables: Array<Variable>;
    onSolved?: () => void;
};

export const Challenge: FC<ChallengeProps> = ({ math, formula, variables, onSolved }: ChallengeProps) => {
    const [values, setValues] = useState<Record<string, number>>({});
    const [error, setError] = useState<boolean>(false);

    const filled = variables.map(variable => variable.letter).every(variable => Object.keys(values).includes(variable));

    const setVariableValue = (variable: string, value: number) => {
        if (Number.isNaN(value)) {
            return;
        }

        setError(false);
        setValues(current => ({ ...current, [variable]: value }));
    };

    const checkResult = () => {
        const resolved = Object.entries(values).reduce((result, [variable, value]) => { return result.replaceAll(variable, value.toFixed(0)); }, formula);
        const fallback = variables.map(variable => variable.letter).reduce((result, variable) => result.replaceAll(variable, "0"), resolved);

        if (eval(fallback) === true) {
            onSolved && onSolved();
            return;
        }

        setError(true);
    };

    return (
        <>
            <MathJax className="text-6xl">{math}</MathJax>
            <div className="flex flex-col items-center justify-center w-1/3 bg-red-100">
                {
                    variables.map((variable, i) => (
                        <div className={`flex flex-row items-center gap-4 border px-4 rounded-xl transition-all ${error && "border-red-500 text-red-500"}`} key={i}>
                            <div>{variable.emoji}</div>
                            <input type="number" className="py-2 outline-none" value={values[variable.letter] ?? 0} onChange={(event) => setVariableValue(variable.letter, event.target.valueAsNumber)} />
                        </div>
                    ))
                }
            </div>
            <button disabled={!filled} onClick={() => checkResult()}
                className="px-4 py-2 rounded-xl bg-black text-white cursor-pointer uppercase text-sm tracking-wider font-bold disabled:bg-neutral-200 disabled:text-neutral-300">
                Zkontrolovat výsledek
            </button>
        </>
    );
};