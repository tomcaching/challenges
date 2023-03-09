import { MathJax } from "better-react-mathjax";
import { FC, useState } from "react";

export type Variable = {
    emoji: string;
    letter: string;
}

export type ChallengeProps = {
    formula: string;
    math: Array<string>;
    variables: Array<Variable>;
    hintLink?: string;
    onSolved?: () => void;
};

export const Challenge: FC<ChallengeProps> = ({ math, formula, variables, hintLink, onSolved }: ChallengeProps) => {
    const [values, setValues] = useState<Record<string, number>>({});
    const [error, setError] = useState<boolean>(false);

    const filled = variables.map(variable => variable.letter).every(variable => Object.keys(values).includes(variable));

    const setVariableValue = (variable: string, value: string) => {
        if (Number.isNaN(Number(value)) && value !== "") {
            return;
        }

        setError(false);
        setValues(current => ({ ...current, [variable]: Number(value) }));
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
            {
                math.map((latex,i) => <MathJax className="text-6xl" key={i}>{latex}</MathJax>)
            }
            {
                hintLink && (<a href={hintLink} target="_blank" className="text-[#0000ff] underline">Mohlo by se hodit</a>)
            }
            <div className="flex flex-col items-center justify-center w-1/3 gap-2">
                {
                    variables.map((variable, i) => (
                        <div className={`flex flex-row items-center gap-4 border px-4 rounded-xl transition-all ${error && "border-red-500 text-red-500"}`} key={i}>
                            <div>{variable.emoji}</div>
                            <input type="text" className="py-2 outline-none" value={values[variable.letter] ?? ""} onChange={(event) => setVariableValue(variable.letter, event.target.value)} />
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