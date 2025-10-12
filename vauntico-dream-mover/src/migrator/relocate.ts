import fs from "fs-extra";
import path from "path";

export async function relocatePath(src: string, destRoot: string) {
  const dest = path.join(destRoot, path.basename(src));
  await fs.ensureDir(destRoot);
  await fs.copy(src, dest, { overwrite: true, errorOnExist: false });
  // swap: remove original after successful copy
  await fs.remove(src);
  return { src, dest };
}
