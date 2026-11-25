# Shiny bindings for bassoonsample

Output and render functions for using bassoonscope within Shiny
applications and interactive Rmd documents.

Output and render functions for using bassoonscope within Shiny
applications and interactive Rmd documents.

## Usage

``` r
bassoonsampleOutput(outputId, width = "100%", height = "80px")

renderBassoonsample(expr, env = parent.frame(), quoted = FALSE)

bassoonscopeOutput(outputId, width = "100%", height = "80px")

renderBassoonscope(expr, env = parent.frame(), quoted = FALSE)
```

## Arguments

- outputId:

  Output variable to read from.

- width, height:

  Must be a valid CSS unit or a number.

- expr:

  An expression that generates a bassoonscope.

- env:

  The environment in which to evaluate `expr`.

- quoted:

  Is `expr` a quoted expression (with
  [`quote()`](https://rdrr.io/r/base/substitute.html))?
