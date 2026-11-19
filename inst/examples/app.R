fl <- system.file("cyberrid", "cyberrid.mod", package = "bassoonplayer")

ui <- shiny::fluidPage(
  bassoonplayer::bassoonplayer(fl, elementId = "my_player"),
  shiny::fluidRow(
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 0L, width = "100%", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 1L, width = "100%", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 2L, width = "100%", height = "50px")
    ),
    shiny::column(1L,
      bassoonplayer::bassoonscope("my_player", 3L, width = "100%", height = "50px")
    )
  ),
  shiny::actionButton("btnClick", "TODO")
)

server <- function(input, output, session) {
  shiny::observeEvent(input$my_player_instruments, {
    #TODO
  })
  
  shiny::observeEvent(input$btnClick, {
    session$sendCustomMessage("get_bassoon_position", list(id = "my_player"))
  })
  
  shiny::observeEvent(input$my_player_position, {
    browser() #TODO
  })
}

shiny::shinyApp(ui, server)