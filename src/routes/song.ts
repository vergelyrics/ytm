import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { CLIENTS } from "../config"

const app = new Hono()

app.get("/:id", async c => {
  try {
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
      player?.videoDetails || {}

    const formats =
      player?.streamingData
        ?.adaptiveFormats || []

    const audio =
      formats.find((x: any) =>
        x?.mimeType?.includes("audio")
      )

    return c.json({
      videoId:
        details.videoId || null,

      title:
        details.title || null,

      artist:
        details.author || null,

      duration:
        details.lengthSeconds || null,

      views:
        details.viewCount || null,

      thumbnail:
        details.thumbnail
          ?.thumbnails?.[
            details.thumbnail
              ?.thumbnails.length - 1
          ]?.url || null,

      streamUrl:
        audio?.url || null,

      bitrate:
        audio?.bitrate || null,

      mimeType:
        audio?.mimeType || null,

      playability:
        player?.playabilityStatus
          ?.status || null
    })

  } catch (error: any) {

    return c.json({
      error: true,

      message:
        error?.message || "Unknown error"
    }, 500)
  }
})

export default app
