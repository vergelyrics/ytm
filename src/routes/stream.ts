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

    const formats =
      player?.streamingData
        ?.adaptiveFormats || []

    const audio =
      formats.find((x: any) =>
        x?.mimeType?.includes("audio")
      )

    if (!audio) {

      return c.json({
        error:
          "No audio stream"
      }, 404)
    }

    if (audio.url) {

      return c.redirect(
        audio.url
      )
    }

    if (
      audio.signatureCipher
    ) {

      const params =
        new URLSearchParams(
          audio.signatureCipher
        )

      const url =
        params.get("url")

      if (url) {

        return c.redirect(url)
      }
    }

    return c.json({
      error:
        "Unsupported stream"
    }, 500)

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
