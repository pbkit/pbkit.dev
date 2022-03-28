## Login first

After installing the `pollapo` cli, you have to login to the Github using `pollapo`.  
`pollapo` will install protobuf packages in Github repository.

```bash
pollapo login
```

## Add pollapo.yml

For setup pollapo, create `pollapo.yml` file in your project root.
Here is the example of `pollapo.yml` with just one protobuf package. The below means that the repository `interface-pingpong-server` in `pbkit` organization(or user) on `main` branch will be installed.

```yaml
deps:
  - pbkit/interface-pingpong-server@main
```

## Install protobuf packages

Then you can install the protobuf packages with `pollapo install`. You can find installed protobuf packages in `.pollapo` directory.

After the `pollapo install`, the lock hash of the packages will be printed in `pollapo.yml`.
(The hash can be different!) This will resolve the version issue of the packages when you re-install deps with branch name.

```yaml
deps:
  - pbkit/interface-pingpong-server@main
root:
  lock:
    pbkit/interface-pingpong-server@main: 58425678c6284305dd09130075cecb54a3a3d32c
```

Perfect! Now you can use `pb` cli to compile the protobuf schema.
