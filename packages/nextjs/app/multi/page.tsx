import { Vue2AppLoader } from "./components/Vue2AppLoader";

export default function MultiPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Multi Framework Demo - Vue2 in Shadow DOM</h1>
      <Vue2AppLoader />
    </div>
  );
}
