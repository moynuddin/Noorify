import SurahDetailClient from "./SurahDetailClient";

export async function generateStaticParams() {
  return Array.from({ length: 114 }).map((_, i) => ({
    id: String(i + 1),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SurahDetailClient id={Number(id)} />;
}
