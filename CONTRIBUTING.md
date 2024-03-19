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

## Publishing pangea-node-sdk

Publishing pangea-node-sdk to the npm registry is handled via a private GitLab
CI pipeline. This pipeline is triggered when a Git tag is pushed to the
repository. Git tags should be formatted as `pangea-node-sdk/vX.Y.Z`, where
`vX.Y.Z` is the [Semantic Versioning][]-compliant version number to publish.

1. Update the `"version"` field in `packages/pangea-node-sdk/package.json`.
2. Update the `version` constant in `packages/pangea-node-sdk/src/config.ts`.
3. Update the release notes in `packages/pangea-node-sdk/CHANGELOG.md`.
4. Author a commit with this change and land it on a remote branch.
5. `git tag -m pangea-node-sdk/vX.Y.Z pangea-node-sdk/vX.Y.Z 0000000`. Replace
   `vX.Y.Z` with the new version number and `0000000` with the commit SHA from
   the previous step.
6. `git push --tags origin <branch>`.

From here the GitLab CI pipeline will pick up the pushed Git tag and publish
the package to the npm registry.

## Contributors:

- Andrés Tournour (andres.tournour@gmail.com). Code.
- Glenn Gallien (glenn.gallien@pangea.cloud). Code and docs.
- David Wayman (david.wayman@pangea.cloud). Code and docs.

[Semantic Versioning]: https://semver.org/
