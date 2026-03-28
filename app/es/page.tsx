import { redirect } from "next/navigation";

// /es redirects to the main landing page
// The Spanish translations are available via the locales JSON files
export default function EsPage() {
  redirect("/");
}
