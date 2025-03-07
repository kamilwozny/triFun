import { auth } from './auth';

export default async function Home() {
  const session = await auth();
  return (
    <div className="p-10">
      <button className="btn btn-primary">Button</button>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
