-- supabase/migrations/[timestamp]_create_initial_schema.sql
-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. routes テーブル
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ja TEXT NOT NULL,
  name_en TEXT,
  color TEXT,
  transport_type TEXT -- 'subway', 'jr', 'private_railway' など
);

-- 2. stations テーブル
CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ja TEXT NOT NULL,
  name_en TEXT,
  prefecture_ja TEXT,
  prefecture_en TEXT,
  city_ja TEXT,
  city_en TEXT,
  latitude DECIMAL,
  longitude DECIMAL
);

-- 3. route_station_directions テーブル
CREATE TABLE route_station_directions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  destination_station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  name_ja TEXT NOT NULL,
  name_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 特定の路線と終着駅の組み合わせはユニーク
  UNIQUE (route_id, destination_station_id)
);

-- 4. boarding_positions テーブル
CREATE TABLE boarding_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_key TEXT NOT NULL UNIQUE,
  -- 例: 'front', 'middle', 'rear'
  name_ja TEXT NOT NULL,
  name_en TEXT,
  "order" INTEGER NOT NULL -- 表示順序
);

-- 5. result_mappings テーブル
CREATE TABLE result_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  alighting_station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  direction_id UUID NOT NULL REFERENCES route_station_directions(id) ON DELETE CASCADE,
  boarding_position_id UUID NOT NULL REFERENCES boarding_positions(id) ON DELETE CASCADE,
  arrival_area_ja TEXT,
  arrival_area_en TEXT,
  closest_exit_ja TEXT,
  closest_exit_en TEXT,
  closest_transfer_lines_ja JSONB,
  closest_transfer_lines_en JSONB,
  notes_ja TEXT,
  notes_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 特定の路線、降車駅、方面、乗車位置の組み合わせはユニーク
  UNIQUE (
    route_id,
    alighting_station_id,
    direction_id,
    boarding_position_id
  )
);

-- created_at と updated_at の自動更新トリガー (オプションですが便利です)
-- result_mappings テーブルの updated_at を自動更新
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_result_mappings_updated_at BEFORE
UPDATE
  ON result_mappings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();