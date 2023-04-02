const app = require("express")();

class UserRepo {
  users = [];
  constructor() {}

  add(user) {
    const foundIndex = this.users.findIndex((u) => u.id === user.id);
    if (foundIndex !== -1) {
      console.log("founded user!", this.users[foundIndex]);
      return this.users[foundIndex];
    }

    this.users.push(user);

    return user;
  }

  getAll() {
    return this.users;
  }
}

const userRepo = new UserRepo();

app.get("/actions.json", (req, res) => {
  const userId = req.query.uid;

  if (!userId) {
    console.log("cannot find uid in request query");
    res.status(200).json([]);
    return;
  }

  // const readStream = fs.createReadStream("data/actions.json");
  // readStream.pipe(res);

  const user = userRepo.getAll().find((user) => user.id === userId);

  return res.status(200).json(user?.actions || []);
});

app.get("/api/get-actions", (req, res) => {
  const userId = req.query.uid;
  console.log("/api/get-actions", req.query, userRepo.getAll());

  if (!userId) {
    console.log("cannot find uid in request query");
    res.status(200).json([]);
    return;
  }

  // const readStream = fs.createReadStream("data/actions.json");
  // readStream.pipe(res);

  const user = userRepo.getAll().find((user) => user.id === userId);

  console.log("find user", user);

  return res.status(200).json(user?.actions || []);
});

app.post("/api/set-user", (req, res) => {
  userRepo.add({ id: req.body.data.userId });
  console.log("userRepo", userRepo.getAll());

  res.status(200).json({});
});

app.post("/api/write-action", (req, res) => {
  // TODO: for now we don't have authenticate
  // so export file JSON once and use for every one
  // need to export by user id after implement authenticate

  const { data } = req.body;

  // if (!data) {
  //   res
  //     .status(400)
  //     .json(ValidationError(v4(), "Expect data in body request"));
  // }

  // if (!data.actions) {
  //   res
  //     .status(400)
  //     .json(<Error>ValidationError(v4(), "Expect actions data in request"));
  // }

  // const writeableStream = fs.createWriteStream("data/actions.json");
  // writeableStream.write(JSON.stringify(data.actions, null, 2));
  // writeableStream.end();

  const users = userRepo.getAll();

  const foundIndex = users.findIndex((user) => user.id === data.userId);

  if (foundIndex === undefined || foundIndex === -1) {
    res.status(200).end();
    return;
  }

  users[foundIndex] = {
    ...users[foundIndex],
    actions: data.actions,
  };

  res.status(200).json(data.actions);
});

module.exports = app;
