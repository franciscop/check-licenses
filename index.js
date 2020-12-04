import { list, read, swear } from "files";
import meow from "meow";
import chalk from "chalk";

import findDependencies from "./findDependencies.js";

const cli = meow();

const unique = (value, index, self) => self.indexOf(value) === index;

const pkgLicense = (pkg) => {
  let license = pkg.licenses || pkg.license || [];

  // { type: 'MIT' } => 'MIT'
  if (license.type) {
    license = license.type;
  }

  // Convert any kind of license to an array of licenses
  if (Array.isArray(license)) {
    // [{ type: 'MIT' }, 'ISC'] => ['MIT', 'ISC']
    license = license.filter(Boolean).map((lic) => lic.type || lic);

    // ['MIT', 'ISC'] => 'MIT OR ISC'
    license = license.join(" OR ");
  }

  // '(MIT OR ISC)' => 'MIT OR ISC'
  license = license.replace(/\(/g, "").replace(/\)/g, "");

  return license
    .split(/\W+(?:OR|AND)\W+/gi) // https://stackoverflow.com/q/21419530/938236
    .filter(Boolean)
    .filter(unique);
};

const fileLicense = async (pkg) => {
  const licFile = await list(pkg.path)
    // .map((file) => file.replace(process.cwd() + "/", ""))
    .find((file) => /licen(s|c)e/i.test(file.split("/").pop()));
  if (!licFile) return [];
  const text = await read(licFile);
  if (/(The )*MIT License/i.test(text)) return ["MIT"];
  if (/(The )*ISC License/i.test(text)) return ["ISC"];
  if (/Apache License\s+Version 2.0/i.test(text)) return ["Apache-2.0"];
  if (/apache\.org\/licenses\/LICENSE-2.0/i.test(text)) return ["Apache-2.0"];
  if (/BSD 2-Clause License/i.test(text)) return ["BSD-2-Clause"];
  if (/BSD 3-Clause License/i.test(text)) return ["BSD-3-Clause"];
  if (/creativecommons.org\/publicdomain\/zero\/1.0/i.test(text)) {
    return ["CC0-1.0"];
  }
  if (
    /This is free and unencumbered software released into the public domain/.test(
      text
    )
  ) {
    return ["Unlicense"];
  }
  if (
    /Permission is hereby granted, free of charge, to any person obtaining a copy\s+of this software and associated documentation files/.test(
      text
    )
  ) {
    return ["MIT"];
  }
  if (
    /THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS/.test(
      text
    )
  ) {
    return ["MIT"];
  }
  return [];
};

(async () => {
  // Find all the required dependencies
  const packages = await findDependencies(process.cwd(), {
    package: "required",
  });

  const pkgs = await swear(packages).map(async (pkg) => {
    const pkgSrc = pkg.path + "/package.json";

    // Can find a package.json
    const info = await read(pkgSrc).then((data) => JSON.parse(data));

    // We have a better name to display if we find the package.json:
    pkg.name = info.name;
    pkg.version = info.version;
    pkg.package = pkgLicense(info);

    pkg.file = await fileLicense(pkg);

    // pkg.readme = await readmeLicense(pkg);

    // pkg.all = [...pkg.package, ...pkg.file, ...pkg.readme].filter(unique);
    pkg.all = [...pkg.package, ...pkg.file].filter(unique).sort();

    return pkg;
  });

  if (cli.flags.list) {
    pkgs
      .map((pkg) => {
        const title = pkg.id.length >= 39 ? pkg.id.slice(0, 38) + "…" : pkg.id;
        const dots = chalk.gray(title.padEnd(40, "—").replace(title, "") + "⟶");
        const licenses = pkg.all.join(chalk.bold.magenta(" + "));
        return `${title} ${dots} ${licenses}`;
      })
      .map((line) => console.log(line));
  } else {
    Object.entries(
      pkgs
        .map((pkg) => pkg.all)
        .flat()
        .reduce((all, name) => ({ ...all, [name]: (all[name] || 0) + 1 }), {})
    )
      .sort(([k1, v1], [k2, v2]) => v2 - v1)
      .filter(([k]) => k !== "-")
      .forEach(([key, value]) => {
        // console.log(`${key}: ${value}`);

        const title = key.length >= 19 ? key.slice(0, 18) + "…" : key;
        const dots = chalk.gray(title.padEnd(20, "—").replace(title, "") + "⟶");
        const licenses = value;
        console.log(`${title} ${dots} ${licenses}`);
      });
  }
})().catch((error) => {
  console.log(chalk`{red.bold Error:} ${error.message.trim()}`);
});
