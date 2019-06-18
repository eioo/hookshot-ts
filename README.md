# hookshot-ts

![](http://i.cloudup.com/i_vGKjtQcY2.png)

"You found the _hookshot_! It's a spring-loaded chain that you can cast out to hook things."

## Intro

**hookshot-ts** is a tiny library and companion CLI tool for handling [GitHub post-receive hooks](https://help.github.com/articles/post-receive-hooks).

This is a fork from [coreh/hookshot](oreh/hookshot) converted to TypeScript.

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
hookshot -p 9001 -s 'echo "pushed to master!"'
```