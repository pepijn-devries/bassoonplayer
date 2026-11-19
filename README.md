
<!-- README.md is generated from README.Rmd. Please edit that file -->

# bassoonplayer

Wraps the core functions of the [BassoonTracker
JavaScript](https://github.com/steffest/bassoontracker) by
[Steffest](https://www.stef.be/) in the form of HTML widgets. It allows
you to play ‘mod’ and ‘xm’ tracker files in R, or embed a player in a
[Shiny app](https://shiny.posit.co/).

<!-- badges: start -->

[![Lifecycle:
experimental](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://lifecycle.r-lib.org/articles/stages.html#experimental)
<!-- badges: end -->

TODO

## Installation

You can install the development version of bassoonplayer from
[GitHub](https://github.com/) with:

``` r
# install.packages("pak")
pak::pak("pepijn-devries/bassoonplayer")
```

## Example

The code below will open a small ‘mod’ Tracker player in the viewer.

``` r
library(bassoonplayer)
mod_file <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
bassoonplayer(mod_file)
```
