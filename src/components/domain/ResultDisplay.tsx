// src/components/domain/ResultDisplay.tsx
"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import clsx from "clsx";
import {
  ArrowRightIcon,
  TrainFrontIcon,
  MapIcon,
  MapPinHouse,
} from "lucide-react";

import {
  selectedRouteIdAtom,
  selectedDirectionIdAtom,
  selectedBoardingPositionIdAtom,
  resultInfoAtom,
  isResultLoadingAtom,
  isAllSelectedAtom,
} from "@/states/atoms";

import { fetchResultMapping } from "@/utils/supabase";

const getTransferLineBulletColor = (lineName: string) => {
  if (lineName.includes("JR線")) return "bg-orange-600";
  if (lineName.includes("名鉄")) return "bg-red-600";
  return "bg-gray-500";
};

const ResultDisplay = () => {
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);
  const selectedDirectionId = useAtomValue(selectedDirectionIdAtom);
  const selectedBoardingPositionId = useAtomValue(
    selectedBoardingPositionIdAtom,
  );

  const resultInfo = useAtomValue(resultInfoAtom);
  const setResultInfo = useSetAtom(resultInfoAtom);
  const setIsResultLoading = useSetAtom(isResultLoadingAtom);
  const isAllSelected = useAtomValue(isAllSelectedAtom);

  useEffect(() => {
    if (selectedRouteId && selectedDirectionId && selectedBoardingPositionId) {
      console.log("All selections made. Fetching result...");

      setIsResultLoading(true);
      setResultInfo(null);

      async function getResult() {
        try {
          const result = await fetchResultMapping(
            selectedRouteId!,
            selectedDirectionId!,
            selectedBoardingPositionId!,
          );
          setResultInfo(result);
        } catch (error) {
          console.error("Error fetching result:", error);
          setResultInfo(null);
        } finally {
          setIsResultLoading(false);
        }
      }

      getResult();
    } else {
      console.log("Selections incomplete. Clearing result and loading state.");
      setResultInfo(null);
      setIsResultLoading(false);
    }
  }, [
    selectedRouteId,
    selectedDirectionId,
    selectedBoardingPositionId,
    setResultInfo,
    setIsResultLoading,
    isAllSelected,
  ]);

  if (!resultInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-md shadow-lg">
      <div className="bg-blue-500 text-white text-lg font-semibold p-4 mb-4 rounded-t-md flex items-center space-x-2">
        <MapIcon className="h-6 w-6 text-white" />
        <h2>目的地案内</h2>
      </div>
      <div className="p-5 text-gray-800 flex flex-col space-y-4">
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
              <ArrowRightIcon className="h-5 w-5 text-blue-600" />
              <span>最寄り出口</span>
            </p>
            <p className="list-none p-0 m-0 ml-4">
              {resultInfo.closest_exit_ja}
            </p>
          </div>
        )}
        {resultInfo.closest_transfer_lines_ja &&
          resultInfo.closest_transfer_lines_ja.length > 0 && (
            <div>
              <p className="font-bold flex items-center space-x-2">
                <TrainFrontIcon className="h-6 w-6 text-blue-600" />
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
