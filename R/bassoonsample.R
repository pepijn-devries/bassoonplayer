#' Sample Visualiser for BassoonTracker
#'
#' TODO
#'
#' @param playerId The \code{elementId} of the target \code{bassoonplayer} widget.
#' @param sample TODO
#' @param width,height Must be a valid CSS unit (like \code{"100\%"}, \code{"300px"})
#'   or a number, which will be coerced to a string and have \code{"px"} appended.
#' @param elementId Optional HTML element ID for the oscilloscope container.
#' @returns TODO
#' @examples
#' if (interactive() && requireNamespace("htmltools")) {
#'   fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
#'   htmltools::browsable(
#'     htmltools::tagList(
#'       bassoonplayer("C:/Users/vries171/Downloads/cyberrid.mod",
#'                     labels = list(play = "pl", pause = "pa", stop = "sp"),
#'                     elementId = "my_player"),
#'       bassoonsample(playerId = "my_player", 2, width = "100%", height = 80)
#'     )
#'   )
#' }
#' @export
bassoonsample <- function(playerId, sample = NULL, width = NULL, height = NULL, elementId = NULL) {
  if (missing(playerId) || !is.character(playerId) || length(playerId) != 1) {
    stop("`playerId` must be a single character string matching a `bassoonplayer` elementId.")
  }
  
  x <- list(
    playerId = playerId,
    sample = sample
  )
  
  htmlwidgets::createWidget(
    name = "bassoonsample",
    x = x,
    width = width,
    height = height,
    package = "bassoonplayer",
    elementId = elementId
  )
}

#' Shiny bindings for bassoonsample
#'
#' Output and render functions for using bassoonscope within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId Output variable to read from.
#' @param width,height Must be a valid CSS unit or a number.
#' @param expr An expression that generates a bassoonsample.
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})?
#'
#' @name bassoonscope-shiny
#' @export
bassoonsampleOutput <- function(outputId, width = "100%", height = "80px") {
  htmlwidgets::shinyWidgetOutput(outputId, "bassoonsample", width, height, package = "bassoonplayer")
}

#' @rdname bassoonscope-shiny
#' @export
renderBassoonsample <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, bassoonsampleOutput, env, quoted = TRUE)
}
