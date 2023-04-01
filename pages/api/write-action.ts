// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { Error } from "./errors/error";
import { ValidationError } from "./errors/ValidationError";

export default async function writeAction(
  req: NextApiRequest,
  res: NextApiResponse<Error | any>
) {
  // TODO: for now we don't have authenticate
  // so export file JSON once and use for every one
  // need to export by user id after implement authenticate

  if (req.method !== "POST") {
    res.redirect("/");
    return;
  }

  const { data } = req.body;

  if (!data) {
    res
      .status(400)
      .json(<Error>ValidationError(v4(), "Expect data in body request"));
  }

  if (!data.actions) {
    res
      .status(400)
      .json(<Error>ValidationError(v4(), "Expect actions data in request"));
  }

  const writeableStream = fs.createWriteStream("./actions.json");
  writeableStream.write(JSON.stringify(data.actions));
  writeableStream.end();

  res.status(200).end();
}
