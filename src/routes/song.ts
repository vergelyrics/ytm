import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { CLIENTS } from "../config"

const app = new Hono()

app.get("/:id", async c => {

  try {

    const id = c.req.param("id")

    /*
      Request YouTube player endpoint
    */

    const player =
      await vergetune.request(

        "player",

        {
          context:
            vergetune.context(
              CLIENTS.IOS
            ),

          videoId: id
        },

        CLIENTS.IOS
      )

    /*
      Extract video details
    */

    const details =
      player?.videoDetails || {}

    /*
      Extract audio formats
    */

    const formats =
      player?.streamingData
        ?.adaptiveFormats || []

    /*
      Find first audio stream
    */

    const audio =
      formats.find((x: any) =>
        x?.mimeType?.includes("audio")
      )

    /*
      Handle signatureCipher streams
    */

    let streamUrl = null

    if (audio?.url) {

      streamUrl = audio.url

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

    /*
      Return clean song object
    */

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
          ?.status || null,

      isLive:
        details?.isLiveContent || false,

      expiresInSeconds:
        player?.streamingData
          ?.expiresInSeconds || null
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
