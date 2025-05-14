-- supabase/migrations/[timestamp]_enable_rls_and_policies.sql

-- RLSを有効にする
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_station_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_mappings ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシーを作成 (認証済み/匿名ユーザーが読み取り可能)
CREATE POLICY "Allow public read access for routes"
ON routes FOR SELECT
TO authenticated, anon
USING (true); -- 全ての行に対して許可

CREATE POLICY "Allow public read access for stations"
ON stations FOR SELECT
TO authenticated, anon
USING (true); -- 全ての行に対して許可

CREATE POLICY "Allow public read access for route_station_directions"
ON route_station_directions FOR SELECT
TO authenticated, anon
USING (true); -- 全ての行に対して許可

CREATE POLICY "Allow public read access for boarding_positions"
ON boarding_positions FOR SELECT
TO authenticated, anon
USING (true); -- 全ての行に対して許可

CREATE POLICY "Allow public read access for result_mappings"
ON result_mappings FOR SELECT
TO authenticated, anon
USING (true); -- 全ての行に対して許可

-- INSERT, UPDATE, DELETE ポリシーは anon 向けには作成しない
-- これにより、RLS有効化によりデフォルトでこれらの操作は拒否されます。
-- もし認証済みユーザーや特定のロールに書き込みを許可したい場合は、ここに追加ポリシーを記述します。