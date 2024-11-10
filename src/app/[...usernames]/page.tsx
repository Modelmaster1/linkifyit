import { ClientUsernamePage } from "./cUsername";

export default async function UsernamePage({
  params,
}: {
  params: { usernames: [string, string] };
}) {
  const [username, pageSlug] = params.usernames as [string, string];

  return <ClientUsernamePage username={username} pageSlug={pageSlug} />;
}
