import glob from "glob-promise";
import fs from "fs";
import zlib from "zlib";

async function run() {
  const files = await glob("dist/browser/**/*.js");
  for (const file of files) {
    const readFileName = file;
    const writeFileName = file + ".br";

    console.log({ readFileName, writeFileName });

    // Create read and write streams
    const readStream = fs.createReadStream(readFileName);
    const writeStream = fs.createWriteStream(writeFileName);

    // Create brotli compress object
    const brotli = zlib.createBrotliCompress({
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
      },
    });

    // Pipe the read and write operations with brotli compression
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on("finish", () => {
      console.log("Done compressing 😎", file);
    });
  }
  for (const file of files) {
    const readFileName = file;
    const writeFileName = file + ".gzip";

    console.log({ readFileName, writeFileName });

    // Create read and write streams
    const readStream = fs.createReadStream(readFileName);
    const writeStream = fs.createWriteStream(writeFileName);

    // Create brotli compress object
    const gzip = zlib.createDeflate({ level: 9 });

    // Pipe the read and write operations with brotli compression
    const stream = readStream.pipe(gzip).pipe(writeStream);

    stream.on("finish", () => {
      console.log("Done compressing 😎", file);
    });
  }
}

run();
