"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  Box,
  Portal,
  Select as ChakraSelect,
  createListCollection,
  Field,
} from "@chakra-ui/react";

// 定義したアトムと型をインポート
import {
  boardingPositionsListAtom,
  selectedBoardingPositionIdAtom,
} from "@/states/atoms";
import { BoardingPosition } from "@/types/data";

// boardingPositionsListAtom から取得した BoardingPosition[] を、createListCollection が期待する { label: string, value: string }[] 形式に変換するヘルパー関数
const formatBoardingPositionsForSelect = (
  positions: BoardingPosition[],
): { label: string; value: string }[] => {
  // "order" カラムでソートされている前提で処理します
  return positions.map((position) => ({
    label: position.name_ja, // ドロップダウンに表示するテキストは日本語名
    value: position.id, // 選択された際に値として使うのは乗車位置のID
  }));
};

const BoardingPositionSelect = () => {
  // Jotai から乗車位置のリストを取得
  const boardingPositions = useAtomValue(boardingPositionsListAtom);
  // Jotai から選択された乗車位置IDを更新するためのsetter関数を取得
  const setSelectedBoardingPositionId = useSetAtom(
    selectedBoardingPositionIdAtom,
  );
  // Jotai から現在選択されている乗車位置IDを取得 (Select.Root に値を設定するために必要)
  const selectedBoardingPositionId = useAtomValue(
    selectedBoardingPositionIdAtom,
  );

  // 取得した乗車位置データを createListCollection が使える形式に変換
  const positionItems = formatBoardingPositionsForSelect(boardingPositions);

  // createListCollection でコレクションを作成
  const positionsCollection = createListCollection({ items: positionItems });

  // データがない場合は表示をスキップまたはローディング表示
  if (!boardingPositions || boardingPositions.length === 0) {
    return <Box>乗車位置データを読み込み中...</Box>; // または null を返す
  }

  return (
    // Field.Root を使用
    <Field.Root id="boarding-position-select" mb={4}>
      <Field.Label>乗車位置を選択</Field.Label>

      {/* compose/select の実装 */}
      <ChakraSelect.Root
        collection={positionsCollection} // 作成したコレクションを使用
        size="sm" // サイズはお好みで
        width="320px" // 幅もお好みで
        // 乗車位置の選択は他の選択に依存しないため、基本的には常に有効
        // isDisabled={...}

        // 値の変更をハンドリング
        onValueChange={(details) => {
          const selectedId = details.value.length > 0 ? details.value[0] : null;
          console.log("Selected Boarding Position ID:", selectedId); // デバッグ用ログ
          setSelectedBoardingPositionId(selectedId); // 選択された値をアトムにセット
        }}
        // 現在選択されている値をセット
        value={
          selectedBoardingPositionId ? [selectedBoardingPositionId] : undefined
        }
      >
        <ChakraSelect.HiddenSelect />
        <ChakraSelect.Control>
          <ChakraSelect.Trigger>
            <ChakraSelect.ValueText placeholder="乗車位置を選択してください" />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>

        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {positionsCollection.items.map((position) => (
                <ChakraSelect.Item item={position} key={position.value}>
                  {position.label}
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

export default BoardingPositionSelect;
