# TODO

TODO

## Usage

``` r
bassoonplayer(
  file,
  width = "200px",
  height = "50px",
  labels = list(play = "Play", pause = "Pause", stop = "Stop"),
  class = "bassoon-btn btn btn-sm",
  elementId = NULL,
  ...
)
```

## Arguments

- file:

  TODO

- width, height:

  TODO

- labels:

  TODO

- class:

  TODO

- elementId:

  TODO

- ...:

  TODO

## Value

TODO

## Examples

``` r
if (interactive()) {
  fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
  bassoonplayer(fl)
}
```
