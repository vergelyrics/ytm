import { Hono } from "hono"

import home from "./routes/home"
import search from "./routes/search"
import artist from "./routes/artist"
import album from "./routes/album"
import playlist from "./routes/playlist"
import related from "./routes/related"
import player from "./routes/player"
import stream from "./routes/stream"
import song from "./routes/song"
import transcript from "./routes/transcript"
import suggestions from "./routes/suggestions"

const app = new Hono()

/*
  Root
*/

app.get("/", c => {

  return c.json({

    engine:
      "VergeTune",

    version:
      "1.0.0",

    client:
      "WEB",

    status:
      "running"
  })
})

/*
  Routes
*/

app.route(
  "/home",
  home
)

app.route(
  "/search",
  search
)

app.route(
  "/artist",
  artist
)

app.route(
  "/album",
  album
)

app.route(
  "/playlist",
  playlist
)

app.route(
  "/related",
  related
)

app.route(
  "/player",
  player
)

app.route(
  "/stream",
  stream
)

app.route(
  "/song",
  song
)

app.route(
  "/transcript",
  transcript
)

app.route(
  "/suggestions",
  suggestions
)

export default app
