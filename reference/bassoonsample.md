# Sample Visualiser for BassoonTracker

TODO

## Usage

``` r
bassoonsample(
  playerId,
  sample = NULL,
  width = NULL,
  height = NULL,
  elementId = NULL
)
```

## Arguments

- playerId:

  The `elementId` of the target `bassoonplayer` widget.

- sample:

  TODO

- width, height:

  Must be a valid CSS unit (like `"100%"`, `"300px"`) or a number, which
  will be coerced to a string and have `"px"` appended.

- elementId:

  Optional HTML element ID for the oscilloscope container.

## Value

TODO

## Examples

``` r
if (interactive() && requireNamespace("htmltools")) {
  fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
  htmltools::browsable(
    htmltools::tagList(
      bassoonplayer("C:/Users/vries171/Downloads/cyberrid.mod",
                    labels = list(play = "pl", pause = "pa", stop = "sp"),
                    elementId = "my_player"),
      bassoonsample(playerId = "my_player", 2, width = "100%", height = 80)
    )
  )
}
```
