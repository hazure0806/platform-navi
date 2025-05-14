-- supabase/migrations/[timestamp]_seed_initial_data.sql

-- 1. routes テーブルへのデータ投入
INSERT INTO routes (name_ja, name_en, color, transport_type) VALUES
('東山線', 'Higashiyama Line', '#F79B00', 'subway'),
('桜通線', 'Sakuradori Line', '#FF0099', 'subway');

-- 2. stations テーブルへのデータ投入
INSERT INTO stations (name_ja, name_en, prefecture_ja, prefecture_en, city_ja, city_en) VALUES
('名古屋', 'Nagoya', '愛知県', 'Aichi', '名古屋市', 'Nagoya'),
('藤が丘', 'Fujigaoka', '愛知県', 'Aichi', '名古屋市', 'Nagoya'),
('高畑', 'Takabata', '愛知県', 'Aichi', '名古屋市', 'Nagoya'),
('徳重', 'Tokushige', '愛知県', 'Aichi', '名古屋市', 'Nagoya'),
('中村区役所', 'Nakamura Kōen', '愛知県', 'Aichi', '名古屋市', 'Nagoya');

-- 3. boarding_positions テーブルへのデータ投入
INSERT INTO boarding_positions (position_key, name_ja, name_en, "order") VALUES
('front', '前方', 'Front', 1),
('middle', '中間', 'Middle', 2),
('rear', '後方', 'Rear', 3);

-- 4. route_station_directions テーブルへのデータ投入
INSERT INTO route_station_directions (route_id, destination_station_id, name_ja, name_en) VALUES
(
    (SELECT id FROM routes WHERE name_ja = '東山線'),
    (SELECT id FROM stations WHERE name_ja = '藤が丘'),
    '藤が丘方面',
    'For Fujigaoka'
),
(
    (SELECT id FROM routes WHERE name_ja = '東山線'),
    (SELECT id FROM stations WHERE name_ja = '高畑'),
    '高畑方面',
    'For Takabata'
),
(
    (SELECT id FROM routes WHERE name_ja = '桜通線'),
    (SELECT id FROM stations WHERE name_ja = '徳重'),
    '徳重方面',
    'For Tokushige'
),
(
    (SELECT id FROM routes WHERE name_ja = '桜通線'),
    (SELECT id FROM stations WHERE name_ja = '中村区役所'),
    '中村区役所方面',
    'For Nakamura Kōen'
);

-- 5. result_mappings テーブルへのテストデータ投入 (注意: これはテスト用の仮データです。後で正確なデータに置き換えてください。)

INSERT INTO result_mappings (route_id, alighting_station_id, direction_id, boarding_position_id, arrival_area_ja, arrival_area_en, closest_exit_ja, closest_exit_en, closest_transfer_lines_ja, closest_transfer_lines_en, notes_ja, notes_en) VALUES
-- 東山線 藤が丘方面行き 前方 で名古屋駅に到着 (テストデータ)
(
    (SELECT id FROM routes WHERE name_ja = '東山線'),
    (SELECT id FROM stations WHERE name_ja = '名古屋'),
    (SELECT id FROM route_station_directions WHERE name_ja = '藤が丘方面'),
    (SELECT id FROM boarding_positions WHERE position_key = 'front'),
    '【テスト】東山線藤が丘方面 前方到着エリア',
    '【Test】Higashiyama Fujigaoka Front Arrival Area',
    '【テスト】JR乗換・北口方面',
    '【Test】JR Transfer / North Exit Area',
    '["【テスト】JR線", "【テスト】名鉄線"]'::JSONB,
    '["【Test】JR Line", "【Test】Meitetsu Line"]'::JSONB,
    'これはテストデータです。',
    'This is test data.'
),
-- 東山線 藤が丘方面行き 中間 で名古屋駅に到着 (テストデータ)
(
    (SELECT id FROM routes WHERE name_ja = '東山線'),
    (SELECT id FROM stations WHERE name_ja = '名古屋'),
    (SELECT id FROM route_station_directions WHERE name_ja = '藤が丘方面'),
    (SELECT id FROM boarding_positions WHERE position_key = 'middle'),
    '【テスト】東山線藤が丘方面 中間到着エリア',
    '【Test】Higashiyama Fujigaoka Middle Arrival Area',
    '【テスト】中央改札・地下街方面',
    '【Test】Central Gate / Underground Mall Area',
    '["【テスト】地下街"]'::JSONB,
    '["【Test】Underground Mall"]'::JSONB,
    NULL,
    NULL
),
-- 東山線 高畑方面行き 後方 で名古屋駅に到着 (テストデータ)
(
    (SELECT id FROM routes WHERE name_ja = '東山線'),
    (SELECT id FROM stations WHERE name_ja = '名古屋'),
    (SELECT id FROM route_station_directions WHERE name_ja = '高畑方面'),
    (SELECT id FROM boarding_positions WHERE position_key = 'rear'),
    '【テスト】東山線高畑方面 後方到着エリア',
    '【Test】Higashiyama Takabata Rear Arrival Area',
    '【テスト】南改札・あおなみ線方面',
    '【Test】South Gate / Aonami Line Area',
    '["【テスト】あおなみ線"]'::JSONB,
    '["【Test】Aonami Line"]'::JSONB,
    NULL,
    NULL
),
-- 桜通線 徳重方面行き 前方 で名古屋駅に到着 (テストデータ)
(
    (SELECT id FROM routes WHERE name_ja = '桜通線'),
    (SELECT id FROM stations WHERE name_ja = '名古屋'),
    (SELECT id FROM route_station_directions WHERE name_ja = '徳重方面'),
    (SELECT id FROM boarding_positions WHERE position_key = 'front'),
    '【テスト】桜通線徳重方面 前方到着エリア',
    '【Test】Sakuradori Tokushige Front Arrival Area',
    '【テスト】東山線乗換口・北改札方面',
    '【Test】Higashiyama Line Transfer / North Gate Area',
    '["【テスト】東山線"]'::JSONB,
    '["【Test】Higashiyama Line"]'::JSONB,
    NULL,
    NULL
)