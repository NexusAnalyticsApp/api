import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { Context } from 'hono';
import { Match, Team, Player, TeamMatchStat, PlayerMatchStat, DashboardSummary, ChampionMetaTierList, NewsRecentActivity, ChampionStats, ChampionPowerTimeline, PlayerStats, PlayerComparison, DraftAnalysis, TeamComposition, LeagueMetaComparison, PatchEvolution, ChampionHistoricalPerformance, MatchPrediction, ChampionRecommendation, MetaShiftAlert, PlayerPerformanceAlert } from './types';

// Define Zod schemas for common responses
const ErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

const NotFoundSchema = z.object({
  error: z.string(),
});

// Define Zod schemas for each data type based on src/types.ts
const MatchSchema = z.object({
  gameid: z.string(),
  datacompleteness: z.string(),
  url: z.string(),
  league: z.string(),
  year: z.number().int(),
  split: z.string(),
  playoffs: z.number().int(),
  date: z.string(),
  game: z.number(),
  patch: z.number(),
  gamelength: z.number().int(),
  winner_teamid: z.string(),
});

const TeamSchema = z.object({
  teamid: z.string(),
  teamname: z.string(),
});

const PlayerSchema = z.object({
  playerid: z.string(),
  playername: z.string(),
});

const DashboardSummarySchema = z.object({
  total_matches: z.number(),
  total_champions: z.number(),
  total_players: z.number(),
  avg_game_length_min: z.number(),
  avg_kills_per_game: z.number(),
  blue_side_win_rate: z.number(),
  changes: z.object({
    total_matches_pct_change_week: z.number(),
    total_champions_new_week: z.number(),
    total_players_new_week: z.number(),
    avg_game_length_min_change: z.number(),
    avg_kills_per_game_change: z.number(),
    blue_side_win_rate_change: z.number(),
  }),
});

const ChampionMetaTierListSchema = z.object({
  champion_name: z.string(),
  role: z.string(),
  pick_rate: z.number(),
  win_rate: z.number(),
  tier: z.string(),
});

const TeamMatchStatSchema = z.object({
  "Unnamed: 0": z.number().int(),
  gameid: z.string(),
  teamid: z.string(),
  side: z.string(),
  result: z.number().int(),
  teamkills: z.number().int(),
  teamdeaths: z.number().int(),
  ban1: z.string(),
  ban2: z.string(),
  ban3: z.string(),
  ban4: z.string(),
  ban5: z.string(),
  firstdragon: z.number(),
  dragons: z.number(),
  opp_dragons: z.number(),
  elementaldrakes: z.number(),
  opp_elementaldrakes: z.number(),
  infernals: z.number(),
  mountains: z.number(),
  clouds: z.number(),
  oceans: z.number(),
  chemtechs: z.number(),
  hextechs: z.number(),
  "dragons (type unknown)": z.number(),
  elders: z.number(),
  opp_elders: z.number(),
  firstherald: z.number(),
  heralds: z.number(),
  opp_heralds: z.number(),
  void_grubs: z.number(),
  opp_void_grubs: z.number(),
  firstbaron: z.number(),
  barons: z.number(),
  opp_barons: z.number(),
  atakhans: z.number(),
  opp_atakhans: z.number(),
  firsttower: z.number(),
  towers: z.number(),
  opp_towers: z.number(),
  firstmidtower: z.number(),
  firsttothreetowers: z.number(),
  turretplates: z.number(),
  opp_turretplates: z.number(),
  inhibitors: z.number(),
  opp_inhibitors: z.number(),
  "team kpm": z.number(),
  ckpm: z.number(),
});

const NewsRecentActivitySchema = z.object({
  type: z.string(),
  title: z.string(),
  timestamp: z.string(),
  game_id: z.string().optional(),
  player_id: z.string().optional(),
});

const ChampionStatsSchema = z.object({
  champion_name: z.string(),
  role: z.string(),
  pick_rate: z.number(),
  win_rate: z.number(),
  ban_rate: z.number(),
  total_games: z.number(),
  avg_kda: z.number(),
  performance_by_league: z.record(z.object({ win_rate: z.number(), games: z.number() })),
  best_matchups: z.array(z.object({ opponent_champion: z.string(), win_rate: z.number(), games: z.number() })),
  worst_matchups: z.array(z.object({ opponent_champion: z.string(), win_rate: z.number(), games: z.number() })),
});

const ChampionPowerTimelineSchema = z.object({
  champion_name: z.string(),
  win_rate_by_minute: z.array(z.object({ minute: z.number(), win_rate: z.number() })),
  strengths: z.array(z.string()),
});

const PlayerStatsSchema = z.object({
  player_name: z.string(),
  team_name: z.string(),
  role: z.string(),
  season_stats: z.object({
    games: z.number(),
    win_rate: z.number(),
    kda: z.number(),
    damage_share: z.number(),
    gpm: z.number(),
    cspm: z.number(),
  }),
  champion_pool: z.array(z.object({ champion_name: z.string(), games: z.number(), win_rate: z.number() })),
  comparison_stats: z.object({
    LCK_mid_avg: z.object({ kda: z.number(), damage: z.number(), gold: z.number() }),
    rankings: z.object({ kda: z.number(), damage: z.number(), gold: z.number() }),
  }),
});

const PlayerComparisonSchema = z.object({
  player_id: z.string(),
  player_name: z.string(),
  games: z.number(),
  win_rate: z.number(),
  kda: z.number(),
  dpm: z.number(),
  gpm: z.number(),
  cspm: z.number(),
  champion_pool_size: z.number(),
  most_played_champion: z.string(),
});

const DraftAnalysisSchema = z.object({
  pick_priority: z.array(z.object({ champion_name: z.string(), role: z.string(), first_pick_win_rate: z.number(), first_picks_count: z.number() })),
  ban_priority: z.array(z.object({ champion_name: z.string(), ban_rate: z.number(), total_games_in_patch: z.number() })),
  flex_picks: z.array(z.object({ champion_name: z.string(), roles: z.array(z.string()), global_win_rate: z.number() })),
  counter_picks: z.array(z.object({ champion_name: z.string(), vs_champion: z.string(), win_rate: z.number(), games: z.number() })),
});

const TeamCompositionSchema = z.object({
  name: z.string(),
  win_rate: z.number(),
  games: z.number(),
  description: z.string(),
  example_champions: z.array(z.string()),
});

const LeagueMetaComparisonSchema = z.record(z.object({
  avg_game_time_min: z.number(),
  avg_kills_per_game: z.number(),
  most_picked_champions: z.array(z.string()),
  unique_meta_description: z.string(),
}));

const PatchEvolutionSchema = z.object({
  patch_number: z.string(),
  weeks: z.array(z.object({
    week_start_date: z.string(),
    emerging_champions: z.array(z.object({ champion_name: z.string(), win_rate_change: z.string(), pick_rate_change: z.string() })),
    declining_champions: z.array(z.object({ champion_name: z.string(), win_rate_trend: z.string(), pick_rate_trend: z.string() })),
    stable_champions: z.array(z.object({ champion_name: z.string(), win_rate: z.number(), pick_rate: z.number() })),
  })),
});

const ChampionHistoricalPerformanceSchema = z.object({
  champion_name: z.string(),
  season_data: z.array(z.object({
    season: z.string(),
    split: z.string(),
    pick_rate: z.number(),
    win_rate: z.number(),
    notes: z.string(),
  })),
  prediction: z.string(),
});

const MatchPredictionSchema = z.object({
  team1_id: z.string(),
  team2_id: z.string(),
  team1_win_probability: z.number(),
  most_likely_score: z.string(),
  confidence: z.string(),
  key_factors: z.array(z.string()),
});

const ChampionRecommendationSchema = z.object({
  situation: z.object({
    side: z.string(),
    pick_number: z.number(),
    role: z.string(),
    enemy_team_champions: z.array(z.string()),
    your_team_champions: z.array(z.string()),
  }),
  recommendations: z.array(z.object({
    champion_name: z.string(),
    tier: z.string(),
    win_rate_vs_comp_type: z.number(),
    reasons: z.array(z.string()),
  })),
  avoid_champions: z.array(z.object({ champion_name: z.string(), reason: z.string() })),
});

const MetaShiftAlertSchema = z.object({
  timestamp: z.string(),
  rising_threats: z.array(z.object({ champion_name: z.string(), role: z.string(), win_rate_trend: z.string(), pick_rate_trend: z.string() })),
  declining_picks: z.array(z.object({ champion_name: z.string(), role: z.string(), win_rate_trend: z.string(), pick_rate_trend: z.string() })),
  immediate_actions: z.array(z.string()),
});

const PlayerPerformanceAlertSchema = z.object({
  timestamp: z.string(),
  hot_streaks: z.array(z.object({ player_name: z.string(), team_name: z.string(), description: z.string() })),
  concerning_trends: z.array(z.object({ player_name: z.string(), team_name: z.string(), description: z.string() })),
  injury_alerts: z.array(z.object({ player_name: z.string(), team_name: z.string(), description: z.string() })),
});

const PlayerMatchStatSchema = z.object({
  participantid: z.number().int(),
  gameid: z.string(),
  playerid: z.string(),
  teamid: z.string(),
  side: z.string(),
  position: z.string(),
  champion: z.string(),
  kills: z.number().int(),
  deaths: z.number().int(),
  assists: z.number().int(),
  doublekills: z.number(),
  triplekills: z.number(),
  quadrakills: z.number(),
  pentakills: z.number(),
  firstblood: z.number(),
  firstbloodkill: z.number(),
  firstbloodassist: z.number(),
  firstbloodvictim: z.number(),
  damagetochampions: z.number(),
  dpm: z.number(),
  damageshare: z.number(),
  damagetakenperminute: z.number(),
  damagemitigatedperminute: z.number(),
  wardsplaced: z.number(),
  wpm: z.number(),
  wardskilled: z.number(),
  wcpm: z.number(),
  controlwardsbought: z.number(),
  visionscore: z.number(),
  vspm: z.number(),
  totalgold: z.number(),
  earnedgold: z.number(),
  "earned gpm": z.number(),
  earnedgoldshare: z.number(),
  goldspent: z.number(),
  gspd: z.number(),
  gpr: z.number(),
  "total cs": z.number(),
  minionkills: z.number(),
  monsterkills: z.number(),
  monsterkillsownjungle: z.number(),
  monsterkillsenemyjungle: z.number(),
  cspm: z.number(),
  goldat10: z.number(),
  xpat10: z.number(),
  csat10: z.number(),
  opp_goldat10: z.number(),
  opp_xpat10: z.number(),
  opp_csat10: z.number(),
  golddiffat10: z.number(),
  xpdiffat10: z.number(),
  csdiffat10: z.number(),
  killsat10: z.number(),
  assistsat10: z.number(),
  deathsat10: z.number(),
  opp_killsat10: z.number(),
  opp_assistsat10: z.number(),
  opp_deathsat10: z.number(),
  goldat15: z.number(),
  xpat15: z.number(),
  csat15: z.number(),
  opp_goldat15: z.number(),
  opp_xpat15: z.number(),
  opp_csat15: z.number(),
  golddiffat15: z.number(),
  xpdiffat15: z.number(),
  csdiffat15: z.number(),
  killsat15: z.number(),
  assistsat15: z.number(),
  deathsat15: z.number(),
  opp_killsat15: z.number(),
  opp_assistsat15: z.number(),
  opp_deathsat15: z.number(),
  pick1: z.string(),
  pick2: z.string(),
  pick3: z.string(),
  pick4: z.string(),
  pick5: z.string(),
});

export const setupRoutes = (app: OpenAPIHono) => {
  // Health Check
  const healthRoute = createRoute({
    method: 'get',
    path: '/health',
    responses: {
      200: {
        description: 'Health check status',
        content: {
          'application/json': {
            schema: z.object({
              status: z.string().openapi({ example: 'ok' }),
            }),
          },
        },
      },
    },
  });

  app.openapi(healthRoute, (c: Context) => {
    return c.json({ status: 'ok' });
  });

  // Matches routes
  const matchesRoute = createRoute({
    method: 'get',
    path: '/matches',
    request: {
      query: z.object({
        limit: z.coerce.number().int().positive().optional().openapi({ description: 'Number of records to return', example: 10 }),
        offset: z.coerce.number().int().nonnegative().optional().openapi({ description: 'Number of records to skip', example: 0 }),
      }),
    },
    responses: {
      200: {
        description: 'A list of matches',
        content: {
          'application/json': {
            schema: z.array(MatchSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(matchesRoute, async (c: Context) => {
    const db = c.get('db');
    const limit = Number(c.req.query('limit')) || 10; // Default limit reduced to 10
    const offset = Number(c.req.query('offset')) || 0; // Default offset to 0

    console.log(`Fetching matches with limit: ${limit}, offset: ${offset}`);
    // WARNING: Do not log full DATABASE_URL in production due to sensitive info
    console.log(`Using database URL (partial): ${c.env.DATABASE_URL ? c.env.DATABASE_URL.substring(0, c.env.DATABASE_URL.indexOf('@')) + '...' : 'not set'}`);

    try {
      const { rows } = await db.query('SELECT * FROM matches LIMIT $1 OFFSET $2', [limit, offset]);
      console.log(`Fetched ${rows.length} matches.`);
      return c.json(rows as Match[]);
    } catch (error: any) {
      console.error('Error fetching matches:', error.message || error);
      console.error('Error details:', error);
      return c.json({ error: 'Failed to fetch matches', details: error.message || 'unknown error' }, 500);
    }
  });

  // Matches by gameid route
  const matchesByIdRoute = createRoute({
    method: 'get',
    path: '/matches/{gameid}',
    request: {
      params: z.object({
        gameid: z.string().openapi({ description: 'ID of the game', example: 'game_123' }),
      }),
    },
    responses: {
      200: {
        description: 'A single match',
        content: {
          'application/json': {
            schema: MatchSchema,
          },
        },
      },
      404: {
        description: 'Match not found',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(matchesByIdRoute, async (c: Context) => {
    const db = c.get('db');
    const gameid = c.req.param('gameid');
    try {
      const { rows } = await db.query('SELECT * FROM matches WHERE gameid = $1', [gameid]);
      if (rows.length > 0) {
        return c.json(rows[0] as Match);
      } else {
        return c.json({ error: 'Match not found' }, 404);
      }
    } catch (error: any) {
      console.error(`Error fetching match with gameid ${gameid}:`, error.message || error);
      return c.json({ error: 'Failed to fetch match', details: error.message || 'unknown error' }, 500);
    }
  });

  // Teams routes
  const teamsRoute = createRoute({
    method: 'get',
    path: '/teams',
    responses: {
      200: {
        description: 'A list of teams',
        content: {
          'application/json': {
            schema: z.array(TeamSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(teamsRoute, async (c: Context) => {
    const db = c.get('db');
    try {
      const { rows } = await db.query('SELECT * FROM teams');
      return c.json(rows as Team[]);
    } catch (error: any) {
      console.error('Error fetching teams:', error.message || error);
      return c.json({ error: 'Failed to fetch teams', details: error.message || 'unknown error' }, 500);
    }
  });

  // Teams by teamid route
  const teamsByIdRoute = createRoute({
    method: 'get',
    path: '/teams/{teamid}',
    request: {
      params: z.object({
        teamid: z.string().openapi({ description: 'ID of the team', example: 'team_123' }),
      }),
    },
    responses: {
      200: {
        description: 'A single team',
        content: {
          'application/json': {
            schema: TeamSchema,
          },
        },
      },
      404: {
        description: 'Team not found',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(teamsByIdRoute, async (c: Context) => {
    const db = c.get('db');
    const teamid = c.req.param('teamid');
    try {
      const { rows } = await db.query('SELECT * FROM teams WHERE teamid = $1', [teamid]);
      if (rows.length > 0) {
        return c.json(rows[0] as Team);
      } else {
        return c.json({ error: 'Team not found' }, 404);
      }
    } catch (error: any) {
      console.error(`Error fetching team with teamid ${teamid}:`, error.message || error);
      return c.json({ error: 'Failed to fetch team', details: error.message || 'unknown error' }, 500);
    }
  });

  // Players routes
  const playersRoute = createRoute({
    method: 'get',
    path: '/players',
    responses: {
      200: {
        description: 'A list of players',
        content: {
          'application/json': {
            schema: z.array(PlayerSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(playersRoute, async (c: Context) => {
    const db = c.get('db');
    try {
      const { rows } = await db.query('SELECT * FROM players');
      return c.json(rows as Player[]);
    } catch (error: any) {
      console.error('Error fetching players:', error.message || error);
      return c.json({ error: 'Failed to fetch players', details: error.message || 'unknown error' }, 500);
    }
  });

  // Players by playerid route
  const playersByIdRoute = createRoute({
    method: 'get',
    path: '/players/{playerid}',
    request: {
      params: z.object({
        playerid: z.string().openapi({ description: 'ID of the player', example: 'player_123' }),
      }),
    },
    responses: {
      200: {
        description: 'A single player',
        content: {
          'application/json': {
            schema: PlayerSchema,
          },
        },
      },
      404: {
        description: 'Player not found',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(playersByIdRoute, async (c: Context) => {
    const db = c.get('db');
    const playerid = c.req.param('playerid');
    try {
      const { rows } = await db.query('SELECT * FROM players WHERE playerid = $1', [playerid]);
      if (rows.length > 0) {
        return c.json(rows[0] as Player);
      } else {
        return c.json({ error: 'Player not found' }, 404);
      }
    } catch (error: any) {
      console.error(`Error fetching player with playerid ${playerid}:`, error.message || error);
      return c.json({ error: 'Failed to fetch player', details: error.message || 'unknown error' }, 500);
    }
  });

  // Dashboard Summary Route
  const dashboardSummaryRoute = createRoute({
    method: 'get',
    path: '/dashboard/summary',
    responses: {
      200: {
        description: 'Summary of key metrics for the dashboard',
        content: {
          'application/json': {
            schema: DashboardSummarySchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(dashboardSummaryRoute, async (c: Context) => {
    const db = c.get('db');
    try {
      // Total Matches
      const totalMatchesResult = await db.query('SELECT COUNT(*) FROM matches');
      const total_matches = parseInt(totalMatchesResult.rows[0].count);

      // Total Champions (assuming distinct champions from player_match_stats)
      const totalChampionsResult = await db.query('SELECT COUNT(DISTINCT champion) FROM player_match_stats');
      const total_champions = parseInt(totalChampionsResult.rows[0].count);

      // Total Players (assuming distinct players from players table)
      const totalPlayersResult = await db.query('SELECT COUNT(*) FROM players');
      const total_players = parseInt(totalPlayersResult.rows[0].count);

      // Average Game Length (from matches table)
      const avgGameLengthResult = await db.query('SELECT AVG(gamelength) FROM matches');
      const avg_game_length_min = parseFloat(avgGameLengthResult.rows[0].avg);

      // Average Kills per Game (sum of teamkills from team_match_stats divided by total matches)
      const avgKillsPerGameResult = await db.query('SELECT SUM(teamkills) FROM team_match_stats');
      const totalKills = parseInt(avgKillsPerGameResult.rows[0].sum);
      const avg_kills_per_game = totalKills / total_matches;

      // Blue Side Win Rate
      const blueSideWinsResult = await db.query('SELECT COUNT(*) FROM team_match_stats WHERE side = $1 AND result = 1', ['Blue']);
      const blueSideTotalGamesResult = await db.query('SELECT COUNT(*) FROM team_match_stats WHERE side = $1', ['Blue']);
      const blue_side_win_rate = (parseInt(blueSideWinsResult.rows[0].count) / parseInt(blueSideTotalGamesResult.rows[0].count)) * 100;

      // Placeholder for changes (requires more complex historical data analysis)
      const changes = {
        total_matches_pct_change_week: 0,
        total_champions_new_week: 0,
        total_players_new_week: 0,
        avg_game_length_min_change: 0,
        avg_kills_per_game_change: 0,
        blue_side_win_rate_change: 0,
      };

      return c.json({
        total_matches,
        total_champions,
        total_players,
        avg_game_length_min,
        avg_kills_per_game,
        blue_side_win_rate,
        changes,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard summary:', error.message || error);
      return c.json({ error: 'Failed to fetch dashboard summary', details: error.message || 'unknown error' }, 500);
    }
  });

  // Champions Meta Tier List Route
  const championsMetaTierListRoute = createRoute({
    method: 'get',
    path: '/champions/meta-tier-list',
    request: {
      query: z.object({
        patch: z.string().optional().openapi({ description: 'Patch number to filter by', example: '15.01' }),
        role: z.string().optional().openapi({ description: 'Role of the champion (e.g., "Top", "Mid", "Sup")', example: 'Mid' }),
      }),
    },
    responses: {
      200: {
        description: 'A list of champions classified by their performance in the current meta (Tier List)',
        content: {
          'application/json': {
            schema: z.array(ChampionMetaTierListSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(championsMetaTierListRoute, async (c: Context) => {
    const db = c.get('db');
    const patch = c.req.query('patch');
    const role = c.req.query('role');

    try {
      let query = 'SELECT champion as champion_name, position as role, AVG(CASE WHEN result = 1 THEN 1.0 ELSE 0.0 END) as win_rate, COUNT(*) as total_games FROM player_match_stats GROUP BY champion, position';
      const params: (string | number)[] = [];
      const conditions: string[] = [];

      if (patch) {
        // This assumes 'patch' is a column in player_match_stats or can be joined from 'matches'
        // For now, we'll assume it's directly available or we'll need to adjust the query
        // For a real implementation, you'd likely join with the matches table on gameid
        // and filter by matches.patch
        // Example: conditions.push('pms.patch = $X');
        // For simplicity, let's assume a direct filter if a patch column existed.
        // Since it doesn't, we'll skip direct patch filtering for now or need a more complex join.
      }
      if (role) {
        conditions.push('position = $1');
        params.push(role);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY win_rate DESC LIMIT 10'; // Example: order by win rate and limit

      const totalMatchesResult = await db.query('SELECT COUNT(*) FROM matches');
      const total_matches = parseInt(totalMatchesResult.rows[0].count);

      const { rows } = await db.query(query, params);

      // This is a simplified calculation for pick_rate and tier.
      // A real implementation would require more data and complex logic.
      const metaTierList = rows.map((row: any) => ({
        champion_name: row.champion_name,
        role: row.role,
        pick_rate: parseFloat((row.total_games / total_matches).toFixed(2)),
        win_rate: parseFloat(row.win_rate.toFixed(2)),
        tier: 'A', // Placeholder: Logic to determine tier (S+, S, A, B, C) would be complex
      }));

      return c.json(metaTierList as ChampionMetaTierList[]);
    } catch (error: any) {
      console.error('Error fetching champions meta tier list:', error.message || error);
      return c.json({ error: 'Failed to fetch champions meta tier list', details: error.message || 'unknown error' }, 500);
    }
  });

  // News Recent Activity Route
  const newsRecentActivityRoute = createRoute({
    method: 'get',
    path: '/news/recent-activity',
    request: {
      query: z.object({
        limit: z.coerce.number().int().positive().optional().openapi({ description: 'Number of items to return', example: 5 }),
      }),
    },
    responses: {
      200: {
        description: 'A feed of recent activities and events',
        content: {
          'application/json': {
            schema: z.array(NewsRecentActivitySchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(newsRecentActivityRoute, async (c: Context) => {
    const db = c.get('db');
    const limit = Number(c.req.query('limit')) || 5;

    try {
      // This is a placeholder. A real implementation would involve a dedicated 'news' or 'activity_log' table
      // or complex queries joining multiple tables to generate relevant events.
      // For now, we'll return some dummy data.
      const recentActivity: NewsRecentActivity[] = [
        { type: 'match_event', title: 'T1 vs GEN - Baron steal decide la partida', timestamp: 'hace 2h', game_id: 'game_123' },
        { type: 'player_streak', title: 'Ambessa 12-game win streak en LCK', timestamp: 'hace 4h', player_id: 'player_456' },
      ];

      return c.json(recentActivity);
    } catch (error: any) {
      console.error('Error fetching recent activity:', error.message || error);
      return c.json({ error: 'Failed to fetch recent activity', details: error.message || 'unknown error' }, 500);
    }
  });

  // Champion Stats Route
  const championStatsRoute = createRoute({
    method: 'get',
    path: '/champions/{champion_name}/stats',
    request: {
      params: z.object({
        champion_name: z.string().openapi({ description: 'Name of the champion', example: 'Rell' }),
      }),
      query: z.object({
        patch: z.string().optional().openapi({ description: 'Patch number to filter by', example: '15.01' }),
        role: z.string().optional().openapi({ description: 'Role of the champion (e.g., "Top", "Mid", "Sup")', example: 'Support' }),
      }),
    },
    responses: {
      200: {
        description: 'Detailed statistics for a specific champion',
        content: {
          'application/json': {
            schema: ChampionStatsSchema,
          },
        },
      },
      404: {
        description: 'Champion not found or no stats available',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(championStatsRoute, async (c: Context) => {
    const db = c.get('db');
    const champion_name = c.req.param('champion_name');
    const patch = c.req.query('patch');
    const role = c.req.query('role');

    try {
      // This is a placeholder. A real implementation would involve complex queries
      // to calculate pick_rate, win_rate, ban_rate, KDA, performance by league, and matchups.
      // It would likely involve joining player_match_stats with matches and other tables.
      // For now, we'll return dummy data.
      const championStats: ChampionStats = {
        champion_name: champion_name,
        role: role || 'Support',
        pick_rate: 0.71,
        win_rate: 0.58,
        ban_rate: 0.23,
        total_games: 1247,
        avg_kda: 5.11,
        performance_by_league: { 'LCK': { win_rate: 0.62, games: 89 }, 'LPL': { win_rate: 0.57, games: 156 } },
        best_matchups: [{ opponent_champion: 'Braum', win_rate: 0.71, games: 43 }],
        worst_matchups: [{ opponent_champion: 'Pyke', win_rate: 0.41, games: 29 }],
      };

      return c.json(championStats);
    } catch (error: any) {
      console.error(`Error fetching champion stats for ${champion_name}:`, error.message || error);
      return c.json({ error: 'Failed to fetch champion stats', details: error.message || 'unknown error' }, 500);
    }
  });

  // Champion Power Timeline Route
  const championPowerTimelineRoute = createRoute({
    method: 'get',
    path: '/champions/{champion_name}/power-timeline',
    request: {
      params: z.object({
        champion_name: z.string().openapi({ description: 'Name of the champion', example: 'Rell' }),
      }),
      query: z.object({
        patch: z.string().optional().openapi({ description: 'Patch number to filter by', example: '15.01' }),
        role: z.string().optional().openapi({ description: 'Role of the champion (e.g., "Top", "Mid", "Sup")', example: 'Support' }),
      }),
    },
    responses: {
      200: {
        description: 'Evolution of a champion\'s power (Win Rate) over game duration',
        content: {
          'application/json': {
            schema: ChampionPowerTimelineSchema,
          },
        },
      },
      404: {
        description: 'Champion not found or no power timeline data available',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(championPowerTimelineRoute, async (c: Context) => {
    const db = c.get('db');
    const champion_name = c.req.param('champion_name');
    const patch = c.req.query('patch');
    const role = c.req.query('role');

    try {
      // This is a placeholder. A real implementation would involve querying
      // player_match_stats and matches to calculate win rates at different game minutes.
      // For now, we'll return dummy data.
      const championPowerTimeline: ChampionPowerTimeline = {
        champion_name: champion_name,
        win_rate_by_minute: [
          { minute: 0, win_rate: 0.5 },
          { minute: 5, win_rate: 0.59 },
          { minute: 15, win_rate: 0.59 },
          { minute: 35, win_rate: 0.61 },
        ],
        strengths: ['Early game (0-15 min): 59% WR - Engage y roaming', 'Late game (35+ min): 61% WR - Teamfight presence'],
      };

      return c.json(championPowerTimeline);
    } catch (error: any) {
      console.error(`Error fetching champion power timeline for ${champion_name}:`, error.message || error);
      return c.json({ error: 'Failed to fetch champion power timeline', details: error.message || 'unknown error' }, 500);
    }
  });

  // Player Stats Route
  const playerStatsRoute = createRoute({
    method: 'get',
    path: '/players/{player_id}/stats',
    request: {
      params: z.object({
        player_id: z.string().openapi({ description: 'ID of the player', example: 'faker_id' }),
      }),
      query: z.object({
        year: z.coerce.number().int().optional().openapi({ description: 'Year of the season', example: 2024 }),
      }),
    },
    responses: {
      200: {
        description: 'Detailed statistics for a specific player',
        content: {
          'application/json': {
            schema: PlayerStatsSchema,
          },
        },
      },
      404: {
        description: 'Player not found or no stats available',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(playerStatsRoute, async (c: Context) => {
    const db = c.get('db');
    const player_id = c.req.param('player_id');
    const year = c.req.query('year');

    try {
      // This is a placeholder. A real implementation would involve complex queries
      // to calculate player statistics, champion pool, and comparison stats.
      // It would likely involve joining player_match_stats with players and matches.
      // For now, we'll return dummy data.
      const playerStats: PlayerStats = {
        player_name: 'Faker',
        team_name: 'T1',
        role: 'Mid Laner',
        season_stats: { games: 67, win_rate: 0.73, kda: 6.89, damage_share: 0.312, gpm: 421, cspm: 8.9 },
        champion_pool: [{ champion_name: 'Azir', games: 15, win_rate: 0.87 }, { champion_name: 'Orianna', games: 12, win_rate: 0.75 }],
        comparison_stats: { LCK_mid_avg: { kda: 4.23, damage: 28.1, gold: 387 }, rankings: { kda: 1, damage: 2, gold: 1 } },
      };

      return c.json(playerStats);
    } catch (error: any) {
      console.error(`Error fetching player stats for ${player_id}:`, error.message || error);
      return c.json({ error: 'Failed to fetch player stats', details: error.message || 'unknown error' }, 500);
    }
  });

  // Player Compare Route
  const playerCompareRoute = createRoute({
    method: 'get',
    path: '/players/compare',
    request: {
      query: z.object({
        player_ids: z.string().openapi({ description: 'Comma-separated list of player IDs', example: 'faker_id,showmaker_id' }),
        year: z.coerce.number().int().optional().openapi({ description: 'Year of the season', example: 2024 }),
        role: z.string().optional().openapi({ description: 'Role of the players (e.g., "Mid")', example: 'Mid' }),
      }),
    },
    responses: {
      200: {
        description: 'Comparison of statistics for multiple players',
        content: {
          'application/json': {
            schema: z.array(PlayerComparisonSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(playerCompareRoute, async (c: Context) => {
    const db = c.get('db');
    const player_ids_str = c.req.query('player_ids');
    const year = c.req.query('year');
    const role = c.req.query('role');

    try {
      const player_ids = player_ids_str ? player_ids_str.split(',') : [];
      // This is a placeholder. A real implementation would involve fetching and comparing
      // statistics for each player ID.
      // For now, we'll return dummy data based on the example.
      const playerComparisons: PlayerComparison[] = [
        { player_id: 'faker_id', player_name: 'Faker', games: 67, win_rate: 0.73, kda: 6.89, dpm: 621, gpm: 421, cspm: 8.9, champion_pool_size: 8, most_played_champion: 'Azir' },
        { player_id: 'showmaker_id', player_name: 'ShowMaker', games: 43, win_rate: 0.58, kda: 4.12, dpm: 587, gpm: 398, cspm: 8.6, champion_pool_size: 12, most_played_champion: 'Orianna' },
      ];

      return c.json(playerComparisons);
    } catch (error: any) {
      console.error('Error fetching player comparisons:', error.message || error);
      return c.json({ error: 'Failed to fetch player comparisons', details: error.message || 'unknown error' }, 500);
    }
  });

  // Draft Analysis Route
  const draftAnalysisRoute = createRoute({
    method: 'get',
    path: '/draft/analysis',
    request: {
      query: z.object({
        patch: z.string().optional().openapi({ description: 'Patch number to filter by', example: '15.01' }),
        league: z.string().optional().openapi({ description: 'League to filter by', example: 'LCK' }),
      }),
    },
    responses: {
      200: {
        description: 'Analysis of champion selection and banning phase',
        content: {
          'application/json': {
            schema: DraftAnalysisSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(draftAnalysisRoute, async (c: Context) => {
    const db = c.get('db');
    const patch = c.req.query('patch');
    const league = c.req.query('league');

    try {
      // This is a placeholder. A real implementation would involve complex queries
      // to analyze pick/ban rates, flex picks, and counter picks.
      // For now, we'll return dummy data.
      const draftAnalysis: DraftAnalysis = {
        pick_priority: [{ champion_name: 'K\'Sante', role: 'Top', first_pick_win_rate: 0.67, first_picks_count: 23 }],
        ban_priority: [{ champion_name: 'Ambessa', ban_rate: 0.89, total_games_in_patch: 203 }],
        flex_picks: [{ champion_name: 'Corki', roles: ['Mid', 'ADC'], global_win_rate: 0.55 }],
        counter_picks: [{ champion_name: 'Ambessa', vs_champion: 'K\'Sante', win_rate: 0.71, games: 17 }],
      };

      return c.json(draftAnalysis);
    } catch (error: any) {
      console.error('Error fetching draft analysis:', error.message || error);
      return c.json({ error: 'Failed to fetch draft analysis', details: error.message || 'unknown error' }, 500);
    }
  });

  // Team Compositions Winning Route
  const teamCompositionsWinningRoute = createRoute({
    method: 'get',
    path: '/team-compositions/winning',
    request: {
      query: z.object({
        patch: z.string().optional().openapi({ description: 'Patch number to filter by', example: '15.01' }),
        league: z.string().optional().openapi({ description: 'League to filter by', example: 'LCK' }),
      }),
    },
    responses: {
      200: {
        description: 'List of most successful team compositions',
        content: {
          'application/json': {
            schema: z.array(TeamCompositionSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(teamCompositionsWinningRoute, async (c: Context) => {
    const db = c.get('db');
    const patch = c.req.query('patch');
    const league = c.req.query('league');

    try {
      // This is a placeholder. A real implementation would involve complex queries
      // to identify and rank winning team compositions.
      // For now, we'll return dummy data.
      const teamCompositions: TeamComposition[] = [
        { name: 'ENGAGE COMP', win_rate: 0.64, games: 89, description: 'Tank Top + Engage Sup + AoE Mid + Hypercarry ADC', example_champions: ['K\'Sante', 'Rell', 'Orianna', 'Jinx', 'Ivern'] },
      ];

      return c.json(teamCompositions);
    } catch (error: any) {
      console.error('Error fetching winning team compositions:', error.message || error);
      return c.json({ error: 'Failed to fetch winning team compositions', details: error.message || 'unknown error' }, 500);
    }
  });

  // Leagues Meta Comparison Route
  const leaguesMetaComparisonRoute = createRoute({
    method: 'get',
    path: '/leagues/meta-comparison',
    request: {
      query: z.object({
        league_ids: z.string().openapi({ description: 'Comma-separated list of league IDs', example: 'LCK,LPL' }),
        year: z.coerce.number().int().optional().openapi({ description: 'Year of the season', example: 2024 }),
        split: z.string().optional().openapi({ description: 'Split of the season (e.g., "Spring")', example: 'Spring' }),
      }),
    },
    responses: {
      200: {
        description: 'Comparison of meta characteristics between different leagues',
        content: {
          'application/json': {
            schema: LeagueMetaComparisonSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(leaguesMetaComparisonRoute, async (c: Context) => {
    const db = c.get('db');
    const league_ids_str = c.req.query('league_ids');
    const year = c.req.query('year');
    const split = c.req.query('split');

    try {
      const league_ids = league_ids_str ? league_ids_str.split(',') : [];
      // This is a placeholder. A real implementation would involve fetching and comparing
      // meta characteristics for each league.
      // For now, we'll return dummy data based on the example.
      const metaComparison: LeagueMetaComparison = {
        LCK: { avg_game_time_min: 34.2, avg_kills_per_game: 12.4, most_picked_champions: ['K\'Sante', 'Rell', 'Corki'], unique_meta_description: 'Control mages, scaling comps' },
        LPL: { avg_game_time_min: 31.8, avg_kills_per_game: 16.8, most_picked_champions: ['Ambessa', 'Varus', 'Wukong'], unique_meta_description: 'Aggressive early game, high kill counts' },
      };

      return c.json(metaComparison);
    } catch (error: any) {
      console.error('Error fetching league meta comparison:', error.message || error);
      return c.json({ error: 'Failed to fetch league meta comparison', details: error.message || 'unknown error' }, 500);
    }
  });

  // Patches Evolution Route
  const patchesEvolutionRoute = createRoute({
    method: 'get',
    path: '/patches/{patch_number}/evolution',
    request: {
      params: z.object({
        patch_number: z.string().openapi({ description: 'Patch number', example: '15.01' }),
      }),
    },
    responses: {
      200: {
        description: 'Evolution of champion meta over weeks within a patch',
        content: {
          'application/json': {
            schema: PatchEvolutionSchema,
          },
        },
      },
      404: {
        description: 'Patch not found or no evolution data available',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(patchesEvolutionRoute, async (c: Context) => {
    const db = c.get('db');
    const patch_number = c.req.param('patch_number');

    try {
      // This is a placeholder. A real implementation would involve complex queries
      // to track champion performance changes over time within a patch.
      // For now, we'll return dummy data.
      const patchEvolution: PatchEvolution = {
        patch_number: patch_number,
        weeks: [
          { week_start_date: 'Jan 11', emerging_champions: [{ champion_name: 'Ambessa', win_rate_change: '+22%', pick_rate_change: '+22%' }], declining_champions: [], stable_champions: [] },
          { week_start_date: 'Jan 18', emerging_champions: [{ champion_name: 'Ambessa', win_rate_change: '+11%', pick_rate_change: '+11%' }], declining_champions: [], stable_champions: [] },
        ],
      };

      return c.json(patchEvolution);
    } catch (error: any) {
      console.error(`Error fetching patch evolution for ${patch_number}:`, error.message || error);
      return c.json({ error: 'Failed to fetch patch evolution', details: error.message || 'unknown error' }, 500);
    }
  });

  // Champion Historical Performance Route
  const championHistoricalPerformanceRoute = createRoute({
    method: 'get',
    path: '/champions/{champion_name}/historical-performance',
    request: {
      params: z.object({
        champion_name: z.string().openapi({ description: 'Name of the champion', example: 'Rell' }),
      }),
    },
    responses: {
      200: {
        description: 'Historical performance of a champion across seasons',
        content: {
          'application/json': {
            schema: ChampionHistoricalPerformanceSchema,
          },
        },
      },
      404: {
        description: 'Champion not found or no historical performance data available',
        content: {
          'application/json': {
            schema: NotFoundSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(championHistoricalPerformanceRoute, async (c: Context) => {
    const db = c.get('db');
    const champion_name = c.req.param('champion_name');

    try {
      // This is a placeholder. A real implementation would involve querying
      // historical data for champion performance across seasons.
      // For now, we'll return dummy data.
      const historicalPerformance: ChampionHistoricalPerformance = {
        champion_name: champion_name,
        season_data: [
          { season: '2024', split: 'Spring', pick_rate: 0.23, win_rate: 0.52, notes: 'Underplayed' },
          { season: '2024', split: 'Summer', pick_rate: 0.67, win_rate: 0.58, notes: 'Meta staple' },
        ],
        prediction: 'Nerfs in 15.02 based on dominance',
      };

      return c.json(historicalPerformance);
    } catch (error: any) {
      console.error(`Error fetching champion historical performance for ${champion_name}:`, error.message || error);
      return c.json({ error: 'Failed to fetch champion historical performance', details: error.message || 'unknown error' }, 500);
    }
  });

  // Match Prediction Route
  const matchPredictionRoute = createRoute({
    method: 'post',
    path: '/predictions/match',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              team1_id: z.string().openapi({ example: 'T1_ID' }),
              team2_id: z.string().openapi({ example: 'GEN_ID' }),
              recent_games_count: z.number().int().optional().openapi({ example: 10 }),
              player_lineups: z.record(z.array(z.string())).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Prediction for the outcome of a match',
        content: {
          'application/json': {
            schema: MatchPredictionSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(matchPredictionRoute, async (c: Context) => {
    const db = c.get('db');
    const body = await c.req.json();

    try {
      // This is a placeholder. A real implementation would involve a machine learning model
      // to predict match outcomes based on input data.
      // For now, we'll return dummy data.
      const matchPrediction: MatchPrediction = {
        team1_id: body.team1_id,
        team2_id: body.team2_id,
        team1_win_probability: 0.67,
        most_likely_score: '2-1 T1',
        confidence: 'High',
        key_factors: ['T1\'s better recent form (+10% WR)', 'Historical advantage in Bo3s', 'Faker\'s 89% WR vs GEN midlaners'],
      };

      return c.json(matchPrediction);
    } catch (error: any) {
      console.error('Error making match prediction:', error.message || error);
      return c.json({ error: 'Failed to make match prediction', details: error.message || 'unknown error' }, 500);
    }
  });

  // Champion Recommendation Route
  const championRecommendationRoute = createRoute({
    method: 'post',
    path: '/recommendations/champion',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              side: z.string().openapi({ example: 'Blue' }),
              pick_number: z.number().int().openapi({ example: 3 }),
              role: z.string().openapi({ example: 'Mid Lane' }),
              enemy_team_champions: z.array(z.string()).openapi({ example: ['K\'Sante', 'Graves', 'Varus', 'Rell'] }),
              your_team_champions: z.array(z.string()).openapi({ example: ['Ambessa', 'Wukong', 'Ezreal', 'Leona'] }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Recommended champions based on specific draft situation',
        content: {
          'application/json': {
            schema: ChampionRecommendationSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(championRecommendationRoute, async (c: Context) => {
    const db = c.get('db');
    const body = await c.req.json();

    try {
      // This is a placeholder. A real implementation would involve a machine learning model
      // to recommend champions based on draft situation.
      // For now, we'll return dummy data.
      const championRecommendation: ChampionRecommendation = {
        situation: body,
        recommendations: [
          { champion_name: 'Orianna', tier: 'S+', win_rate_vs_comp_type: 0.73, reasons: ['Strong teamfight synergy with Wukong', 'Good into Graves/Varus'] },
          { champion_name: 'Azir', tier: 'S+', win_rate_vs_comp_type: 0.68, reasons: ['Excellent scaling vs enemy comp', 'Safe blind pick'] },
        ],
        avoid_champions: [{ champion_name: 'Hwei', reason: '34% WR vs dive comps' }],
      };

      return c.json(championRecommendation);
    } catch (error: any) {
      console.error('Error fetching champion recommendations:', error.message || error);
      return c.json({ error: 'Failed to fetch champion recommendations', details: error.message || 'unknown error' }, 500);
    }
  });

  // Meta Shift Alerts Route
  const metaShiftAlertsRoute = createRoute({
    method: 'get',
    path: '/alerts/meta-shifts',
    responses: {
      200: {
        description: 'Alerts about significant meta shifts',
        content: {
          'application/json': {
            schema: MetaShiftAlertSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(metaShiftAlertsRoute, async (c: Context) => {
    const db = c.get('db');

    try {
      // This is a placeholder. A real implementation would involve analyzing meta trends
      // and generating alerts.
      // For now, we'll return dummy data.
      const metaShiftAlert: MetaShiftAlert = {
        timestamp: new Date().toISOString(),
        rising_threats: [{ champion_name: 'Ambessa', role: 'Top', win_rate_trend: '78% WR', pick_rate_trend: '+23%' }],
        declining_picks: [{ champion_name: 'Maokai', role: 'Jng', win_rate_trend: '47% WR', pick_rate_trend: '-18%' }],
        immediate_actions: ['Consider banning Ambessa in high-priority matches', 'Practice Pyke matchups vs Rell'],
      };

      return c.json(metaShiftAlert);
    } catch (error: any) {
      console.error('Error fetching meta shift alerts:', error.message || error);
      return c.json({ error: 'Failed to fetch meta shift alerts', details: error.message || 'unknown error' }, 500);
    }
  });

  // Player Performance Alerts Route
  const playerPerformanceAlertsRoute = createRoute({
    method: 'get',
    path: '/alerts/player-performance',
    request: {
      query: z.object({
        player_id: z.string().optional().openapi({ description: 'Player ID for specific alerts', example: 'faker_id' }),
      }),
    },
    responses: {
      200: {
        description: 'Personalized alerts about player performance',
        content: {
          'application/json': {
            schema: PlayerPerformanceAlertSchema,
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  app.openapi(playerPerformanceAlertsRoute, async (c: Context) => {
    const db = c.get('db');
    const player_id = c.req.query('player_id');

    try {
      // This is a placeholder. A real implementation would involve analyzing player performance
      // and generating personalized alerts.
      // For now, we'll return dummy data.
      const playerPerformanceAlert: PlayerPerformanceAlert = {
        timestamp: new Date().toISOString(),
        hot_streaks: [{ player_name: 'Faker', team_name: 'T1', description: '12 game win streak with 8.2 KDA' }],
        concerning_trends: [{ player_name: 'Showmaker', team_name: 'KT', description: '3 consecutive losses, 1.8 KDA' }],
        injury_alerts: [{ player_name: 'Zeus', team_name: 'T1', description: 'Wrist injury, Kiin subbing in' }],
      };

      return c.json(playerPerformanceAlert);
    } catch (error: any) {
      console.error('Error fetching player performance alerts:', error.message || error);
      return c.json({ error: 'Failed to fetch player performance alerts', details: error.message || 'unknown error' }, 500);
    }
  });



  };
