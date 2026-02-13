
const clamp = (value, min, max) => 
    Math.min(Math.max(value, min), max)

const logNormalize = (value, max) => 
    clamp(Math.log10(value + 1) / Math.log10(max), 0, 1)



export function calculateTrackRankingScore({
    playcount,
    listeners,
    rank,
    rankChange = 0,
    chartPresenceCount,
}){
    const popularity = logNormalize(playcount, 1_000_000_000) * 0.4;
    const momentum = clamp(listeners / playcount, 0, 0.1) * 10 * 0.25;
    const reach = clamp(chartPresenceCount / 10, 0, 1) * 0.2;
    const trend = clamp(rankChange / 20, -1, 1) * 0.15;
    return Math.round((popularity + momentum + reach + trend) * 100);
}
