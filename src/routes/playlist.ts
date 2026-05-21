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

      browseId: `VL${id}`
    }
  )

  const header =
    json.contents
      ?.twoColumnBrowseResultsRenderer
      ?.tabs?.[0]
      ?.tabRenderer
      ?.content
      ?.sectionListRenderer
      ?.contents?.[0]
      ?.musicResponsiveHeaderRenderer

  const songs =
    json.contents
      ?.twoColumnBrowseResultsRenderer
      ?.secondaryContents
      ?.sectionListRenderer
      ?.contents?.[0]
      ?.musicPlaylistShelfRenderer
      ?.contents
      ?.map((x: any) => {
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

  return c.json({
    title: textOf(
      header?.title?.runs
    ),

    thumbnail: thumbnailOf(
      header?.thumbnail
        ?.musicThumbnailRenderer
        ?.thumbnail
        ?.thumbnails
    ),

    songs
  })
})

export default app
