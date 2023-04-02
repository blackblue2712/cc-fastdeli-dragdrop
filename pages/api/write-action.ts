// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { Error } from "./errors/error";
import { ValidationError } from "./errors/ValidationError";
import { UserRepo, withUserRepo } from "./repo/users";

const writeAction = async (
  req: NextApiRequest & { userRepo: UserRepo },
  res: NextApiResponse<Error | any>
) => {
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

  // const writeableStream = fs.createWriteStream("data/actions.json");
  // writeableStream.write(JSON.stringify(data.actions, null, 2));
  // writeableStream.end();

  const { userRepo } = req;

  const users = userRepo.getAll();

  console.log("users", users);

  const foundIndex = users.findIndex((user) => user.id === data.userId);

  console.log("foundIndex", foundIndex);

  if (foundIndex === undefined || foundIndex === -1) {
    res.status(200).end();
  }

  users[foundIndex!] = {
    ...users[foundIndex!],
    actions: data.actions,
  };

  res.status(200).end();
};

export default withUserRepo(writeAction);
