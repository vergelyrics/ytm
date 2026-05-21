import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf, thumbnailOf } from "../utils"

const app = new Hono()

app.get("/:id", async c => {
  const id = c.req.param("id")

  const json = await vergetune.request(
    "browse",
    {
      context: vergetune.context(),
      browseId: id
    }
  )

  const header =
    json.header
      ?.musicImmersiveHeaderRenderer

  return c.json({
    title: textOf(
      header.title?.runs
    ),

    description: textOf(
      header.description?.runs
    ),

    thumbnail: thumbnailOf(
      header.thumbnail
        ?.musicThumbnailRenderer
        ?.thumbnail
        ?.thumbnails
    )
  })
})

export default app
