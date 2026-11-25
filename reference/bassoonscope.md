# Oscilloscope Visualiser for BassoonTracker

Renders a real-time Web Audio oscilloscope bound to an existing
[`bassoonplayer`](https://pepijn-devries.github.io/bassoonplayer/reference/bassoonplayer.md)
widget.

## Usage

``` r
bassoonscope(
  playerId,
  channel = NULL,
  width = NULL,
  height = NULL,
  elementId = NULL
)
```

## Arguments

- playerId:

  The `elementId` of the target `bassoonplayer` widget.

- channel:

  Optional integer channel number (1-based, e.g. `1` to `4` for
  ProTracker modules) to visualize a single track. If `NULL` (default),
  visualizes the mixed master audio output.

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
      bassoonscope(playerId = "my_player", width = 300, height = 80)
    )
  )
}
```
