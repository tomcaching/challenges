import { createChallenge, Grid, Position, positionEquals, validationErrors } from "@/components/utils/starsUtils";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (request: NextApiRequest, response: NextApiResponse) => {
    const {stars} = JSON.parse(request.body);

    const challenge = createChallenge();
    const updatedGrid: Grid = {
        cells: challenge.grid.cells.map(cell => ({...cell, star: stars.some((star: Position) => positionEquals(star, cell.position))})),
        size: challenge.grid.size,    
    }

    if (stars.length < challenge.grid.size * 2 || validationErrors(updatedGrid).length > 0) {
        response.status(422).send("Nope");
        return;
    }

    response.status(200).send(process.env.STARS_ANSWER);
};

export default handler;