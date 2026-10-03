export type Bowler = { id: string; name: string; average: number; games: number; totalPins?: number; highGame: number; highSeries: number; status: 'Active' | 'Substitute' | 'Inactive' }
export type Team = { id: string; name: string; bowlers: Bowler[]; wins: number; losses: number; points: number; pins: number }
export type League = { name: string; start: string; end: string; teams: number; bowlers: number; games: number; gamePoints: number; seriesPoints: number; handicapPercent: number; handicapBase: number; rules: string }
export type Scores = Record<string, string[]>
export type Result = { week: number; scores: Scores; points: Record<string, number>; date: string }
export type LeagueState = { league: League; teams: Team[]; week: number; drafts: Record<number, Scores>; results: Result[] }
const names = [['James Wilson', 'Sarah Mitchell', 'Mike Anderson', 'Emily Davis'], ['David Thompson', 'Lisa Chen', 'Robert Garcia', 'Amy Johnson'], ['Chris Miller', 'Jessica Taylor', 'Daniel Brown', 'Rachel Clark'], ['Mark Robinson', 'Nicole White', 'Kevin Lewis', 'Laura Hall'], ['Brian Walker', 'Megan Young', 'Jason Allen', 'Sophie King'], ['Eric Scott', 'Amanda Green', 'Paul Adams', 'Olivia Baker'], ['Ryan Nelson', 'Hannah Hill', 'Steve Wright', 'Grace Carter'], ['Tom Parker', 'Ashley Evans', 'Josh Turner', 'Kate Collins']]
const averages = [[192, 178, 184, 165], [188, 181, 174, 169], [185, 172, 180, 162], [179, 175, 182, 158], [183, 168, 176, 161], [175, 170, 180, 159], [178, 164, 173, 160], [171, 167, 169, 156]]
export const seed: LeagueState = {
  league: { name: 'Thursday Night Strikers', start: '2025-09-04', end: '2026-04-09', teams: 8, bowlers: 4, games: 3, gamePoints: 2, seriesPoints: 2, handicapPercent: 90, handicapBase: 220, rules: 'Handicap is 90% of the difference between a bowler’s average and 220, rounded down. Three games per match. Two points per game and two points for the total series. Ties split points equally. Substitutes are permitted with a verified average.' },
  teams: ['Pin Pals', 'Rolling Rebels', 'Split Happens', 'King Pins', 'Alley Masters', 'Gutter Fingers', 'Lucky Strikes', 'Ten Pin Crew'].map((name, index) => ({ id: `t${index}`, name, wins: [25, 23, 21, 19, 17, 12, 9, 6][index], losses: [8, 10, 12, 14, 16, 21, 24, 27][index], points: [64, 58, 54, 50, 44, 32, 28, 22][index], pins: [24928, 24412, 23985, 23760, 23452, 22918, 22605, 21874][index], bowlers: names[index].map((name, bowlerIndex) => ({ id: `b${index}-${bowlerIndex}`, name, average: averages[index][bowlerIndex], games: 33, highGame: averages[index][bowlerIndex] + 54 - bowlerIndex * 3, highSeries: averages[index][bowlerIndex] * 3 + 72, status: 'Active' as const })) })),
  week: 12, drafts: {}, results: [],
}
export function handicap(average: number, league: League) { return Math.max(0, Math.floor((league.handicapBase - average) * league.handicapPercent / 100)) }
export function sum(scores: string[] = []) { return scores.reduce((total, score) => total + (Number(score) || 0), 0) }
export function weekDate(league: League, week: number, long = false) { const date = new Date(`${league.start}T12:00:00`); date.setDate(date.getDate() + (week - 1) * 7); return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', ...(long ? { year: 'numeric' } : {}) }) }
export function pairs(teams: Team[]) { return Array.from({ length: Math.floor(teams.length / 2) }, (_, index) => [teams[index * 2], teams[index * 2 + 1]]) }
export function teamGames(team: Team, scores: Scores, league: League) { return Array.from({ length: league.games }, (_, game) => team.bowlers.filter(b => b.status !== 'Inactive').slice(0, league.bowlers).reduce((total, bowler) => total + (Number(scores[bowler.id]?.[game]) || 0) + handicap(bowler.average, league), 0)) }
export function matchComplete(pair: Team[], scores: Scores, league: League) { return pair.every(team => { const active = team.bowlers.filter(b => b.status !== 'Inactive').slice(0, league.bowlers); return active.length === league.bowlers && active.every(b => Array.from({ length: league.games }, (_, game) => scores[b.id]?.[game]).every(value => value !== undefined && value !== '' && Number(value) >= 0 && Number(value) <= 300)) }) }
export function matchPoints(pair: Team[], scores: Scores, league: League) {
  if (!matchComplete(pair, scores, league)) return [0, 0]
  const totals = pair.map(team => teamGames(team, scores, league)); const points = [0, 0]
  totals[0].forEach((score, game) => { if (score === totals[1][game]) { points[0] += league.gamePoints / 2; points[1] += league.gamePoints / 2 } else points[score > totals[1][game] ? 0 : 1] += league.gamePoints })
  const series = totals.map(games => games.reduce((total, score) => total + score, 0))
  if (series[0] === series[1]) { points[0] += league.seriesPoints / 2; points[1] += league.seriesPoints / 2 } else points[series[0] > series[1] ? 0 : 1] += league.seriesPoints
  return points
}
export function loadState(): LeagueState { try { const saved = localStorage.getItem('lanedesk-league-v1'); return saved ? JSON.parse(saved) : structuredClone(seed) } catch { return structuredClone(seed) } }
