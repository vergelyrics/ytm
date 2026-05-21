import { Hono } from "hono"
import { vergetune } from "../vergetune"

const app = new Hono()

app.get("/:id", async c => {
  const id = c.req.param("id")

  const params = btoa(
    `\n${String.fromCharCode(11)}${id}`
  )

  const json =
    await vergetune.request(
      "get_transcript",
      {
        context: {
          client: {
            clientName: "WEB",
            clientVersion:
              "2.20240520.00.00"
          }
        },

        params
      }
    )

  return c.json(json)
})

export default app
