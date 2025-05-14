import { createClient } from "@supabase/supabase-js";

import {
  Route,
  Station,
  RouteStationDirection,
  BoardingPosition,
  ResultInfo,
} from "../types/data";

// SupabaseのURLとAnon Keyを環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されているか確認
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key environment variables.");
}

// Supabaseクライアントインスタンスを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//--- データ取得関数 ---

// routes テーブルから全ての路線を取得
export async function fetchRoutes(): Promise<Route[] | null> {
  const { data, error } = await supabase
    .from("routes") // テーブル名
    .select("*"); // 全てのカラムを選択

  if (error) {
    console.error("Error fetching routes:", error);
    return null;
  }
  return data; // 取得したデータを Route[] 型として返す
}

// stations テーブルから全ての駅を取得
export async function fetchStations(): Promise<Station[] | null> {
  const { data, error } = await supabase
    .from("stations") // テーブル名
    .select("*");

  if (error) {
    console.error("Error fetching stations:", error);
    return null;
  }
  return data; // 取得したデータを Station[] 型として返す
}

// route_station_directions テーブルから全ての方面を取得
export async function fetchDirections(): Promise<
  RouteStationDirection[] | null
> {
  const { data, error } = await supabase
    .from("route_station_directions") // テーブル名
    .select("*");

  if (error) {
    console.error("Error fetching directions:", error);
    return null;
  }
  return data; // 取得したデータを RouteStationDirection[] 型として返す
}

// boarding_positions テーブルから全ての乗車位置を取得
export async function fetchBoardingPositions(): Promise<
  BoardingPosition[] | null
> {
  const { data, error } = await supabase
    .from("boarding_positions") // テーブル名
    .select("*")
    .order("order", { ascending: true }); // 表示順序でソート

  if (error) {
    console.error("Error fetching boarding positions:", error);
    return null;
  }
  return data; // 取得したデータを BoardingPosition[] 型として返す
}

// 選択された条件に基づいて result_mappings から結果を取得する関数
export async function fetchResultMapping(
  routeId: string,
  directionId: string,
  boardingPositionId: string,
): Promise<ResultInfo | null> {
  console.log("Attempting to fetch result mapping with:", {
    routeId,
    directionId,
    boardingPositionId,
  }); // 検索条件ログ

  const { data, error } = await supabase
    .from("result_mappings") // result_mappings テーブルから取得
    .select("*") // 全てのカラムを選択
    .eq("route_id", routeId) // 路線IDでフィルタリング
    .eq("direction_id", directionId) // 方面IDでフィルタリング
    .eq("boarding_position_id", boardingPositionId) // 乗車位置IDでフィルタリング
    .single(); // 結果は1件のみを想定

  if (error) {
    // データが見つからない場合もエラーとして扱われることがあります（例えば .single() を使った場合）
    // その場合は error.code や error.message を確認して適切にハンドリングします。
    // ここではシンプルにログ出力します。
    console.error("Error fetching result mapping:", error);
    // データが見つからなかった場合は null を返します
    if (error.code === "PGRST116") {
      // .single() で0件だった場合のエラーコード例
      console.log("Result mapping not found for the selected criteria.");
      return null;
    }
    return null; // その他のエラーの場合も null を返す
  }

  console.log("Fetched result mapping:", data); // 取得データログ
  return data; // 取得したデータを ResultInfo 型として返す
}
