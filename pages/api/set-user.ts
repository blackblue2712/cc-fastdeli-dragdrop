// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "./errors/error";
import { UserRepo, withUserRepo } from "./repo/users";

const getActions = async (
  req: NextApiRequest & { userRepo: UserRepo },
  res: NextApiResponse<Error | any>
) => {
  if (req.method !== "POST") {
    res.redirect("/");
    return;
  }

  const { userRepo } = req;
  userRepo.add({ id: req.body.data.userId });

  res.status(200).json({});
};

export default withUserRepo(getActions);
