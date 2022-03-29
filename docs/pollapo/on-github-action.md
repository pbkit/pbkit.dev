You can use `pollapo install` in github action.

[riiid/pollapo-install](https://github.com/riiid/pollapo-install)

Here is an example of workflow using `pollapo-install` action.

```yaml
- name: Pollapo Install
  uses: riiid/pollapo-install@v1
  with:
    token: ${{ secrets.GITHUB_OAUTH_TOKEN }}  # Required for pulling from Gihtub repository
    out-dir: .pollapo  # Optional. defaults to .pollapo
    config: pollapo.yml  # Optional. defaults to pollapo.yml
    working-directory: .  # Optional. defaults to .
```
