export function textOf(
  runs: any[]
) {

  return runs
    ?.map(
      (x: any) => x.text
    )
    .join("") || ""
}

export function thumbnailOf(
  thumbnails: any[]
) {

  return thumbnails?.[
    thumbnails.length - 1
  ]?.url || null
}
