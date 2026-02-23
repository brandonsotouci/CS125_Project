const SEP = "|||";

export function makeTrackKey(artist, track) {
  return `${artist}${SEP}${track}`;
}

export function encodeTrackKey(rawKey) {
  return encodeURIComponent(rawKey);
}

export function splitTrackKey(encodedKey) {
  const decoded = decodeURIComponent(encodedKey);
  const idx = decoded.indexOf(SEP);
  if (idx === -1) {
    return { artist: "", track: decoded };
  }
  return {
    artist: decoded.slice(0, idx),
    track: decoded.slice(idx + SEP.length),
  };
}