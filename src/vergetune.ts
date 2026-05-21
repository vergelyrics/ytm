import { CLIENTS } from "./config"

export class VergeTune {

  async request(
    endpoint: string,
    body: any,
    client = CLIENTS.WEB
  ) {

    const url =
      `https://music.youtube.com/youtubei/v1/${endpoint}` +
      `?key=${client.apiKey}&prettyPrint=false`

    const response = await fetch(url, {

      method: "POST",

      headers: {

        "content-type":
          "application/json",

        "x-youtube-client-name":
          client.clientId,

        "x-youtube-client-version":
          client.clientVersion,

        "user-agent":
          client.userAgent,

        origin:
          "https://www.youtube.com",

        referer:
          "https://www.youtube.com/"
      },

      body: JSON.stringify(body)
    })

    if (!response.ok) {

      const text =
        await response.text()

      throw new Error(
        `YouTube API Error ${response.status}: ${text}`
      )
    }

    return response.json()
  }

  context(
    client = CLIENTS.WEB
  ) {

    return {

      client: {

        clientName:
          client.clientName,

        clientVersion:
          client.clientVersion,

        hl: "en",

        gl: "US"
      }
    }
  }
}

export const vergetune =
  new VergeTune()
