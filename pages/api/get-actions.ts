// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "./errors/error";

export default async function writeAction(
  req: NextApiRequest,
  res: NextApiResponse<Error | any>
) {
  if (req.method !== "GET") {
    res.redirect("/");
    return;
  }

  const readStream = fs.createReadStream("./actions.json");

  readStream.pipe(res);
}