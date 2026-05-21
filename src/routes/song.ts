import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { CLIENTS } from "../config"

const app = new Hono()

app.get("/:id", async c => {
  const id = c.req.param("id")

  const player =
    await vergetune.request(
      "player",

      {
        context: {
          client: {
            clientName: "IOS",
            clientVersion: "19.09.3",
            hl: "en",
            gl: "US"
          }
        },

        videoId: id
      },

      CLIENTS.IOS
    )

  const details =
    player.videoDetails

  const formats =
    player.streamingData
      ?.adaptiveFormats || []

  const audio =
    formats.find((x: any) =>
      x.mimeType?.includes("audio")
    )

  return c.json({
    videoId: details.videoId,

    title: details.title,

    artist: details.author,

    duration:
      details.lengthSeconds,

    views:
      details.viewCount,

    thumbnail:
      details.thumbnail
        ?.thumbnails?.at(-1)?.url,

    streamUrl:
      audio?.url || null,

    bitrate:
      audio?.bitrate || null,

    mimeType:
      audio?.mimeType || null
  })
})

export default app
