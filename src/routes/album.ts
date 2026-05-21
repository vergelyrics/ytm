import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf } from "../utils"

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

          videoId:
            r.playlistItemData?.videoId
        }
      })

  return c.json(songs)
})

export default app
