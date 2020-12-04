import chalk from "chalk";

export default function checkVersion(version, exist = process.version) {
  const expect = version
    .replace(/^v/, "")
    .split(".")
    .map((p) => +p);
  const curr = exist
    .replace(/^v/, "")
    .split(".")
    .map((p) => +p);

  if (curr[0] > expect[0]) return;
  if (curr[0] === expect[0] && curr[1] > expect[1]) return;
  if (curr[0] === expect[0] && curr[1] === expect[1] && curr[2] >= expect[2]) {
    return;
  }

  throw new Error(
    chalk`Node.js version should be {green.bold ${version}+}, instead {red.bold ${process.version}} found.
➤ Please upgrade Node.js and then try again.
➤ If you are using {bold nvm}, do {inverse  nvm install node --reinstall-packages-from=node }
➤ If you are using {bold brew}, do {inverse  brew upgrade node }
https://bytearcher.com/articles/ways-to-get-the-latest-node.js-version-on-a-mac/
`
  );
}
