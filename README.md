_This repository is fork of [hookshot](https://github.com/coreh/hookshot) from GitHub user [coreh](https://github.com/coreh)._

_Main goal of this project is to migrate the codebase from JavaScript to TypeScript_ 

# hookshot-ts

![](http://i.cloudup.com/i_vGKjtQcY2.png)

"You found the _hookshot_! It's a spring-loaded chain that you can cast out to hook things."

## Intro

**hookshot-ts** is a tiny library and companion CLI tool for handling [GitHub post-receive hooks](https://help.github.com/articles/post-receive-hooks).

## Installation & building

```bash
npm install
npm run start  # Run once with ts-node
npm run dev    # Development mode
```

If you want to build binaries you need to install `pkg` package globally with npm.

To start the build process, run: `npm run build`

### Binary downloads

Look up this GitHub's release page for downloads.

### CLI Tools

The CLI tool takes as argument a command to execute upon GitHub post-receive hook:

```bash
hookshot 'echo "PUSHED!"'
```

You can specify following options:

- HTTP port via the `-p` flag (default: 3000)
- Webhook path via the `-w` flag (default: "/")
- Run command on startup with `-s`

```bash
hookshot -p 9001 -s 'git pull origin master && npm install && npm start'
```
