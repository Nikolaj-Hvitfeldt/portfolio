import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { PortfolioPage } from "@/components/PortfolioPage";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <PortfolioPage />;
}
