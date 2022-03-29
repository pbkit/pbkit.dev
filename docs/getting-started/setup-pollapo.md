## Login first

After installing the `pollapo` cli, you have to login to the Github using
`pollapo`.\
`pollapo` installs your protobuf packages from Github repository.

```bash
pollapo login
```

## Install protobuf dependency

For add dependency, you have to just
`pollapo add <package-name>@<version|branch|commit>` and say yes to the
`pollapo` cli to create new `pollapo.yml` file. Here is an example:

```bash
pollapo add pbkit/interface-pingpong-server@main
```

Now you can see the `pollapo.yml` file in your project root.

```yaml
deps:
  - pbkit/interface-pingpong-server@main
root:
  lock:
    pbkit/interface-pingpong-server@main: 58425678c6284305dd09130075cecb54a3a3d32c
```

The dependency infos and the lock hash of the packages will be printed in
`pollapo.yml`. (The hash can be different!) This will resolve the version issue
of the packages when you re-install deps with branch name.

## Installed protobuf packages

Use `pollapo install` to re-install your all deps. You can find installed
protobuf packages in `.pollapo` directory.

If you want to update your lock version of dependency, just remove the lock line
and re-install with `pollapo install`.

Perfect! Now you can use `pb` cli to compile the protobuf schema.
