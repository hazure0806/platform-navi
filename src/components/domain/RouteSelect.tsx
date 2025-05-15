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
// ComboboxOptionPropsState のインポートは不要なので削除します
// import { ComboboxOptionPropsState } from "@headlessui/react";

import { routesListAtom, selectedRouteIdAtom } from "@/states/atoms";
import { Route } from "@/types/data";

const formatRoutesForSelect = (
  routes: Route[],
): { label: string; value: string }[] => {
  return routes
    .map((route) => ({
      label: route.name_ja,
      value: route.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ja"));
};

const RouteSelect = () => {
  const routes = useAtomValue(routesListAtom);
  const setSelectedRouteId = useSetAtom(selectedRouteIdAtom);
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);

  const frameworkItems = useMemo(() => {
    if (!routes) return [];
    return formatRoutesForSelect(routes);
  }, [routes]);

  const selectedFrameworkItem = useMemo(() => {
    return (
      frameworkItems.find((item) => item.value === selectedRouteId) || null
    );
  }, [frameworkItems, selectedRouteId]);

  if (!routes || routes.length === 0) {
    return <div className="mb-4">路線データを読み込み中...</div>;
  }

  const disabled = frameworkItems.length === 0;

  return (
    <div className="mb-4 w-full">
      <Combobox
        value={selectedFrameworkItem}
        onChange={(item: { label: string; value: string } | null) => {
          setSelectedRouteId(item ? item.value : null);
        }}
      >
        <Label
          htmlFor="route-select-button"
          className="block text-white text-sm font-medium mb-2"
        >
          路線を選択
        </Label>
        <div className="relative mt-1">
          <ComboboxButton
            as="button"
            id="route-select-button"
            className={`block w-full bg-white/10 backdrop-blur-md border ${
              disabled ? "border-gray-400/30" : "border-white/30"
            } rounded-lg py-3 px-4 appearance-none text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span
              className={clsx(
                "block truncate",
                disabled ? "text-gray-400" : "text-white",
                "text-left",
              )}
            >
              {selectedFrameworkItem
                ? selectedFrameworkItem.label
                : "路線を選択してください"}
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
              {frameworkItems.map((item) => (
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
                      {/* 選択中の項目にチェックマークを表示 */}
                      {state.selected ? (
                        <span
                          className={clsx(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            state.disabled ? "text-white" : "text-gray-300",
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default RouteSelect;
