import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { Context } from 'hono';
import { Match, Team, Player, TeamMatchStat, PlayerMatchStat } from './types';

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

  // Team Match Stats routes
  const teamMatchStatsRoute = createRoute({
    method: 'get',
    path: '/team-match-stats',
    responses: {
      200: {
        description: 'A list of team match statistics',
        content: {
          'application/json': {
            schema: z.array(TeamMatchStatSchema),
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

  app.openapi(teamMatchStatsRoute, async (c: Context) => {
    const db = c.get('db');
    try {
      const { rows } = await db.query('SELECT * FROM team_match_stats');
      return c.json(rows as TeamMatchStat[]);
    } catch (error: any) {
      console.error('Error fetching team match stats:', error.message || error);
      return c.json({ error: 'Failed to fetch team match stats', details: error.message || 'unknown error' }, 500);
    }
  });

  // Team Match Stats by gameid route
  const teamMatchStatsByIdRoute = createRoute({
    method: 'get',
    path: '/team-match-stats/{gameid}',
    request: {
      params: z.object({
        gameid: z.string().openapi({ description: 'ID of the game', example: 'game_123' }),
      }),
    },
    responses: {
      200: {
        description: 'Team match statistics for a specific game',
        content: {
          'application/json': {
            schema: z.array(TeamMatchStatSchema),
          },
        },
      },
      404: {
        description: 'Team match stats not found for this gameid',
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

  app.openapi(teamMatchStatsByIdRoute, async (c: Context) => {
    const db = c.get('db');
    const gameid = c.req.param('gameid');
    try {
      const { rows } = await db.query('SELECT * FROM team_match_stats WHERE gameid = $1', [gameid]);
      if (rows.length > 0) {
        return c.json(rows as TeamMatchStat[]);
      } else {
        return c.json({ error: 'Team match stats not found for this gameid' }, 404);
      }
    } catch (error: any) {
      console.error(`Error fetching team match stats for gameid ${gameid}:`, error.message || error);
      return c.json({ error: 'Failed to fetch team match stats', details: error.message || 'unknown error' }, 500);
    }
  });

  // Player Match Stats routes
  const playerMatchStatsRoute = createRoute({
    method: 'get',
    path: '/player-match-stats',
    responses: {
      200: {
        description: 'A list of player match statistics',
        content: {
          'application/json': {
            schema: z.array(PlayerMatchStatSchema),
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

  app.openapi(playerMatchStatsRoute, async (c: Context) => {
    const db = c.get('db');
    try {
      const { rows } = await db.query('SELECT * FROM player_match_stats');
      return c.json(rows as PlayerMatchStat[]);
    } catch (error: any) {
      console.error('Error fetching player match stats:', error.message || error);
      return c.json({ error: 'Failed to fetch player match stats', details: error.message || 'unknown error' }, 500);
    }
  });

  // Player Match Stats by gameid route
  const playerMatchStatsByIdRoute = createRoute({
    method: 'get',
    path: '/player-match-stats/{gameid}',
    request: {
      params: z.object({
        gameid: z.string().openapi({ description: 'ID of the game', example: 'game_123' }),
      }),
    },
    responses: {
      200: {
        description: 'Player match statistics for a specific game',
        content: {
          'application/json': {
            schema: z.array(PlayerMatchStatSchema),
          },
        },
      },
      404: {
        description: 'Player match stats not found for this gameid',
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

  app.openapi(playerMatchStatsByIdRoute, async (c: Context) => {
    const db = c.get('db');
    const gameid = c.req.param('gameid');
    try {
      const { rows } = await db.query('SELECT * FROM player_match_stats WHERE gameid = $1', [gameid]);
      if (rows.length > 0) {
        return c.json(rows as PlayerMatchStat[]);
      } else {
        return c.json({ error: 'Player match stats not found for this gameid' }, 404);
      }
    } catch (error: any) {
      console.error(`Error fetching player match stats for gameid ${gameid}:`, error.message || error);
      return c.json({ error: 'Failed to fetch player match stats', details: error.message || 'unknown error' }, 500);
    }
  });
};
