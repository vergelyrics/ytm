import { Hono } from "hono"
import { vergetune } from "../vergetune"
import { CLIENTS } from "../config"
import { decipherSignature } from "../extract/decipher"

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

  const formats =
    player.streamingData
      ?.adaptiveFormats || []

  const audio =
    formats.find((x: any) =>
      x.mimeType?.includes("audio")
    )

  if (!audio) {
    return c.json({
      error: "No audio stream"
    })
  }

  if (audio.url) {
    return c.redirect(audio.url)
  }

  if (audio.signatureCipher) {
    const params =
      new URLSearchParams(
        audio.signatureCipher
      )

    const url = params.get("url")
    const s = params.get("s")
    const sp = params.get("sp")

    const sig =
      await decipherSignature(s!)

    return c.redirect(
      `${url}&${sp}=${sig}`
    )
  }

  return c.json({
    error: "Unsupported stream"
  })
})

export default app
