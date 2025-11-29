import { ReactAppLoader } from "./components/ReactAppLoader";
import { ShadcnButton } from "./components/ShadcnButton";
import { Vue2AppLoader } from "./components/Vue2AppLoader";
import "./globals.css";

export default function MultiPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Multi Framework Demo - Shadow DOM</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Vue2 App in Shadow DOM</h2>
          <Vue2AppLoader />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Next.js App</h2>
          <ShadcnButton />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">React App in Shadow DOM</h2>
          <ReactAppLoader />
        </section>
      </div>
    </div>
  );
}
