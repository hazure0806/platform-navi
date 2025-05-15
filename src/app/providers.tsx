"use client";

// データ取得とJotai関連のインポートは維持
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  fetchRoutes,
  fetchStations,
  fetchDirections,
  fetchBoardingPositions,
} from "../utils/supabase"; // パスを確認
import {
  routesListAtom,
  stationsListAtom,
  directionsListAtom,
  boardingPositionsListAtom,
} from "../states/atoms"; // パスを確認

export function Providers({ children }: { children: React.ReactNode }) {
  // Jotai の setter 取得は維持
  const setRoutesList = useSetAtom(routesListAtom);
  const setStationsList = useSetAtom(stationsListAtom);
  const setDirectionsList = useSetAtom(directionsListAtom);
  const setBoardingPositionsList = useSetAtom(boardingPositionsListAtom);

  // データ取得の useEffect は維持
  useEffect(() => {
    console.log("Providers useEffect called (Data Fetching)");
    async function loadMasterData() {
      console.log("Fetching master data...");
      const routes = await fetchRoutes();
      console.log("Fetched routes:", routes);
      if (routes) setRoutesList(routes);

      const stations = await fetchStations();
      console.log("Fetched stations:", stations);
      if (stations) setStationsList(stations);

      const directions = await fetchDirections();
      console.log("Fetched directions:", directions);
      if (directions) setDirectionsList(directions);

      const boardingPositions = await fetchBoardingPositions();
      console.log("Fetched boarding positions:", boardingPositions);
      if (boardingPositions) setBoardingPositionsList(boardingPositions); // 修正箇所

      console.log("Master data fetching complete.");
    }

    loadMasterData();
  }, [
    setRoutesList,
    setStationsList,
    setDirectionsList,
    setBoardingPositionsList,
  ]); // 依存配列

  // 子要素をそのままレンダリングするだけになる
  return <>{children}</>;
}
