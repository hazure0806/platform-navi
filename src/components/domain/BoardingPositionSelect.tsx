"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Fragment, useMemo } from "react";
import {
  Combobox,
  Transition,
  Label,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import {
  boardingPositionsListAtom,
  selectedBoardingPositionIdAtom,
} from "@/states/atoms";
import { BoardingPosition } from "@/types/data";

const formatBoardingPositionsForSelect = (
  positions: BoardingPosition[],
): { label: string; value: string }[] => {
  return positions.map((position) => ({
    label: position.name_ja,
    value: position.id,
  }));
};

const BoardingPositionSelect = () => {
  const boardingPositions = useAtomValue(boardingPositionsListAtom);
  const setSelectedBoardingPositionId = useSetAtom(
    selectedBoardingPositionIdAtom,
  );
  const selectedBoardingPositionId = useAtomValue(
    selectedBoardingPositionIdAtom,
  );

  const positionItems = useMemo(() => {
    if (!boardingPositions) return [];
    return formatBoardingPositionsForSelect(boardingPositions);
  }, [boardingPositions]);

  const selectedFrameworkItem = useMemo(() => {
    return (
      positionItems.find((item) => item.value === selectedBoardingPositionId) ||
      null
    );
  }, [positionItems, selectedBoardingPositionId]);

  if (!boardingPositions || boardingPositions.length === 0) {
    return <div className="mb-4">乗車位置データを読み込み中...</div>;
  }

  return (
    <div className="mb-4 w-full">
      <Combobox
        value={selectedFrameworkItem}
        onChange={(item: { label: string; value: string } | null) => {
          console.log("Selected Boarding Position Item:", item);
          setSelectedBoardingPositionId(item ? item.value : null);
        }}
      >
        <Label
          htmlFor="boarding-position-select-button"
          className="block text-white text-sm font-medium mb-2"
        >
          乗車位置を選択
        </Label>
        <div className="relative mt-1">
          <ComboboxButton
            as="button"
            id="boarding-position-select-button"
            className={clsx(
              `block w-full bg-white/10 backdrop-blur-md border rounded-lg py-3 px-4 appearance-none text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent border-white/30 cursor-pointer`,
            )}
          >
            <span className={clsx("block truncate", "text-white", "text-left")}>
              {selectedFrameworkItem
                ? selectedFrameworkItem.label
                : "乗車位置を選択してください"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
              <ChevronUpDownIcon
                className="h-5 w-5 text-white"
                aria-hidden="true"
              />
            </span>
          </ComboboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {positionItems.length === 0 ? (
                <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-300">
                  データがありません
                </div>
              ) : (
                positionItems.map((item) => (
                  <ComboboxOption
                    key={item.value}
                    className={(state) =>
                      clsx(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        state.focus
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300",
                      )
                    }
                    value={item}
                  >
                    {(state) => (
                      <>
                        <span
                          className={clsx(
                            "block truncate",
                            state.selected ? "font-medium" : "font-normal",
                            "text-left",
                          )}
                        >
                          {item.label}
                        </span>
                        {state.selected ? (
                          <span
                            className={clsx(
                              "absolute inset-y-0 left-0 flex items-center pl-3",
                              state.selected ? "text-white" : "text-gray-300",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default BoardingPositionSelect;
