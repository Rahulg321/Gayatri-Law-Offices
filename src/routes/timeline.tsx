import { createFileRoute } from "@tanstack/react-router";
import { TimelinePage } from "#/features/marketing/components/TimelinePage";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Our Journey — Timeline | Gayatri Law Offices" },
      {
        name: "description",
        content:
          "Follow the growth story of Gayatri Law Offices from founding to becoming one of India's trusted LPO providers.",
      },
    ],
  }),
  component: TimelinePage,
});
