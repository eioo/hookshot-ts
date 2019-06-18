# hookshot-ts

![](http://i.cloudup.com/i_vGKjtQcY2.png)

"You found the _hookshot_! It's a spring-loaded chain that you can cast out to hook things."

## Intro

**hookshot-ts** is a tiny library and companion CLI tool for handling [GitHub post-receive hooks](https://help.github.com/articles/post-receive-hooks).

This is a fork from [coreh/hookshot](oreh/hookshot) converted to TypeScript.

## Installation & building

```
pnpm install
pnpm build
```

### Adding to path

**Windows:**

Add `bin/` folder to your path. After that you can call `hookshot` straight from command prompt.

**Linux:**

- `chmod +x bin/hookshot.sh`
- `ln -s /hookshot-ts/bin/hookshot.sh /usr/bin/hookshot`

Now you can use `hookshot` from your shell.

### CLI Tool

The CLI tool takes as argument a command to execute upon GitHub post-receive hook:

```bash
hookshot 'echo "PUSHED!"'
```

You can specify following options:

- HTTP port via the `-p` flag (defaults to 3000)
- Webhook path via the `-w` flag (defaults to `/`)
- Run action on startup with `-s`

```bash
hookshot -p 9001 -s 'git pull origin master && pnpm install && pnpm start'
```
