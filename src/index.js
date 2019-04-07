const Tesseract = require("tesseract.js");
const fs = require("fs");
const Koa = require("koa");
const koaBody = require("koa-body");
const app = new Koa();

// codesandbox use port 8080
const PORT = process.env.PORT || 8080;

app.use(koaBody({ multipart: true }));

// response
app.use(async (ctx, next) => {
  if (ctx.method !== "POST") {
    return await next();
  }

  if (ctx.request.files) {
    const { file } = ctx.request.files;
    const image = await fs.readFileSync(file.path);
    await Tesseract.recognize(image).then(result => {
      ctx.body = result.html;
    });
  }
});

app.use(ctx => {
  ctx.body = "Hello World! Here is the OCR api";
});

app.listen(PORT);

module.exports = app.callback();
