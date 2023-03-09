import { computePerfectCircleScore } from "@/components/utils/perfectCircleUtils";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (request: NextApiRequest, response: NextApiResponse) => {
    const {points, center} = JSON.parse(request.body);
    const score = computePerfectCircleScore(points, center);

    if (!score.isClockwise || !score.isComplete || score.similarity < 0.98) {
        response.status(422).send("Nope");
        return;
    }

    response.status(200).send(process.env.PERFECT_CIRCLE_ANSWER);
};

export default handler;