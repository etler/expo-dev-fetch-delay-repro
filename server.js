const { Readable } = require("node:stream");
const { setTimeout } = require("node:timers/promises");
const Koa = require("koa");

const port = process.env.PORT ?? 3000;

const app = new Koa();

app.use(async (ctx) => {
  const responseStream = new Readable({ read() {} });
  ctx.type = "text/plain";
  ctx.body = responseStream;
  (async () => {
    for (let i = 0; i < 10; i++) {
      await setTimeout(1000);
      console.log(`Pushing ${i}`);
      responseStream.push(`${i}`);
    }
    responseStream.push(null);
  })();
});

app.listen(port);

console.info(`Server started on port ${port}`);
