import EditPage from "../page";

export default async function QuickEditPage({
  params,
}: {
  params: { options: [string, string] };
}) {
  const [slug, openPanel] = params.options as [string, string];

  return <EditPage selectedPageSlug={slug} />;
}