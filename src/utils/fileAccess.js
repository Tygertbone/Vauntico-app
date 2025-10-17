import fs from "fs";

export function readFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    console.error("❌ Failed to read file:", err);
    return null;
  }
}

export function writeFile(path, content) {
  try {
    fs.writeFileSync(path, content, "utf8");
    console.log(`✅ File written: ${path}`);
  } catch (err) {
    console.error("❌ Failed to write file:", err);
  }
}

export function appendFile(path, content) {
  try {
    fs.appendFileSync(path, content + "\n", "utf8");
    console.log(`📜 Scroll appended to: ${path}`);
  } catch (err) {
    console.error("❌ Failed to append scroll:", err);
  }
}