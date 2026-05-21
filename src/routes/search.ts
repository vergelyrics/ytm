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

    /*
      Request YouTube Music search
    */

    const json =
      await vergetune.request(

        "search",

        {
          context:
            vergetune.context(),

          query: q,

          /*
            Song filter
          */

          params:
            "EgWKAQIIAWoKEAkQBRAKEAMQBA=="
        }
      )

    /*
      Safely locate shelf
    */

    const shelf =
      json?.contents
        ?.tabbedSearchResultsRenderer
        ?.tabs?.[0]
        ?.tabRenderer
        ?.content
        ?.sectionListRenderer
        ?.contents
        ?.find(
          (x: any) =>
            x?.musicShelfRenderer
        )
        ?.musicShelfRenderer

    /*
      Handle no results
    */

    if (!shelf?.contents) {

      return c.json([])
    }

    /*
      Parse songs safely
    */

    const songs =
      shelf.contents
        ?.map((x: any) => {

          const r =
            x?.musicResponsiveListItemRenderer

          if (!r) return null

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
              r.playlistItemData
                ?.videoId || null,

            thumbnail: thumbnailOf(
              r.thumbnail
                ?.musicThumbnailRenderer
                ?.thumbnail
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
