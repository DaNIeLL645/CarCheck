import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      {/* --- SECȚIUNEA 1: HERO (Motto & Buton) --- */}
      <section className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <div className="mb-8 flex justify-center">
            {/* Aici ar sta Logo-ul, momentan folosim text stilizat */}
            <span className="text-blue-600 font-black text-5xl tracking-tight">
              CarCheck
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Nu cumpăra o problemă.
            <br />
            <span className="text-blue-600">Economisește Bani și Timp.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Lasă un expert să verifice mașina pentru tine. Evită viciile ascunse
            și negociază prețul corect având un raport tehnic profesionist la
            mână.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/new-request"
              className="rounded-md bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-xl hover:bg-blue-500 transition transform hover:scale-105"
            >
              Verifică o Mașină Acum →
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECȚIUNEA 2: ALEGE EXPERTUL (Concept Stele) --- */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Experții noștri sunt notați de clienți
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Transparență totală. După fiecare inspecție, tu decizi câte stele
              merită mecanicul.
            </p>
          </div>

          {/* Exemplu de Carduri Tehnicieni (Statice momentan) */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Tehnician 1 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-24 w-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-2xl">
                👨‍🔧
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Alexandru Popescu
              </h3>
              <p className="text-sm text-gray-500">Specialist BMW & Audi</p>
              <div className="mt-2 flex items-center text-yellow-500 text-xl">
                ★★★★★ <span className="text-gray-400 text-sm ml-2">(5.0)</span>
              </div>
              <p className="mt-4 text-center text-gray-600 text-sm">
                "Super profesionist, a găsit o problemă la injectoare pe care
                vânzătorul o ascundea."
              </p>
            </div>

            {/* Tehnician 2 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-24 w-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-2xl">
                🕵️
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Marius Ionescu
              </h3>
              <p className="text-sm text-gray-500">Specialist Multimarcă</p>
              <div className="mt-2 flex items-center text-yellow-500 text-xl">
                ★★★★☆ <span className="text-gray-400 text-sm ml-2">(4.8)</span>
              </div>
              <p className="mt-4 text-center text-gray-600 text-sm">
                "Raport detaliat și poze foarte clare. Recomand!"
              </p>
            </div>

            {/* Tehnician 3 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-24 w-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-2xl">
                🔧
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Robert Dima
              </h3>
              <p className="text-sm text-gray-500">
                Expert Caroserie & Vopsitorie
              </p>
              <div className="mt-2 flex items-center text-yellow-500 text-xl">
                ★★★★★ <span className="text-gray-400 text-sm ml-2">(4.9)</span>
              </div>
              <p className="mt-4 text-center text-gray-600 text-sm">
                "A văzut imediat că mașina fusese lovită în spate. M-a salvat de
                la o țeapă."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECȚIUNEA 3: CARIERE (Join the Team) --- */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Ești mecanic pasionat?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Alătură-te echipei CarCheck. Îți faci programul singur, câștigi
              bani corect și ajuți oamenii să cumpere mașini sigure.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <Link
                href="/careers"
                className="text-blue-400 hover:text-blue-300 text-lg"
              >
                Aplică pentru postul de Tehnician{" "}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
