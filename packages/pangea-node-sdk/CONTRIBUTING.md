List of contributors:

- Andrés Tournour (andres.tournour@gmail.com). Code.
- Glenn Gallien (glenn.gallien@pangea.cloud). Code and docs.
- David Wayman (david.wayman@pangea.cloud). Code and docs.

## Generating Node SDK Docs

We use TypeDoc to pull doc strings from all the files in our SDK.

To generate the docs.json, from the root of the pangea-node-sdk repo run:

```
# install node modules if you haven't already
yarn

# generate the docs JSON file
yarn generate:docs
```

This generates a JSON file (docs.json) which contains all our doc strings.
