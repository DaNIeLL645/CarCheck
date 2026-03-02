import Link from "next/link";
import {
  CheckCircle,
  Search,
  FileText,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  Car,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Car<span className="text-blue-600">Check</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#how" className="hover:text-blue-600 transition">
                Cum funcționează
              </Link>
              <Link href="#pricing" className="hover:text-blue-600 transition">
                Prețuri
              </Link>
              <Link href="#experts" className="hover:text-blue-600 transition">
                Experți
              </Link>
              <Link
                href="/new-request"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Verifică o Mașină
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" /> 100% Verificat & Sigur
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
            Nu cumpăra o problemă. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Cumpără cu încredere.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 leading-relaxed mb-10">
            Trimitem un expert să verifice mașina dorită în locul tău. Primești
            un raport complet în aceeași zi și negociezi prețul ca un
            profesionist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new-request"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-2xl shadow-blue-300 hover:bg-blue-700 transition-all hover:-translate-y-1"
            >
              Verifică o Mașină Acum
            </Link>
            <Link
              href="#how"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Vezi cum funcționează
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12">
            <div>
              <p className="text-3xl font-bold text-slate-900">15,000+</p>
              <p className="text-sm text-slate-500 uppercase font-semibold">
                Inspecții realizate
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">450+</p>
              <p className="text-sm text-slate-500 uppercase font-semibold">
                Experți activi
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">4.9/5</p>
              <p className="text-sm text-slate-500 uppercase font-semibold">
                Rating clienți
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">24h</p>
              <p className="text-sm text-slate-500 uppercase font-semibold">
                Timp mediu răspuns
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- CUM FUNCȚIONEAZĂ --- */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Verificarea în 3 pași simpli
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                title: "1. Alegi mașina",
                desc: "Introduci link-ul anunțului sau detaliile locației unde se află mașina.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "2. Trimitem expertul",
                desc: "Un tehnician verificat merge la locație și face o inspecție riguroasă.",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "3. Primești raportul",
                desc: "Primești un PDF detaliat cu defecte, poze și recomandarea de cumpărare.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative group text-center p-8 rounded-3xl border border-slate-100 hover:bg-slate-50 transition"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 group-hover:scale-110 transition">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PREȚURI / PACHETE (NOU) --- */}
      <section
        id="pricing"
        className="py-24 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Alege pachetul potrivit
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Cumpără acum credite pentru verificări și folosește-le oricând
              dorești. Fără dată de expirare!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pachet 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl transition-all relative flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                1 Verificare
              </h3>
              <p className="text-slate-500 mb-6 min-h-[48px]">
                Perfect dacă ai găsit deja mașina visurilor tale.
              </p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                150{" "}
                <span className="text-lg text-slate-500 font-medium">RON</span>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> 1 Credit în
                  cont
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> Raport
                  detaliat PDF
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> Galerie Foto
                  & Video
                </li>
              </ul>
              <Link
                href="/login"
                className="w-full text-center px-6 py-4 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
              >
                Cumpără Pachetul
              </Link>
            </div>

            {/* Pachet 2 - Recomandat */}
            <div className="bg-blue-600 rounded-3xl p-8 shadow-2xl shadow-blue-200 transform md:-translate-y-4 relative flex flex-col text-white">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wide">
                Cel Mai Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">2 Verificări</h3>
              <p className="text-blue-100 mb-6 min-h-[48px]">
                Compară două oferte și fii sigur că iei decizia corectă.
              </p>
              <div className="text-4xl font-extrabold mb-6 flex items-end gap-2">
                200{" "}
                <span className="text-lg text-blue-200 font-medium">RON</span>
                <span className="text-sm line-through text-blue-300 ml-2 mb-1">
                  300 RON
                </span>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-200" /> 2 Credite în
                  cont
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-200" /> Raport
                  detaliat PDF
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-200" /> Galerie Foto
                  & Video
                </li>
                <li className="flex items-center gap-2 text-yellow-300 font-medium">
                  <Star className="w-5 h-5 fill-current" /> Economisești 100 RON
                </li>
              </ul>
              <Link
                href="/login"
                className="w-full text-center px-6 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition shadow-lg"
              >
                Cumpără Pachetul
              </Link>
            </div>

            {/* Pachet 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl transition-all relative flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                3 Verificări
              </h3>
              <p className="text-slate-500 mb-6 min-h-[48px]">
                Pentru cei nehotărâți. Testează mai multe modele!
              </p>
              <div className="text-4xl font-extrabold text-slate-900 mb-6 flex items-end gap-2">
                250{" "}
                <span className="text-lg text-slate-500 font-medium">RON</span>
                <span className="text-sm line-through text-slate-400 ml-2 mb-1">
                  450 RON
                </span>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> 3 Credite în
                  cont
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> Raport
                  detaliat PDF
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" /> Galerie Foto
                  & Video
                </li>
                <li className="flex items-center gap-2 text-green-600 font-medium">
                  <Star className="w-5 h-5 fill-current" /> Economisești 200 RON
                </li>
              </ul>
              <Link
                href="/login"
                className="w-full text-center px-6 py-4 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
              >
                Cumpără Pachetul
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERȚI --- */}
      <section
        id="experts"
        className="py-24 bg-white border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                Top Tehnicieni în zona ta
              </h2>
              <p className="text-lg text-slate-600">
                Lucrăm doar cu profesioniști care au peste 10 ani experiență în
                diagnoză și mecanică.
              </p>
            </div>
            <Link
              href="#"
              className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
            >
              Vezi toți experții <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card Expert */}
            {[
              {
                name: "Alexandru Popescu",
                brand: "Specialist BMW & Audi",
                rating: "5.0",
                reviews: "124",
                emoji: "👨‍🔧",
              },
              {
                name: "Marius Ionescu",
                brand: "Specialist Multimarcă",
                rating: "4.8",
                reviews: "89",
                emoji: "🕵️",
              },
              {
                name: "Robert Dima",
                brand: "Expert Vopsitorie",
                rating: "4.9",
                reviews: "210",
                emoji: "🔧",
              },
            ].map((expert, i) => (
              <div
                key={i}
                className="bg-slate-50 p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">
                    {expert.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{expert.name}</h3>
                    <p className="text-slate-500 text-sm">{expert.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-slate-900">
                    {expert.rating}
                  </span>
                  <span className="text-slate-400 text-sm">
                    ({expert.reviews} recenzii)
                  </span>
                </div>
                <div className="p-4 bg-white rounded-xl italic text-sm text-slate-600 border border-slate-100">
                  "Foarte atent la detalii, a depistat km dați înapoi imediat."
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA CARIERE --- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ești un mecanic de elită?
              </h2>
              <p className="text-blue-100/70 text-lg">
                Alătură-te rețelei noastre și câștigă făcând ceea ce iubești.
              </p>
            </div>
            <Link
              href="/careers"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition whitespace-nowrap"
            >
              Aplică ca Tehnician
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Car className="text-blue-600 w-6 h-6" />
                <span className="text-xl font-black tracking-tighter">
                  CarCheck
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Platforma nr. 1 din România pentru verificări auto
                pre-achiziție. Siguranța ta este prioritatea noastră.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicii</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Inspecție Teren
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Verificare Istoric
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Consultanță Daune
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Companie</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Despre Noi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Cariere
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Termeni și Condiții
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Politica Cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} CarCheck România. Toate drepturile
            rezervate.
          </div>
        </div>
      </footer>
    </div>
  );
}
