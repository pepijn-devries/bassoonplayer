fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")

ui <- shiny::fluidPage(
  bassoonplayer::bassoonplayer(fl, elementId = "my_player"),
  shiny::fluidRow(
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 0L, width = "50px", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 1L, width = "50px", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 2L, width = "50px", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 3L, width = "50px", height = "50px")
    )
  ),
  shiny::actionButton("btnClick", "TODO")
)

server <- function(input, output, session) {
  shiny::observeEvent(input$my_player_instruments, {
    #TODO
  })
}

shiny::shinyApp(ui, server)