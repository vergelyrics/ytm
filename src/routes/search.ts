import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf, thumbnailOf } from "../utils"

const app = new Hono()

app.get("/", async c => {

  try {

    const q = c.req.query("q")

    if (!q) {

      return c.json({
        error: "Missing query"
      }, 400)
    }

    const json =
      await vergetune.request(

        "search",

        {
          context:
            vergetune.context(),

          query: q
        }
      )

    const shelf =
      json?.contents
        ?.twoColumnSearchResultsRenderer
        ?.primaryContents
        ?.sectionListRenderer
        ?.contents
        ?.find(
          (x: any) =>
            x?.itemSectionRenderer
        )
        ?.itemSectionRenderer

    if (!shelf?.contents) {

      return c.json([])
    }

    const songs =
      shelf.contents
        ?.map((x: any) => {

          const r =
            x?.videoRenderer

          if (!r) return null

          return {

            title:
              r.title?.runs?.[0]
                ?.text || null,

            subtitle:
              textOf(
                r.longBylineText
                  ?.runs
              ),

            videoId:
              r.videoId || null,

            thumbnail:
              thumbnailOf(
                r.thumbnail
                  ?.thumbnails
              )
          }

        })

        .filter(Boolean)

    return c.json(songs)

  } catch (error: any) {

    return c.json({

      error: true,

      message:
        error?.message ||
        "Unknown error"

    }, 500)
  }
})

export default app
