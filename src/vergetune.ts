import { CLIENTS } from "./config"

export class VergeTune {
  async request(
    endpoint: string,
    body: any,
    client = CLIENTS.WEB_REMIX
  ) {
    const url =
      `https://music.youtube.com/youtubei/v1/${endpoint}` +
      `?key=${client.apiKey}&prettyPrint=false`

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "content-type": "application/json",

        "x-youtube-client-name":
          client.clientName,

        "x-youtube-client-version":
          client.clientVersion,

        origin: "https://music.youtube.com"
      },

      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(
        `YouTube API Error ${response.status}`
      )
    }

    return response.json()
  }

  context(clientName = "WEB_REMIX") {
    return {
      client: {
        clientName,
        clientVersion: "1.20240520.01.00",
        hl: "en",
        gl: "US"
      }
    }
  }
}

export const vergetune = new VergeTune()
