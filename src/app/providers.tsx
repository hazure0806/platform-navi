// src/app/providers.tsx
"use client"; // クライアントコンポーネントであることを宣言

// ChakraProvider および ColorModeProvider 関連のインポート
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "@/components/ui/color-mode";

// データ取得とJotai関連のインポート
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

// Providers コンポーネント自体が ColorModeProviderProps を受け取るようにする
export function Providers(props: ColorModeProviderProps) {
  const { children } = props; // children は props から取得

  // Jotai の setter 取得
  const setRoutesList = useSetAtom(routesListAtom);
  const setStationsList = useSetAtom(stationsListAtom);
  const setDirectionsList = useSetAtom(directionsListAtom);
  const setBoardingPositionsList = useSetAtom(boardingPositionsListAtom);

  // データ取得の useEffect
  useEffect(() => {
    async function loadMasterData() {
      const routes = await fetchRoutes();
      if (routes) setRoutesList(routes);

      const stations = await fetchStations();
      if (stations) setStationsList(stations);

      const directions = await fetchDirections();
      if (directions) setDirectionsList(directions);

      const boardingPositions = await fetchBoardingPositions();
      if (boardingPositions) setBoardingPositionsList(boardingPositions);
    }

    loadMasterData();
  }, [
    setRoutesList,
    setStationsList,
    setDirectionsList,
    setBoardingPositionsList,
  ]); // 依存配列

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
