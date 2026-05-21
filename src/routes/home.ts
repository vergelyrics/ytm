import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf, thumbnailOf } from "../utils"

const app = new Hono()

app.get("/", async c => {
  const json = await vergetune.request(
    "browse",
    {
      context: vergetune.context(),
      browseId: "FEmusic_home"
    }
  )

  const sections =
    json.contents
      ?.singleColumnBrowseResultsRenderer
      ?.tabs?.[0]
      ?.tabRenderer
      ?.content
      ?.sectionListRenderer
      ?.contents
      ?.map((x: any) =>
        x.musicCarouselShelfRenderer
      )
      ?.filter(Boolean)
      ?.map((s: any) => ({
        title: textOf(
          s.header
            ?.musicCarouselShelfBasicHeaderRenderer
            ?.title?.runs
        ),

        items: s.contents?.map((i: any) => {
          const r = i.musicTwoRowItemRenderer

          return {
            title: textOf(
              r.title?.runs
            ),

            browseId:
              r.navigationEndpoint
                ?.browseEndpoint
                ?.browseId,

            thumbnail: thumbnailOf(
              r.thumbnailRenderer
                ?.musicThumbnailRenderer
                ?.thumbnail
                ?.thumbnails
            )
          }
        })
      }))

  return c.json(sections)
})

export default app
