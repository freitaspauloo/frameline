import { redirect } from "next/navigation";

/** Legacy path — v2 is now the site root. */
export default function HomeV2() {
  redirect("/");
}
