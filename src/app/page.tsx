"use client";

import RouteSelect from "@/components/domain/RouteSelect";
import DirectionSelect from "@/components/domain/DirectionSelect";
import BoardingPositionSelect from "@/components/domain/BoardingPositionSelect";
import ResultDisplay from "@/components/domain/ResultDisplay";
import { useState } from "react";
import { TrainIcon } from "lucide-react"; // タイトルエリアのアイコン
import { useAtomValue, useSetAtom } from "jotai"; // Jotai hooks を再度インポート
import {
  isResultLoadingAtom,
  isAllSelectedAtom,
  selectedRouteIdAtom, // 選択されたIDを取得するためインポート
  selectedDirectionIdAtom,
  selectedBoardingPositionIdAtom,
  resultInfoAtom, // 結果をセットするためインポート
} from "@/states/atoms";
import clsx from "clsx";
// データ取得関数を page.tsx にインポート
import { fetchResultMapping } from "@/utils/supabase";

const Home = () => {
  // 結果表示エリアを開くか閉じるかのローカルstate
  const [showResult, setShowResult] = useState(false);

  // Jotai から必要な状態とセッターを取得
  const isResultLoading = useAtomValue(isResultLoadingAtom);
  const isAllSelected = useAtomValue(isAllSelectedAtom);
  const selectedRouteId = useAtomValue(selectedRouteIdAtom); // 選択されたIDを取得
  const selectedDirectionId = useAtomValue(selectedDirectionIdAtom);
  const selectedBoardingPositionId = useAtomValue(
    selectedBoardingPositionIdAtom,
  );
  const setResultInfo = useSetAtom(resultInfoAtom); // 結果をセットするセッター
  const setIsResultLoading = useSetAtom(isResultLoadingAtom); // ロード状態をセットするセッター

  console.log("isAllSelected", isAllSelected);

  // 検索ボタンがクリックされた時のハンドラ
  const handleSearch = async () => {
    // 全ての選択肢が揃っているか、かつ、現在ロード中でないかを確認
    if (isAllSelected && !isResultLoading) {
      console.log("Search button clicked. Attempting to fetch result...");

      // ロード開始状態に設定し、以前の結果をクリア
      setIsResultLoading(true);
      setResultInfo(null); // 結果をクリア
      setShowResult(true); // 結果表示エリアを開く

      try {
        // 選択されたIDを使ってデータ取得関数を呼び出し
        const result = await fetchResultMapping(
          selectedRouteId!, // ! は SelectedRouteId 型が null | string のため、string であることを保証
          selectedDirectionId!, // 同上
          selectedBoardingPositionId!, // 同上
        );
        // 取得した結果を Jotai アトムにセット
        setResultInfo(result);
        console.log("Fetch complete. Result:", result);
      } catch (error) {
        console.error("Error fetching result:", error);
        setResultInfo(null); // エラー時も結果はクリア
        // エラーメッセージをユーザーに表示するなど、適切なエラーハンドリングを追加
      } finally {
        // ロード終了状態に設定
        setIsResultLoading(false);
        console.log("Fetch process finished.");
      }
    } else {
      // 全選択が揃っていない場合やロード中の場合の処理
      console.log(
        "Search clicked but selections incomplete or already loading.",
      );
      // 必要であれば、全選択が揃っていない旨をユーザーに伝えるUIを表示
    }
  };

  return (
    // ページ全体の中央寄せと上下パディング (layout.tsx の body が背景担当)
    <div className="w-full max-w-md mx-auto py-8">
      {/* ヘッダー (タイトルとサブタイトル) */}
      {/* page.tsx で新設したヘッダー部分をここに移動 */}
      <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrainIcon className="h-8 w-8 text-gray-700 mb-2 mr-2" />{" "}
          {/* アイコンの色とサイズは調整 */}
          <h1 className="text-2xl font-bold text-white">のりばナビ</h1>{" "}
          {/* タイトル色とサイズ */}
        </div>
        <p className="text-white/80 text-sm">最適な乗車位置を見つけましょう</p>{" "}
        {/* サブタイトル色とサイズ */}
      </div>

      {/* 検索フォーム (セレクトボックス群) */}
      {/* 各セレクトコンポーネントはこの div の中で w-full になる */}
      <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
        <div className="flex flex-col space-y-4">
          {/* セレクトボックスコンポーネント */}
          <RouteSelect />
          <DirectionSelect />
          <BoardingPositionSelect />
        </div>

        {/* 検索ボタン */}
        <button
          onClick={handleSearch} // クリックハンドラ
          disabled={isResultLoading || !isAllSelected} // 無効状態は Jotai のアトムで制御
          className={clsx(
            "mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-opacity shadow-lg h-12 flex items-center justify-center",
            isResultLoading || !isAllSelected
              ? "opacity-60 cursor-not-allowed" // 無効時のスタイル
              : "hover:opacity-90", // 有効時のホバーエフェクト
          )}
        >
          {/* ロード中はスピナーとテキストを表示 */}
          {isResultLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              検索中...
            </>
          ) : (
            <>検索</> // ロード中でない場合は「検索」テキスト
          )}
        </button>
      </div>

      {/* 結果表示コンポーネント */}
      {/* showResult が true の場合にのみ表示 */}
      {/* 結果表示コンポーネント自体は resultInfo の有無で中身を制御 */}
      {showResult && (
        <div className="mt-8 w-full">
          {" "}
          {/* 結果エリアのラッパーに上マージンと幅を設定 */}
          <ResultDisplay />
        </div>
      )}

      {/* フッター */}
      {/* mt-8: 上マージン, text-center: 中央寄せ, text-gray-700: 文字色, text-sm: 文字サイズ */}
      <div className="mt-8 text-center text-gray-700 text-sm">
        © 2025 のりばナビ | 電車の乗車位置情報サービス
      </div>
    </div>
  );
};

export default Home;
