"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  Box,
  Portal,
  Select as ChakraSelect,
  createListCollection,
  Field,
} from "@chakra-ui/react";
import { useMemo } from "react"; // useMemo をインポート

// 定義したアトムと型をインポート
import {
  directionsListAtom,
  selectedRouteIdAtom,
  selectedDirectionIdAtom,
} from "@/states/atoms";
import { RouteStationDirection } from "@/types/data";

// directionsListAtom から取得した RouteStationDirection[] を、createListCollection が期待する { label: string, value: string }[] 形式に変換するヘルパー関数
const formatDirectionsForSelect = (
  directions: RouteStationDirection[],
): { label: string; value: string }[] => {
  return directions.map((direction) => ({
    label: direction.name_ja, // ドロップダウンに表示するテキストは日本語方面名
    value: direction.id, // 選択された際に値として使うのは方面のID
  }));
};

const DirectionSelect = () => {
  // Jotai から全ての方面リストを取得
  const allDirections = useAtomValue(directionsListAtom);
  // Jotai から現在選択されている路線IDを取得
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);
  // Jotai から選択された方面IDを更新するためのsetter関数を取得
  const setSelectedDirectionId = useSetAtom(selectedDirectionIdAtom);
  // Jotai から現在選択されている方面IDを取得 (Select.Root に値を設定するために必要)
  const selectedDirectionId = useAtomValue(selectedDirectionIdAtom);

  // 選択された路線IDに基づいて方面リストをフィルタリング
  // selectedRouteId または allDirections が変更された場合にのみ再計算
  const filteredDirections = useMemo(() => {
    if (!selectedRouteId || !allDirections) {
      return []; // 路線が選択されていない、またはデータがない場合は空の配列
    }
    // 全ての方面の中から、現在選択されている路線IDに一致する方面のみを抽出
    return allDirections.filter(
      (direction) => direction.route_id === selectedRouteId,
    );
  }, [selectedRouteId, allDirections]); // 依存配列として selectedRouteId と allDirections を指定

  // フィルタリングされた方面データを createListCollection が使える形式に変換
  const directionItems = formatDirectionsForSelect(filteredDirections);

  // createListCollection でコレクションを作成
  const directionsCollection = createListCollection({ items: directionItems });

  // 路線が選択されていない場合、またはフィルタリングの結果、表示できる方面がない場合はドロップダウンを無効にする
  const isDisabled = !selectedRouteId || filteredDirections.length === 0;

  // 方面リストがフィルタリングされた後、現在選択されている方面がフィルタリング結果に含まれていない場合は、選択状態をリセットする
  // 例えば、路線を変更した際に、以前選択していた方面が新しい路線には存在しない場合など
  useMemo(() => {
    // useMemo をトリガーとして利用 (副作用ではないが、依存関係で処理を実行させたい場合に使うテクニック)
    if (
      selectedDirectionId &&
      !filteredDirections.some((dir) => dir.id === selectedDirectionId)
    ) {
      console.log(
        `Selected direction ${selectedDirectionId} is not in the filtered list. Resetting.`,
      );
      setSelectedDirectionId(null); // フィルタリング結果にない場合は選択をリセット
    }
  }, [selectedDirectionId, filteredDirections, setSelectedDirectionId]); // 依存配列として selectedDirectionId と filteredDirections を指定

  // 初回ロード中またはデータが全くない場合のハンドリング
  if (!allDirections) {
    return <Box>方面データを読み込み中...</Box>; // または null を返すなど
  }

  return (
    // Field.Root を使用
    <Field.Root id="direction-select" mb={4}>
      <Field.Label>方面を選択</Field.Label>

      {/* compose/select の実装 */}
      <ChakraSelect.Root
        collection={directionsCollection} // 作成したコレクションを使用
        size="sm" // サイズはお好みで
        width="320px" // 幅もお好みで
        disabled={isDisabled} // 無効化の判定結果を渡す
        // 値の変更をハンドリング
        onValueChange={(details) => {
          const selectedId = details.value.length > 0 ? details.value[0] : null;
          console.log("Selected Direction ID:", selectedId); // デバッグ用ログ
          setSelectedDirectionId(selectedId); // 選択された値をアトムにセット
        }}
        // 現在選択されている値をセット
        value={selectedDirectionId ? [selectedDirectionId] : undefined}
      >
        <ChakraSelect.HiddenSelect />
        <ChakraSelect.Control>
          <ChakraSelect.Trigger>
            <ChakraSelect.ValueText placeholder="方面を選択してください" />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>

        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {directionsCollection.items.map((direction) => (
                <ChakraSelect.Item item={direction} key={direction.value}>
                  {direction.label}
                  <ChakraSelect.ItemIndicator />
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
    </Field.Root> // Field.Root を閉じる
  );
};

export default DirectionSelect;
