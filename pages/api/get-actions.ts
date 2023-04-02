// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "./errors/error";
import { UserRepo, withUserRepo } from "./repo/users";

const getActions = async (
  req: NextApiRequest & { userRepo: UserRepo },
  res: NextApiResponse<Error | any>
) => {
  // if (req.method !== "GET") {
  //   res.redirect("/");
  //   return;
  // }
  // const userId = req.query.uid;
  // const { userRepo } = req;
  // if (!userId) {
  //   console.log("cannot find uid in request query");
  //   res.status(200).json([]);
  //   return;
  // }
  // // const readStream = fs.createReadStream("data/actions.json");
  // // readStream.pipe(res);
  // const user = userRepo.getAll().find((user) => user.id === userId);
  // console.log("find user", user);
  // return res.status(200).json(user?.actions || []);
};

export default withUserRepo(getActions);
