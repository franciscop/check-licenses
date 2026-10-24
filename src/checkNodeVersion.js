import color from "nocolor";

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
    color`Node.js version should be {green}{bright}${version}+{/}, instead {red}{bright}${process.version}{/} found.
➤ Please upgrade Node.js and then try again.
➤ If you are using {bright}nvm{/}, do {reverse} nvm install node --reinstall-packages-from=node {/}
➤ If you are using {bright}brew{/}, do {reverse} brew upgrade node {/}
https://bytearcher.com/articles/ways-to-get-the-latest-node.js-version-on-a-mac/
`
  );
}
