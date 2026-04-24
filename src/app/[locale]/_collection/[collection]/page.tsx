export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const CollectionExplore = dynamicComponent(
  () => import("@/src/views/CollectionExplore"),
  { ssr: false },
);

export default CollectionExplore;
