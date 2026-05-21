import { Hono } from "hono"
import { vergetune } from "../vergetune"

const app = new Hono()

app.get("/", async c => {
  const input =
    c.req.query("q")

  const json =
    await vergetune.request(
      "music/get_search_suggestions",
      {
        context:
          vergetune.context(),

        input
      }
    )

  return c.json(json)
})

export default app
