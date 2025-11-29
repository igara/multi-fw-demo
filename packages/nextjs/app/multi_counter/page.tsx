import { ReactCounterLoader } from "./components/ReactCounterLoader";
import { ShadcnCounter } from "./components/ShadcnCounter";
import { Vue2CounterLoader } from "./components/Vue2CounterLoader";
import "./globals.css";

export default function MultiCounterPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Multi Framework Demo - Shared State</h1>
      <p className="mb-8 text-gray-600">
        このページでは、ShadowRootで分離された異なるフレームワーク間でstateを共有するデモを展開しています。
        各カウンターは同じstateを参照しており、どのアプリでボタンを押しても全てのカウンターが同期して更新されます。
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Vue2 App in Shadow DOM</h2>
          <Vue2CounterLoader />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Next.js App</h2>
          <ShadcnCounter />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">React App in Shadow DOM</h2>
          <ReactCounterLoader />
        </section>
      </div>
    </div>
  );
}
