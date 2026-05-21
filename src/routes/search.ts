import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf, thumbnailOf } from "../utils"

const app = new Hono()

app.get("/", async c => {
  const q = c.req.query("q")

  if (!q) {
    return c.json({
      error: "Missing query"
    }, 400)
  }

  const json = await vergetune.request(
    "search",
    {
      context: vergetune.context(),

      query: q,

      params:
        "EgWKAQIIAWoKEAkQBRAKEAMQBA=="
    }
  )

  const shelf =
    json.contents
      ?.tabbedSearchResultsRenderer
      ?.tabs?.[0]
      ?.tabRenderer
      ?.content
      ?.sectionListRenderer
      ?.contents
      ?.at(-1)
      ?.musicShelfRenderer

  const songs = shelf.contents.map((x: any) => {
    const r =
      x.musicResponsiveListItemRenderer

    return {
      title: textOf(
        r.flexColumns?.[0]
          ?.musicResponsiveListItemFlexColumnRenderer
          ?.text?.runs
      ),

      subtitle: textOf(
        r.flexColumns?.[1]
          ?.musicResponsiveListItemFlexColumnRenderer
          ?.text?.runs
      ),

      videoId:
        r.playlistItemData?.videoId,

      thumbnail: thumbnailOf(
        r.thumbnail
          ?.musicThumbnailRenderer
          ?.thumbnail
          ?.thumbnails
      )
    }
  })

  return c.json(songs)
})

export default app
