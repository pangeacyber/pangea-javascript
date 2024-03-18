# Contributing

Currently, the setup scripts only have support for Mac/ZSH environments.
Future support is incoming.

To install our linters, simply run `./dev/setup_repo.sh`
These linters will run on every `git commit` operation.

## Generating Node.js SDK Docs

We use TypeDoc to pull doc strings from all the files in our SDK. To generate
the `docs.json`:

```bash
$ cd packages/pangea-node-sdk
$ yarn install
$ yarn generate:docs
```

## Contributors:

- Andrés Tournour (andres.tournour@gmail.com). Code.
- Glenn Gallien (glenn.gallien@pangea.cloud). Code and docs.
- David Wayman (david.wayman@pangea.cloud). Code and docs.
