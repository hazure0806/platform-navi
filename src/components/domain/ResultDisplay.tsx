"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Box, Text, Heading, VStack, List, Icon } from "@chakra-ui/react";
import { useEffect } from "react"; // useEffect をインポート
import { MdCheckCircle } from "react-icons/md";

// Jotai の選択アトムと結果アトムをインポート
import {
  selectedRouteIdAtom,
  selectedDirectionIdAtom,
  selectedBoardingPositionIdAtom,
  resultInfoAtom, // 結果情報を格納するアトム
} from "@/states/atoms";

// データ取得関数と型をインポート
import { fetchResultMapping } from "@/utils/supabase";

const ResultDisplay = () => {
  // Jotai から現在の選択状態を取得
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);
  const selectedDirectionId = useAtomValue(selectedDirectionIdAtom);
  const selectedBoardingPositionId = useAtomValue(
    selectedBoardingPositionIdAtom,
  );

  // Jotai から結果情報アトムの値を取得
  const resultInfo = useAtomValue(resultInfoAtom);
  // Jotai の結果情報アトムのsetter関数を取得
  const setResultInfo = useSetAtom(resultInfoAtom);

  useEffect(() => {
    if (selectedRouteId && selectedDirectionId && selectedBoardingPositionId) {
      console.log("All selections made. Fetching result...");
      async function getResult() {
        // resultInfoAtom を一旦クリアすることも検討できます
        // setResultInfo(null);

        const result = await fetchResultMapping(
          selectedRouteId!, // ここに ! を追加
          selectedDirectionId!, // ここに ! を追加
          selectedBoardingPositionId!, // ここに ! を追加
        );
        setResultInfo(result);
      }

      getResult();
    } else {
      console.log("Selections incomplete. Clearing result.");
      setResultInfo(null);
    }
  }, [
    selectedRouteId,
    selectedDirectionId,
    selectedBoardingPositionId,
    setResultInfo,
  ]);

  // 結果情報アトムが null でない場合にのみ結果を表示
  if (!resultInfo) {
    // 結果がまだ取得されていないか、対応するデータがなかった場合の表示
    return (
      <Box mt={8}>
        <Text>路線、方面、乗車位置を選択してください。</Text>
        {/* 必要に応じて、選択肢が揃った後に「検索中...」などの表示を追加 */}
        {/* {(selectedRouteId && selectedDirectionId && selectedBoardingPositionId) && <Text>検索中...</Text>} */}
      </Box>
    );
  }

  // 結果情報がある場合の表示
  return (
    <Box
      mt={8}
      p={5}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
      width={"50%"}
    >
      <Heading as="h2" size="md" mb={4}>
        降車駅での案内
      </Heading>

      <VStack align="stretch">
        {/* 到着エリア */}
        {resultInfo.arrival_area_ja && (
          <Box>
            <Text fontWeight="bold">到着エリアの目安:</Text>
            <Text>{resultInfo.arrival_area_ja}</Text>
          </Box>
        )}

        {/* 最寄り出口 */}
        {resultInfo.closest_exit_ja && (
          <Box>
            <Text fontWeight="bold">最寄り出口:</Text>
            <Text>{resultInfo.closest_exit_ja}</Text>
          </Box>
        )}

        {/* 最寄り乗り換え路線 */}
        {resultInfo.closest_transfer_lines_ja &&
          resultInfo.closest_transfer_lines_ja.length > 0 && (
            <Box>
              <Text fontWeight="bold">最寄り乗り換え路線:</Text>
              {/* List.Root と List.Item を使用 */}
              <List.Root>
                {resultInfo.closest_transfer_lines_ja.map((line, index) => (
                  <List.Item key={index}>
                    <Icon as={MdCheckCircle} color="green.500" mr={2} />
                    {line}
                  </List.Item>
                ))}
              </List.Root>
            </Box>
          )}

        {/* 備考 */}
        {resultInfo.notes_ja && (
          <Box>
            <Text fontWeight="bold">備考:</Text>
            <Text>{resultInfo.notes_ja}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ResultDisplay;
