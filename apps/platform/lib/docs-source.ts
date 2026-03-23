import { loader } from "fumadocs-core/source";
import { docs } from "../.source/server";

export const docsSource = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});
