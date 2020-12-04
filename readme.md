# Check Licenses

A simple tool to check all the licenses in your dependencies:

```bash
$ npm i -g check-licenses
$ licenses
MIT —————————————————⟶ 1328
ISC —————————————————⟶ 113
CC0-1.0 —————————————⟶ 36
BSD-3-Clause ————————⟶ 36
Apache-2.0 ——————————⟶ 5
BSD-2-Clause ————————⟶ 3
Zlib ————————————————⟶ 1
CC-BY-3.0 ———————————⟶ 1
GPL-2.0 —————————————⟶ 1
```

- Check all dependencies for their licenses
- Perform a check both in `package.json` and the `LICENSE` file
- Includes sub-dependencies in the check
- Only production dependencies; you should not be shipping dev dependencies
- Uses `package-lock.json` for deterministic resolution
- Handles multiple versions just fine

Then you can also use it to track down which dependencies have a license you might not like:

```bash
$ licenses --list | grep GPL
node-forge@0.9.0 ——————————⟶ BSD-3-Clause + GPL-2.0
```

With this information you can either:

- Dig deeper: when is it BSD-3-Clause? when is it GPL-2.0?
- Find out where this comes from with `npm ls`:

```bash
$ npm ls node-forge
myproject@0.1.0 /home/francisco/projects/myproject
└─┬ react-scripts@3.4.3
  └─┬ webpack-dev-server@3.11.0
    └─┬ selfsigned@1.10.7
      └── node-forge@0.9.0
```

## Getting started

You can either use `npx check-licenses`, or install this library globally and then run it at once:

```bash
npm i check-licenses -g
licenses   # Note how this is just `licenses`
licenses --list
licenses --help

# OR

npx check-licenses
npx check-licenses --list
npx check-licenses --help
```

## Show the licenses used

The base command is to count how many licenses of each type are in use:

```bash
$ licenses
MIT —————————————————⟶ 1328
ISC —————————————————⟶ 113
CC0-1.0 —————————————⟶ 36
BSD-3-Clause ————————⟶ 36
Apache-2.0 ——————————⟶ 5
BSD-2-Clause ————————⟶ 3
Zlib ————————————————⟶ 1
CC-BY-3.0 ———————————⟶ 1
GPL-2.0 —————————————⟶ 1
```

## List all dependencies

This can be used to find out what each of our dependencies (direct and indirect) is using. It might list multiple licenses in a single package:

```bash
$ licenses --list
...
test-exclude@5.2.3 ————————————⟶ ISC
text-table@0.2.0 ——————————————⟶ MIT
textarea-caret@3.0.2 ——————————⟶ MIT
throat@4.1.0 ——————————————————⟶ MIT
through@2.3.8 —————————————————⟶ Apache-2.0 + MIT
through2@2.0.5 ————————————————⟶ MIT
thunky@1.1.0 ——————————————————⟶ MIT
timers-browserify@2.0.11 ——————⟶ MIT
...
```

This list is normally quite long, but it can be easily `grep`-ed. For example, to find all of the `Apache-2.0` licenses:

```bash
$ licenses --list | grep Apache-2.0
fb-watchman@2.0.1 —————————————⟶ Apache-2.0
forever-agent@0.6.1 ———————————⟶ Apache-2.0
formik@2.1.5 ——————————————————⟶ Apache-2.0 + MIT
harmony-reflect@1.6.1 —————————⟶ Apache-2.0 + MPL-1.1
human-signals@1.1.1 ———————————⟶ Apache-2.0
```

If there are multiple licenses in a library it's marked with a `+`. You can indeed also grep that!

```bash
$ licenses --list | grep +
...
are-we-there-yet@1.1.5 ————————⟶ ISC + MIT
atob@2.1.2 ————————————————————⟶ Apache-2.0 + MIT
detect-node@2.0.4 —————————————⟶ ISC + MIT
electron-to-chromium@1.3.534 ——⟶ ISC + MIT
formik@2.1.5 ——————————————————⟶ Apache-2.0 + MIT
fs.realpath@1.0.0 —————————————⟶ ISC + MIT
harmony-reflect@1.6.1 —————————⟶ Apache-2.0 + MPL-1.1
json-schema@0.2.3 —————————————⟶ AFLv2.1 + BSD
killable@1.0.1 ————————————————⟶ ISC + MIT
lodash-es@4.17.15 —————————————⟶ CC0-1.0 + MIT
lodash.memoize@4.1.2 ——————————⟶ CC0-1.0 + MIT
...
```
