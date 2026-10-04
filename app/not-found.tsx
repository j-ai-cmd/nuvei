import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <EmptyState
      as="h1"
      icon="search_off"
      title="Page not found"
      message="That address doesn't match a page in this app. Start from the overview or open your contracts."
      cta={{ href: "/", label: "Go to overview" }}
    />
  );
}
