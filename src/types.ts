export interface Match {
  gameid: string;
  datacompleteness: string;
  url: string;
  league: string;
  year: number;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: number;
  gamelength: number;
  winner_teamid: string;
}

export interface Team {
  teamid: string;
  teamname: string;
}

export interface Player {
  playerid: string;
  playername: string;
}

export interface TeamMatchStat {
  "Unnamed: 0": number;
  gameid: string;
  teamid: string;
  side: string;
  result: number;
  teamkills: number;
  teamdeaths: number;
  ban1: string;
  ban2: string;
  ban3: string;
  ban4: string;
  ban5: string;
  firstdragon: number;
  dragons: number;
  opp_dragons: number;
  elementaldrakes: number;
  opp_elementaldrakes: number;
  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;
  "dragons (type unknown)": number;
  elders: number;
  opp_elders: number;
  firstherald: number;
  heralds: number;
  opp_heralds: number;
  void_grubs: number;
  opp_void_grubs: number;
  firstbaron: number;
  barons: number;
  opp_barons: number;
  atakhans: number;
  opp_atakhans: number;
  firsttower: number;
  towers: number;
  opp_towers: number;
  firstmidtower: number;
  firsttothreetowers: number;
  turretplates: number;
  opp_turretplates: number;
  inhibitors: number;
  opp_inhibitors: number;
  "team kpm": number;
  ckpm: number;
}

export interface PlayerMatchStat {
  participantid: number;
  gameid: string;
  playerid: string;
  teamid: string;
  side: string;
  position: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  doublekills: number;
  triplekills: number;
  quadrakills: number;
  pentakills: number;
  firstblood: number;
  firstbloodkill: number;
  firstbloodassist: number;
  firstbloodvictim: number;
  damagetochampions: number;
  dpm: number;
  damageshare: number;
  damagetakenperminute: number;
  damagemitigatedperminute: number;
  wardsplaced: number;
  wpm: number;
  wardskilled: number;
  wcpm: number;
  controlwardsbought: number;
  visionscore: number;
  vspm: number;
  totalgold: number;
  earnedgold: number;
  "earned gpm": number;
  earnedgoldshare: number;
  goldspent: number;
  gspd: number;
  gpr: number;
  "total cs": number;
  minionkills: number;
  monsterkills: number;
  monsterkillsownjungle: number;
  monsterkillsenemyjungle: number;
  cspm: number;
  goldat10: number;
  xpat10: number;
  csat10: number;
  opp_goldat10: number;
  opp_xpat10: number;
  opp_csat10: number;
  golddiffat10: number;
  xpdiffat10: number;
  csdiffat10: number;
  killsat10: number;
  assistsat10: number;
  deathsat10: number;
  opp_killsat10: number;
  opp_assistsat10: number;
  opp_deathsat10: number;
  goldat15: number;
  xpat15: number;
  csat15: number;
  opp_goldat15: number;
  opp_xpat15: number;
  opp_csat15: number;
  golddiffat15: number;
  xpdiffat15: number;
  csdiffat15: number;
  killsat15: number;
  assistsat15: number;
  deathsat15: number;
  opp_killsat15: number;
  opp_assistsat15: number;
  opp_deathsat15: number;
  pick1: string;
  pick2: string;
  pick3: string;
  pick4: string;
  pick5: string;
}

export interface DashboardSummary {
  total_matches: number;
  total_champions: number;
  total_players: number;
  avg_game_length_min: number;
  avg_kills_per_game: number;
  blue_side_win_rate: number;
  changes: {
    total_matches_pct_change_week: number;
    total_champions_new_week: number;
    total_players_new_week: number;
    avg_game_length_min_change: number;
    avg_kills_per_game_change: number;
    blue_side_win_rate_change: number;
  };
}

export interface ChampionMetaTierList {
  champion_name: string;
  role: string;
  pick_rate: number;
  win_rate: number;
  tier: string;
}

export interface NewsRecentActivity {
  type: string;
  title: string;
  timestamp: string;
  game_id?: string;
  player_id?: string;
}

export interface ChampionStats {
  champion_name: string;
  role: string;
  pick_rate: number;
  win_rate: number;
  ban_rate: number;
  total_games: number;
  avg_kda: number;
  performance_by_league: { [key: string]: { win_rate: number; games: number } };
  best_matchups: { opponent_champion: string; win_rate: number; games: number }[];
  worst_matchups: { opponent_champion: string; win_rate: number; games: number }[];
}

export interface ChampionPowerTimeline {
  champion_name: string;
  win_rate_by_minute: { minute: number; win_rate: number }[];
  strengths: string[];
}

export interface PlayerStats {
  player_name: string;
  team_name: string;
  role: string;
  season_stats: {
    games: number;
    win_rate: number;
    kda: number;
    damage_share: number;
    gpm: number;
    cspm: number;
  };
  champion_pool: { champion_name: string; games: number; win_rate: number }[];
  comparison_stats: {
    LCK_mid_avg: { kda: number; damage: number; gold: number };
    rankings: { kda: number; damage: number; gold: number };
  };
}

export interface PlayerComparison {
  player_id: string;
  player_name: string;
  games: number;
  win_rate: number;
  kda: number;
  dpm: number;
  gpm: number;
  cspm: number;
  champion_pool_size: number;
  most_played_champion: string;
}

export interface DraftAnalysis {
  pick_priority: { champion_name: string; role: string; first_pick_win_rate: number; first_picks_count: number }[];
  ban_priority: { champion_name: string; ban_rate: number; total_games_in_patch: number }[];
  flex_picks: { champion_name: string; roles: string[]; global_win_rate: number }[];
  counter_picks: { champion_name: string; vs_champion: string; win_rate: number; games: number }[];
}

export interface TeamComposition {
  name: string;
  win_rate: number;
  games: number;
  description: string;
  example_champions: string[];
}

export interface LeagueMetaComparison {
  [league_id: string]: {
    avg_game_time_min: number;
    avg_kills_per_game: number;
    most_picked_champions: string[];
    unique_meta_description: string;
  };
}

export interface PatchEvolution {
  patch_number: string;
  weeks: {
    week_start_date: string;
    emerging_champions: { champion_name: string; win_rate_change: string; pick_rate_change: string }[];
    declining_champions: { champion_name: string; win_rate_trend: string; pick_rate_trend: string }[];
    stable_champions: { champion_name: string; win_rate: number; pick_rate: number }[];
  }[];
}

export interface ChampionHistoricalPerformance {
  champion_name: string;
  season_data: {
    season: string;
    split: string;
    pick_rate: number;
    win_rate: number;
    notes: string;
  }[];
  prediction: string;
}

export interface MatchPrediction {
  team1_id: string;
  team2_id: string;
  team1_win_probability: number;
  most_likely_score: string;
  confidence: string;
  key_factors: string[];
}

export interface ChampionRecommendation {
  situation: {
    side: string;
    pick_number: number;
    role: string;
    enemy_team_champions: string[];
    your_team_champions: string[];
  };
  recommendations: {
    champion_name: string;
    tier: string;
    win_rate_vs_comp_type: number;
    reasons: string[];
  }[];
  avoid_champions: { champion_name: string; reason: string }[];
}

export interface MetaShiftAlert {
  timestamp: string;
  rising_threats: { champion_name: string; role: string; win_rate_trend: string; pick_rate_trend: string }[];
  declining_picks: { champion_name: string; role: string; win_rate_trend: string; pick_rate_trend: string }[];
  immediate_actions: string[];
}

export interface PlayerPerformanceAlert {
  timestamp: string;
  hot_streaks: { player_name: string; team_name: string; description: string }[];
  concerning_trends: { player_name: string; team_name: string; description: string }[];
  injury_alerts: { player_name: string; team_name: string; description: string }[];
}
