import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { textOf } from "../utils"

const app = new Hono()

app.get("/:id", async c => {
  const id = c.req.param("id")

  const json = await vergetune.request(
    "next",
    {
      context: vergetune.context(),
      videoId: id
    }
  )

  const renderer =
    json.contents
      ?.singleColumnMusicWatchNextResultsRenderer
      ?.tabbedRenderer
      ?.watchNextTabbedResultsRenderer
      ?.tabs?.[0]
      ?.tabRenderer
      ?.content
      ?.musicQueueRenderer
      ?.content
      ?.playlistPanelRenderer

  const items =
    renderer.contents
      ?.map((x: any) =>
        x.playlistPanelVideoRenderer
      )
      ?.filter(Boolean)
      ?.map((r: any) => ({
        title: textOf(
          r.title?.runs
        ),

        videoId: r.videoId
      }))

  return c.json(items)
})

export default app
