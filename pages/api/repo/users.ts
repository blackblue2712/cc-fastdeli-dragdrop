import { NextApiRequest, NextApiResponse } from "next";

export class UserRepo {
  private users: Array<Record<any, any>> = [];
  constructor() {
    console.log("aaaa run constructor UserRepo =====");
  }

  public add(user: Record<any, any>) {
    this.users.push(user);

    return user;
  }

  public getAll() {
    return this.users;
  }
}

const userRepoSingleton = (() => {
  let instance: UserRepo;

  function createInstance() {
    const userRepo = new UserRepo();
    return userRepo;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
})();

const userRepo = userRepoSingleton.getInstance();

export const withUserRepo =
  (handler: any) => (req: NextApiRequest, res: NextApiResponse) => {
    (req as any).userRepo = userRepo;
    return handler(req, res);
  };
