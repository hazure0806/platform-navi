// src/types/data.ts

// result_mappings の型定義は既にあるかもしれませんが、ここに移管または追記
export interface ResultInfo {
  id: string; // UUID
  route_id: string; // FK to routes
  alighting_station_id: string; // FK to stations
  direction_id: string; // FK to route_station_directions
  boarding_position_id: string; // FK to boarding_positions
  arrival_area_ja: string | null;
  arrival_area_en: string | null;
  closest_exit_ja: string | null;
  closest_exit_en: string | null;
  closest_transfer_lines_ja: string[] | null; // JSONBはTypeScriptでは通常配列やオブジェクトとして扱います
  closest_transfer_lines_en: string[] | null; // JSONB
  notes_ja: string | null;
  notes_en: string | null;
  created_at: string; // TIMESTAMPZ は string または Date として扱います
  updated_at: string;
}

// routes テーブルの型
export interface Route {
  id: string; // UUID
  name_ja: string;
  name_en: string | null;
  color: string | null;
  transport_type: string | null;
}

// stations テーブルの型
export interface Station {
  id: string; // UUID
  name_ja: string;
  name_en: string | null;
  prefecture_ja: string | null;
  prefecture_en: string | null;
  city_ja: string | null;
  city_en: string | null;
  latitude: number | null; // DECIMAL は number として扱います
  longitude: number | null;
}

// route_station_directions テーブルの型
export interface RouteStationDirection {
  id: string; // UUID
  route_id: string; // FK
  destination_station_id: string; // FK
  name_ja: string;
  name_en: string | null;
  created_at: string;
}

// boarding_positions テーブルの型
export interface BoardingPosition {
  id: string; // UUID
  position_key: string;
  name_ja: string;
  name_en: string | null;
  order: number; // INTEGER は number として扱います
}
