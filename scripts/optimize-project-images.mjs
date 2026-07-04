import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, extname } from "node:path";
import sharp from "sharp";

const SOURCE_REF = process.env.SOURCE_REF || "";
const MAX_WIDTH = Number(process.env.MAX_WIDTH || 1920);
const EXTENSIONS = /\.(png|jpe?g)$/i;

function listSourceFiles() {
  if (SOURCE_REF) {
    return execFileSync("git", ["-c", "core.quotePath=false", "ls-tree", "-r", "--name-only", SOURCE_REF, "asset/project"], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 20,
    })
      .split("\n")
      .filter((file) => EXTENSIONS.test(file));
  }

  return execFileSync("find", ["asset/project", "-type", "f"], { encoding: "utf8" })
    .split("\n")
    .filter((file) => EXTENSIONS.test(file));
}

function readSource(file) {
  if (SOURCE_REF) {
    return execFileSync("git", ["show", `${SOURCE_REF}:${file}`], { maxBuffer: 1024 * 1024 * 80 });
  }

  return readFileSync(file);
}

async function optimize(file) {
  const source = readSource(file);
  const image = sharp(source, { animated: false, limitInputPixels: false });
  const metadata = await image.metadata();
  const isTallScreenshot = metadata.height && metadata.width && metadata.height / metadata.width > 2.4;
  const quality = isTallScreenshot ? 88 : 86;
  const outputPath = file.replace(extname(file), ".webp");

  mkdirSync(dirname(outputPath), { recursive: true });

  let pipeline = image.rotate();

  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await pipeline
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  return { file, outputPath, sourceWidth: metadata.width, sourceHeight: metadata.height, quality };
}

const files = listSourceFiles();
const results = [];

for (const file of files) {
  results.push(await optimize(file));
}

for (const result of results) {
  console.log(
    `${result.outputPath}\tfrom ${result.sourceWidth}x${result.sourceHeight}\tq${result.quality}`
  );
}

console.log(`Optimized ${results.length} project images to WebP.`);
