"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Fragment, useMemo, useEffect } from "react";
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
  directionsListAtom,
  selectedRouteIdAtom,
  selectedDirectionIdAtom,
} from "@/states/atoms";
import { RouteStationDirection } from "@/types/data";

const formatDirectionsForSelect = (
  directions: RouteStationDirection[],
): { label: string; value: string }[] => {
  return directions.map((direction) => ({
    label: direction.name_ja,
    value: direction.id,
  }));
};

const DirectionSelect = () => {
  const allDirections = useAtomValue(directionsListAtom);
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);
  const setSelectedDirectionId = useSetAtom(selectedDirectionIdAtom);
  const selectedDirectionId = useAtomValue(selectedDirectionIdAtom);

  const filteredDirections = useMemo(() => {
    if (!selectedRouteId || !allDirections) {
      return [];
    }
    return allDirections.filter(
      (direction) => direction.route_id === selectedRouteId,
    );
  }, [selectedRouteId, allDirections]);

  const directionItems = useMemo(() => {
    return formatDirectionsForSelect(filteredDirections);
  }, [filteredDirections]);

  const selectedFrameworkItem = useMemo(() => {
    return (
      directionItems.find((item) => item.value === selectedDirectionId) || null
    );
  }, [directionItems, selectedDirectionId]);

  const isDisabled = !selectedRouteId || filteredDirections.length === 0;

  useEffect(() => {
    const isSelectedDirectionInvalid =
      selectedDirectionId &&
      !filteredDirections.some((dir) => dir.id === selectedDirectionId);

    if (isSelectedDirectionInvalid) {
      console.log(
        `Selected direction ${selectedDirectionId} is not valid for route ${selectedRouteId}. Resetting.`,
      );
      setSelectedDirectionId(null);
    }
  }, [
    selectedDirectionId,
    filteredDirections,
    selectedRouteId,
    setSelectedDirectionId,
  ]);

  if (!allDirections) {
    return <div className="mb-4">方面データを読み込み中...</div>;
  }

  return (
    <div className="mb-4 w-full">
      <Combobox
        value={selectedFrameworkItem}
        onChange={(item: { label: string; value: string } | null) => {
          console.log("Selected Direction Item:", item);
          setSelectedDirectionId(item ? item.value : null);
        }}
        nullable
        disabled={isDisabled}
      >
        <Label
          htmlFor="direction-select-button"
          className="block text-white text-sm font-medium mb-2"
        >
          方面を選択
        </Label>
        <div className="relative mt-1">
          <ComboboxButton
            as="button"
            id="direction-select-button"
            className={clsx(
              `block w-full bg-white/10 backdrop-blur-md border rounded-lg py-3 px-4 appearance-none text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent`,
              isDisabled
                ? "border-gray-400/30 opacity-50 cursor-not-allowed"
                : "border-white/30 cursor-pointer",
            )}
          >
            <span
              className={clsx(
                "block truncate",
                isDisabled ? "text-gray-400" : "text-white",
                "text-left",
              )}
            >
              {selectedFrameworkItem
                ? selectedFrameworkItem.label
                : "方面を選択してください"}
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
              {directionItems.length === 0 && !allDirections ? (
                <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-300">
                  読み込み中...
                </div>
              ) : directionItems.length === 0 &&
                allDirections &&
                selectedRouteId ? (
                <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-300">
                  選択可能な方面がありません
                </div>
              ) : (
                directionItems.map((item) => (
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

export default DirectionSelect;
