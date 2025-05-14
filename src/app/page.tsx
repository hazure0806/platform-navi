"use client";

import {
  Box,
  Heading,
  VStack,
  Container,
  Button,
  Flex,
} from "@chakra-ui/react"; // Container をインポート
import RouteSelect from "@/components/domain/RouteSelect";
import DirectionSelect from "@/components/domain/DirectionSelect";
import BoardingPositionSelect from "@/components/domain/BoardingPositionSelect";
import ResultDisplay from "@/components/domain/ResultDisplay";

import { useColorMode } from "@/components/ui/color-mode";

// global CSSのインポート（必要であれば残す）
// import "./globals.css";

const Home = () => {
  // カラーモードの取得
  const { toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.md" py={8} height={"100vh"}>
      {/* 最大幅をmdに、上下パディングを8単位に設定 */}
      {/* ページ全体のコンテンツを VStack で縦方向に並べる */}
      <Box justifyContent={"center"}>
        {" "}
        {/* 各セクション間の間隔を8単位に設定 */}
        {/* タイトル部分 */}
        <Flex textAlign="center" justifyContent="center" mb={8}>
          <Heading as="h1" size="xl">
            のりばナビ
          </Heading>
          <Button variant="outline" onClick={toggleColorMode} ml={4}>
            Toggle Mode
          </Button>
        </Flex>
        <VStack align="stretch">
          <RouteSelect />
          <DirectionSelect />
          <BoardingPositionSelect />
        </VStack>
        {/* 結果表示コンポーネント */}
        <ResultDisplay />
      </Box>
    </Container>
  );
};

export default Home;
