"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  Box,
  Portal,
  Select as ChakraSelect,
  createListCollection,
  Field,
} from "@chakra-ui/react";

import { routesListAtom, selectedRouteIdAtom } from "@/states/atoms";
import { Route } from "@/types/data";

const formatRoutesForSelect = (
  routes: Route[],
): { label: string; value: string }[] => {
  return routes.map((route) => ({
    label: route.name_ja,
    value: route.id,
  }));
};

const RouteSelect = () => {
  const routes = useAtomValue(routesListAtom);
  const setSelectedRouteId = useSetAtom(selectedRouteIdAtom);
  const selectedRouteId = useAtomValue(selectedRouteIdAtom);

  const frameworkItems = formatRoutesForSelect(routes);
  const frameworksCollection = createListCollection({ items: frameworkItems });

  if (!routes || routes.length === 0) {
    return <Box>路線データを読み込み中...</Box>;
  }

  return (
    <Field.Root id="route-select" mb={4}>
      <Field.Label>路線を選択</Field.Label>

      <ChakraSelect.Root
        collection={frameworksCollection}
        size="sm"
        width="320px"
        // onValueChange で受け取る details.value は string[] なので、最初の要素を取得
        onValueChange={(details) => {
          // details.value は選択されたキーの配列です。単一選択の場合、配列は最大1つの要素を持ちます。
          const selectedId = details.value.length > 0 ? details.value[0] : null;
          setSelectedRouteId(selectedId); // string | null の SelectedRoute 型に代入
        }}
        // value には選択されているキーの配列（または undefined）を渡す
        value={selectedRouteId ? [selectedRouteId] : undefined} // selectedRouteId が null でなければ [selectedRouteId] という配列を渡す
      >
        <ChakraSelect.HiddenSelect />
        <ChakraSelect.Control>
          <ChakraSelect.Trigger>
            <ChakraSelect.ValueText placeholder="路線を選択してください" />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>

        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {frameworksCollection.items.map((framework) => (
                <ChakraSelect.Item item={framework} key={framework.value}>
                  {framework.label}
                  <ChakraSelect.ItemIndicator />
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
    </Field.Root>
  );
};

export default RouteSelect;
