# A Mod Player

``` r

library(bassoonplayer)
fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
htmltools::browsable(
  htmltools::tagList(
    bassoonplayer(fl,
                  labels = list(play = "pl", pause = "pa", stop = "sp"),
                  elementId = "my_player"),
    bassoonscope("my_player", 1L, width = "100px", height = 80),
    bassoonscope("my_player", 2L, width = "100px", height = 80),
    bassoonscope("my_player", 3L, width = "100px", height = 80),
    bassoonscope("my_player", 4L, width = "100px", height = 80)
  )
)
```
