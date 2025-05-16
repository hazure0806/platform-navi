"use client";

import { useAtomValue } from "jotai";
import clsx from "clsx";
import {
  ArrowRightIcon,
  TrainFrontIcon,
  MapIcon,
  MapPinHouse,
} from "lucide-react";

import { resultInfoAtom } from "@/states/atoms";

const getTransferLineBulletColor = (lineName: string) => {
  if (lineName.includes("JR線")) return "bg-orange-600";
  if (lineName.includes("名鉄")) return "bg-red-600";
  if (lineName.includes("京浜東北線")) return "bg-blue-600";
  if (lineName.includes("山手線")) return "bg-green-600";
  return "bg-gray-500";
};

// ResultDisplay は表示ロジックのみに専念
const ResultDisplay = () => {
  const resultInfo = useAtomValue(resultInfoAtom);

  if (!resultInfo) {
    return (
      <div className="bg-white rounded-md shadow-lg p-6 text-center text-gray-800">
        <p>検索結果がありません</p>
      </div>
    );
  }

  // resultInfo が null でない場合、通常の結果表示
  return (
    <div className="bg-white rounded-md shadow-lg">
      {/* タイトルエリア 「目的地案内」 */}
      <div className="bg-blue-500 text-white text-lg font-semibold p-4 mb-4 rounded-t-md flex items-center space-x-2">
        <MapIcon className="h-6 w-6 text-white" />
        <h2>目的地案内</h2>
      </div>

      {/* 結果表示のコンテンツ部分 */}
      <div className="p-5 text-gray-800 flex flex-col space-y-4">
        {/* 到着エリア */}
        {resultInfo.arrival_area_ja && (
          <div>
            <p className="font-bold flex items-center space-x-2">
              <MapPinHouse className="h-6 w-6 text-blue-600" />
              <span>到着エリア</span>
            </p>
            <p className="list-none p-0 m-0 ml-4">
              {resultInfo.arrival_area_ja}
            </p>
          </div>
        )}
        {resultInfo.closest_exit_ja && (
          <div>
            <p className="font-bold flex items-center space-x-2">
              <ArrowRightIcon className="h-5 w-5 text-blue-600" />{" "}
              <span>最寄り出口</span>
            </p>
            <p className="list-none p-0 m-0 ml-4">
              {resultInfo.closest_exit_ja}
            </p>
          </div>
        )}
        {/* 最寄り乗り換え路線 */}
        {resultInfo.closest_transfer_lines_ja &&
          resultInfo.closest_transfer_lines_ja.length > 0 && (
            <div>
              <p className="font-bold flex items-center space-x-2">
                <TrainFrontIcon className="h-6 w-6 text-blue-600" />{" "}
                <span>最寄りの乗り換え路線</span>
              </p>
              <ul className="list-none p-0 m-0 ml-8">
                {resultInfo.closest_transfer_lines_ja.map((line, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span
                      className={clsx(
                        "block h-3 w-3 rounded-full",
                        getTransferLineBulletColor(line),
                      )}
                    ></span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        {resultInfo.notes_ja && (
          <div>
            <p className="font-bold">備考:</p>
            <p>{resultInfo.notes_ja}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
