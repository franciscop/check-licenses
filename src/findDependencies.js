import { exists, list, read, swear } from "files";
import chalk from "chalk";
import os from "os";
import { join } from "path";

// Read a file and parse its content as JSON
const readJson = (file) => read(file).then((res) => JSON.parse(res));

// Get a nice absolute path for the user
const nicePath = (folder) => {
  const home = os.homedir();
  if (folder.startsWith(home)) return folder.replace(home, "~") + "/";
  return folder + "/";
};

// Get the last 2 bits if the path ends on `.../@name/name`, or only
// one if it doesn't have a @ in the second to last item
const getName = (path) => {
  const namespaced = path.split("/").slice(-2).join("/");
  const index = namespaced.startsWith("@") ? -2 : -1;
  return path.split("/").slice(index).join("/");
};

const checkMissingPkg = async (packages) => {
  let missingOptional = 0;

  // Check for any missing `package.json` within the dependencies
  const missing = await swear(packages)
    .filter(async (pkg) => {
      const file = pkg.path;
      if (await exists(file + "/package.json")) return false;
      if (pkg.optional) {
        missingOptional++;
        return false;
      }
      return true;
    })
    .map((pkg) => pkg.path);

  // All good!
  if (!missing.length) return;

  throw new Error(
    chalk`These dependencies are missing their ${chalk.bold("package.json")}:
${missing
  .map((folder) => chalk`➤ ${folder}/{bold package.json} (not found)`)
  .join("\n")}

To {bold.green try to solve} this you can try:
➤ Perform a normal install with {inverse  npm install }
➤ Reinstall all with {inverse  rm -rf node_modules && npm install }`
  );
};

export default async function findDependencies(folder = process.cwd()) {
  const pkgFile = join(folder, "./package.json");
  const lockFile = join(folder, "./package-lock.json");

  if (!(await exists(pkgFile))) {
    const path = nicePath(folder);
    throw new Error(chalk`
You need a ${path}{bold.yellow package.json} to check the licenses. Solutions:
➤ Make sure you are in the right folder
➤ Generate it with {inverse  npm init } first
`);
  }

  if (!(await exists(lockFile))) {
    const path = nicePath(folder);
    throw new Error(chalk`
You need ${path}{bold.yellow package-lock.json} to check the licenses:
➤ Make sure you are in the correct folder
➤ Generate the lock file with {inverse  npm install }
➤ It will make your installs deterministic
➤ You can remove it after the license check
    `);
  }

  // Get the raw package-lock file into a JSON
  const { packages } = await readJson(lockFile);

  if (!packages) {
    throw new Error(chalk`
It seems you are using npm@6 or lower; check-licenses only works with Node.js 16/npm@7 or superior:
➤ Please upgrade your npm version
➤ Use the package "legally" instead to check the licenses

If you already have npm@7 or higher, please report this bug with a copy of your "package-lock.json"
    `);
  }

  const pkgs = Object.entries(packages)
    .filter(([path, { dev }]) => !dev) // Only production dependencies
    .map(([path, { version, optional }]) => ({
      version,
      path,
      optional: Boolean(optional),
    }))
    .filter((pkg) => pkg.path) // Avoid packages with no path
    .map((pkg) => ({
      id: `${getName(pkg.path)}@${pkg.version}`,
      name: getName(pkg.path),
      ...pkg,
    }))
    .filter((pkg, i, all) => i === all.findIndex((p) => p.id === pkg.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  // Check that all packages have their valid package.json
  await checkMissingPkg(pkgs);

  return swear(pkgs).map(async (pkg) => {
    const missing = !(await exists(pkg.path + "/package.json"));
    return { ...pkg, missing };
  });
}
