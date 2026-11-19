#' TODO
#'
#' TODO
#'
#' @param file TODO
#' @param width,height TODO
#' @param labels TODO
#' @param class TODO
#' @param elementId TODO
#' @param ... TODO
#' @returns TODO
#' @examples
#' if (interactive()) {
#'   fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")
#'   bassoonplayer(fl)
#' }
#' @export
bassoonplayer <- function(
    file, width = "200px", height = "50px",
    labels = list(play = "Play", pause = "Pause", stop = "Stop"),
    class = "bassoon-btn btn btn-sm",
    elementId = NULL, ...) {
  if (is.character(file) && file.exists(file)) {
    raw_bytes <- readBin(file, what = "raw", n = file.info(file)$size)
    filename <- basename(file)
  } else if (is.raw(file)) {
    raw_bytes <- file
    filename <- "module.mod"
  } else {
    stop("`file` must be a valid file path or a raw vector.")
  }
  
  b64 <- jsonlite::base64_enc(raw_bytes)
  data_uri <- paste0("data:application/octet-stream;base64,", gsub("\n", "", b64))
  
  x <- list(
    data      = data_uri,
    filename  = filename,
    labels    = labels
  )
  
  htmlwidgets::createWidget(
    name      = "bassoonplayer",
    x         = x,
    width     = width,
    height    = height,
    package   = "bassoonplayer",
    elementId = elementId
  )
}

#' Shiny bindings for bassoonplayer
#'
#' Output and render functions for using bassoonplayer within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a bassoonplayer
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name bassoonplayer-shiny
#'
#' @export
bassoonplayerOutput <- function(outputId, width = '200px', height = '50px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'bassoonplayer', width, height, package = 'bassoonplayer')
}

#' @rdname bassoonplayer-shiny
#' @export
renderBassoonplayer <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, bassoonplayerOutput, env, quoted = TRUE)
}
