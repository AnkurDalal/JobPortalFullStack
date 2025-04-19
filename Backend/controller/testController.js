export const testPostController = (req, resp) => {
  const { name } = req.body;
  resp.send(`My name is ${name}`);
  console.log(name);
};
