import { Hono } from "hono"
import { vergetune } from "../vergetune"

const app = new Hono()

app.get("/:id", async c => {

  try {

    const id = c.req.param("id")

    const player =
      await vergetune.request(

        "player",

        {
          context:
            vergetune.context(),

          videoId: id
        }
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

    let streamUrl = null

    if (audio?.url) {

      streamUrl =
        audio.url

    } else if (
      audio?.signatureCipher
    ) {

      const params =
        new URLSearchParams(
          audio.signatureCipher
        )

      streamUrl =
        params.get("url")
    }

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
              ?.thumbnails
              ?.length - 1
          ]?.url || null,

      streamUrl,

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
        error?.message ||
        "Unknown error"

    }, 500)
  }
})

export default app
