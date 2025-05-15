// src/app/page.tsx
"use client";

import RouteSelect from "@/components/domain/RouteSelect";
import DirectionSelect from "@/components/domain/DirectionSelect";
import BoardingPositionSelect from "@/components/domain/BoardingPositionSelect";
import ResultDisplay from "@/components/domain/ResultDisplay";
import { useState } from "react";
import { TrainIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { isResultLoadingAtom, isAllSelectedAtom } from "@/states/atoms";
import clsx from "clsx";

const Home = () => {
  const [showResult, setShowResult] = useState(false);

  const isResultLoading = useAtomValue(isResultLoadingAtom);
  const isAllSelected = useAtomValue(isAllSelectedAtom);
  console.log("isAllSelected", isAllSelected);

  const handleSearch = () => {
    setShowResult(true);
  };

  return (
    <div className="w-full min-w-md mx-auto py-8">
      {/* Header */}
      <div className="w-full min-w-md bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrainIcon className="h-8 w-8 text-gray-700 mb-2 mr-2" />
          <h1 className="text-2xl font-bold text-white">のりばナビ</h1>
        </div>
        <p className="text-white/80 text-sm">最適な乗車位置を見つけましょう</p>
      </div>

      {/* 検索フォーム */}
      <div className="w-full min-w-md bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
        <div className="flex flex-col space-y-4">
          <RouteSelect />
          <DirectionSelect />
          <BoardingPositionSelect />
        </div>

        {/* 検索ボタン */}
        <button
          onClick={handleSearch}
          disabled={isResultLoading || !isAllSelected}
          className={clsx(
            "mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-opacity shadow-lg h-12 flex items-center justify-center",
            isResultLoading || !isAllSelected
              ? "opacity-60 cursor-not-allowed"
              : "hover:opacity-90",
          )}
        >
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
            <>検索</>
          )}
        </button>
      </div>

      {/* 結果表示コンポーネント */}
      {showResult && (
        <div className="mt-8">
          <ResultDisplay />
        </div>
      )}

      {/* フッター */}
      <div className="mt-8 text-center text-gray-700 text-sm">
        © 2025 のりばナビ | 電車の乗車位置情報サービス
      </div>
    </div>
  );
};

export default Home;
