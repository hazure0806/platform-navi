import { atom } from "jotai";
// 定義した型をインポート
import {
  Route,
  Station,
  RouteStationDirection,
  BoardingPosition,
  ResultInfo, // 必要であれば
} from "../types/data";

//--- 選択状態のアトム (既存) ---
type SelectedRoute = Route["id"] | null; // IDで管理することも考慮
type SelectedDirection = RouteStationDirection["id"] | null; // IDで管理することも考慮
type SelectedStation = Station["id"] | null; // IDで管理することも考慮
type SelectedBoardingPosition = BoardingPosition["id"] | null; // IDで管理することも考慮

// 簡単のために文字列としていましたが、IDに変更するなどの検討もできます
// export const selectedRouteAtom = atom<string | null>(null);
// export const selectedDirectionAtom = atom<string | null>(null);
// export const selectedStationAtom = atom<string | null>(null);
// export const selectedBoardingPositionAtom = atom<string | null>(null);

// 仮にIDで管理する場合のアトム定義例：
export const selectedRouteIdAtom = atom<SelectedRoute>(null);
export const selectedDirectionIdAtom = atom<SelectedDirection>(null);
export const selectedStationIdAtom = atom<SelectedStation>(null);
export const selectedBoardingPositionIdAtom =
  atom<SelectedBoardingPosition>(null);

//--- マスタデータ格納用のアトム (新規) ---

// 路線リスト
export const routesListAtom = atom<Route[]>([]);

// 駅リスト
export const stationsListAtom = atom<Station[]>([]);

// 方面リスト
export const directionsListAtom = atom<RouteStationDirection[]>([]);

// 乗車位置リスト
export const boardingPositionsListAtom = atom<BoardingPosition[]>([]);

//--- 結果情報のアトム (既存) ---
export const resultInfoAtom = atom<ResultInfo | null>(null);

export const isResultLoadingAtom = atom<boolean>(false);

export const isAllSelectedAtom = atom(
  (get) =>
    get(selectedRouteIdAtom) !== null &&
    get(selectedDirectionIdAtom) !== null &&
    get(selectedBoardingPositionIdAtom) !== null,
);
