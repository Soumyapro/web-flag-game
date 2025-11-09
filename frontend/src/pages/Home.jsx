import { useNavigate } from 'react-router-dom';

const gameModes = [
    {
        title: 'Sprint',
        total: 10,
        description: 'Test your reflexes in a quick burst of 10 flags.',
        accent: 'from-emerald-400/90 to-teal-500/90',
    },
    {
        title: 'Marathon',
        total: 20,
        description: 'Keep a steady pace through a 20-flag world tour.',
        accent: 'from-sky-400/90 to-indigo-500/90',
    },
    {
        title: 'Legend',
        total: 30,
        description: 'Endurance challenge for true geography masters.',
        accent: 'from-rose-400/90 to-amber-500/90',
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 -z-20 bg-slate-950" />
            <div className="absolute inset-0 -z-10 bg-grid-radial" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),rgba(15,23,42,0))]" />
            <div className="absolute inset-y-0 right-0 -z-10 h-full w-1/2 bg-[radial-gradient(circle_at_80%_40%,rgba(236,72,153,0.25),rgba(15,23,42,0))]" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-20 md:px-10 lg:px-16 xl:px-20">
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-white/60 backdrop-blur">
                            Flag Arena
                        </span>
                        <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
                            Turn your geography skills into a{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                                competitive quiz
                            </span>
                        </h1>
                        <p className="mt-5 max-w-xl text-lg text-slate-200/80 md:text-xl">
                            Pick your challenge, race against the globe, and climb the leaderboard. Each flag is one opportunity to score.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/game')}
                                className="group inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-400/20"
                            >
                                Play
                                <span className="block h-2 w-2 rounded-full bg-emerald-300 group-hover:scale-150 transition" />
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById('mode-selector')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/40 hover:text-white"
                            >
                                Choose your run
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5v14m7-7H5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="relative mt-14 md:mt-0 md:w-72 lg:w-80">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 blur-3xl" />
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                                Quote of the Run
                                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-300" />
                            </div>
                            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-emerald-200">
                                “The globe spins faster when curiosity leads the way.”
                            </p>
                            <p className="mt-6 text-lg font-semibold text-white">
                                Brave the winds, chase the colors, and celebrate every flag you conquer.
                            </p>
                            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50">
                                — Flag Master credo
                            </p>
                        </div>
                    </div>
                </header>

                <section id="mode-selector" className="mt-20">
                    <h2 className="text-center font-display text-4xl font-semibold text-white md:text-5xl">
                        Choose your adventure
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/70">
                        Select how many questions you want to conquer. Every mode delivers a fresh, non-repeating streak of world flags.
                    </p>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {gameModes.map((mode) => (
                            <button
                                key={mode.total}
                                type="button"
                                onClick={() => navigate(`/game?total=${mode.total}`)}
                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-xl transition hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                            >
                                <div className={`absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br ${mode.accent}`} />
                                <div className="flex items-center justify-between">
                                    <span className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                                        {mode.title}
                                    </span>
                                    <span className="text-sm font-medium text-white/60 transition group-hover:text-white">
                                        {mode.total} Questions
                                    </span>
                                </div>
                                <p className="mt-6 font-display text-4xl font-semibold text-white transition group-hover:text-white">
                                    {mode.total}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-white/70 transition group-hover:text-white/80">
                                    {mode.description}
                                </p>
                                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200 transition group-hover:translate-x-2">
                                    Start run
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
