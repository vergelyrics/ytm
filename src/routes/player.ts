import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { CLIENTS } from "../config"

const app = new Hono()

app.get("/:id", async c => {
  const id = c.req.param("id")

  const json = await vergetune.request(
    "player",
    {
      context: {
        client: {
          clientName: "IOS",
          clientVersion: "19.09.3",
          hl: "en",
          gl: "US"
        }
      },

      videoId: id
    },

    CLIENTS.IOS
  )

  return c.json(json)
})

export default app
