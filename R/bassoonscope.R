#' Oscilloscope Visualiser for BassoonTracker
#'
#' Renders a real-time Web Audio oscilloscope bound to an existing
#' \code{\link{bassoonplayer}} widget.
#'
#' @param playerId The \code{elementId} of the target \code{bassoonplayer} widget.
#' @param channel Optional integer channel number (1-based, e.g. \code{1} to \code{4}
#'   for ProTracker modules) to visualize a single track. If \code{NULL} (default),
#'   visualizes the mixed master audio output.
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
#'       bassoonscope(playerId = "my_player", width = 300, height = 80)
#'     )
#'   )
#' }
#' @export
bassoonscope <- function(playerId, channel = NULL, width = NULL, height = NULL, elementId = NULL) {
  if (missing(playerId) || !is.character(playerId) || length(playerId) != 1) {
    stop("`playerId` must be a single character string matching a `bassoonplayer` elementId.")
  }
  
  x <- list(
    playerId = playerId,
    channel = channel
  )
  
  htmlwidgets::createWidget(
    name = "bassoonscope",
    x = x,
    width = width,
    height = height,
    package = "bassoonplayer",
    elementId = elementId
  )
}

#' Shiny bindings for bassoonscope
#'
#' Output and render functions for using bassoonscope within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId Output variable to read from.
#' @param width,height Must be a valid CSS unit or a number.
#' @param expr An expression that generates a bassoonscope.
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})?
#'
#' @name bassoonscope-shiny
#' @export
bassoonscopeOutput <- function(outputId, width = "100%", height = "80px") {
  htmlwidgets::shinyWidgetOutput(outputId, "bassoonscope", width, height, package = "bassoonplayer")
}

#' @rdname bassoonscope-shiny
#' @export
renderBassoonscope <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, bassoonscopeOutput, env, quoted = TRUE)
}
