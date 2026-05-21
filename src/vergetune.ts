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

        "content-type":
          "application/json",

        /*
          IMPORTANT:
          Must be numeric IDs
        */

        "X-YouTube-Client-Name":
          client.clientId,

        "X-YouTube-Client-Version":
          client.clientVersion,

        Origin:
          "https://music.youtube.com",

        Referer:
          "https://music.youtube.com/"
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

  context(client: any) {

    return {

      client: {

        clientName:
          client.clientName,

        clientVersion:
          client.clientVersion,

        hl: "en",

        gl: "US",

        utcOffsetMinutes: 0
      }
    }
  }
}

export const vergetune =
  new VergeTune()
