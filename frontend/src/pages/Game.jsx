import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const QUIZ_LENGTHS = [10, 20, 30];

function Game() {
    const [searchParams, setSearchParams] = useSearchParams();
    const totalParam = searchParams.get('total');
    const parsedTotal = totalParam ? Number(totalParam) : null;
    const initialTotal = QUIZ_LENGTHS.includes(parsedTotal) ? parsedTotal : null;

    const [flagImageData, setFlagImageData] = useState(null);
    const [countryText, setCountryText] = useState('');
    const [flagAnswer, setFlagAnswer] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [targetQuestions, setTargetQuestions] = useState(() => initialTotal);
    const [gamePhase, setGamePhase] = useState(() => (initialTotal ? 'loading' : 'setup'));
    const [isLoading, setIsLoading] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [hasBootstrapped, setHasBootstrapped] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

    const progressPercent = useMemo(() => {
        if (!targetQuestions || targetQuestions === 0) {
            return 0;
        }
        return Math.min(100, Math.round((questionsAnswered / targetQuestions) * 100));
    }, [questionsAnswered, targetQuestions]);

    const fetchFlagQuestion = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        setLastResult(null);
        try {
            const response = await fetch(`${apiBaseUrl}/api/flag-image`, {
                cache: 'no-store',
            });
            if (!response?.ok) {
                throw new Error(`Image data request failed (${response?.status ?? 'unknown'})`);
            }
            const { imageBuffer, countryName, options: optionNames } = await response.json();
            if (!imageBuffer || !countryName || !Array.isArray(optionNames)) {
                throw new Error('Incomplete image payload received');
            }

            setFlagImageData(`data:image/png;base64,${imageBuffer}`);
            setFlagAnswer(countryName);
            setOptions(optionNames);
            setGamePhase('question');
        } catch (error) {
            console.error('Error fetching flag photo:', error);
            setFlagImageData(null);
            setFlagAnswer('');
            setOptions([]);
            setErrorMessage(
                'We ran into a problem fetching the next flag from the server. Please check that the backend is running and try again.',
            );
            setGamePhase('error');
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl]);

    const startGame = useCallback(
        async (total) => {
            if (!total) {
                return;
            }
            setHasBootstrapped(true);
            setTargetQuestions(total);
            setScore(0);
            setQuestionsAnswered(0);
            setCountryText('');
            setFlagAnswer('');
            setOptions([]);
            setErrorMessage(null);
            setLastResult(null);
            setGamePhase('loading');
            await fetchFlagQuestion();
        },
        [fetchFlagQuestion],
    );

    const handleGuess = useCallback(
        async (providedGuess) => {
            if (isLoading || gamePhase !== 'question' || !targetQuestions) {
                return;
            }

            const guess = (providedGuess ?? countryText).trim();
            if (!guess) {
                return;
            }

            const normalizedGuess = guess.toLowerCase();
            const isCorrect = normalizedGuess === flagAnswer.toLowerCase();

            setScore((prev) => prev + (isCorrect ? 1 : 0));
            setCountryText('');
            setLastResult({
                status: isCorrect ? 'correct' : 'incorrect',
                message: isCorrect ? `Nice! ${flagAnswer} is correct.` : `The correct answer was ${flagAnswer}.`,
            });

            const nextCount = questionsAnswered + 1;
            setQuestionsAnswered(nextCount);

            if (nextCount >= targetQuestions) {
                setGamePhase('finished');
                setFlagImageData(null);
                setFlagAnswer('');
                setOptions([]);
                return;
            }

            setGamePhase('loading');
            await fetchFlagQuestion();
        },
        [countryText, flagAnswer, fetchFlagQuestion, gamePhase, isLoading, questionsAnswered, targetQuestions],
    );

    const handleModeSelect = useCallback(
        async (total) => {
            setSearchParams({ total: String(total) });
            await startGame(total);
        },
        [setSearchParams, startGame],
    );

    const handleReset = useCallback(() => {
        setSearchParams({});
        setTargetQuestions(null);
        setScore(0);
        setQuestionsAnswered(0);
        setCountryText('');
        setFlagAnswer('');
        setOptions([]);
        setErrorMessage(null);
        setLastResult(null);
        setGamePhase('setup');
        setFlagImageData(null);
        setHasBootstrapped(false);
    }, [setSearchParams]);

    useEffect(() => {
        if (totalParam && !initialTotal) {
            setSearchParams({});
        }
    }, [totalParam, initialTotal, setSearchParams]);

    useEffect(() => {
        if (initialTotal && !hasBootstrapped) {
            setHasBootstrapped(true);
            void startGame(initialTotal);
        }
    }, [initialTotal, hasBootstrapped, startGame]);

    const currentQuestionNumber = targetQuestions ? Math.min(questionsAnswered + 1, targetQuestions) : 0;
    const accuracy = targetQuestions ? Math.round((score / targetQuestions) * 100) : 0;

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 -z-20 bg-slate-950" />
            <div className="absolute inset-0 -z-10 bg-grid-radial" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(45,212,191,0.18),rgba(15,23,42,0))]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.2),rgba(15,23,42,0))]" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-20 md:px-10 lg:px-16 xl:px-20">
                <header className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/60 backdrop-blur">
                            Game Room
                        </p>
                        <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight md:text-6xl">
                            Flag Challenge Arena
                        </h1>
                        <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
                            Answer as many flags as you can without repeats. Every correct guess earns you one point. Choose your quiz length and set a new personal record.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 transition hover:border-white/30 hover:text-white"
                        >
                            Change Mode
                        </button>
                        {gamePhase === 'finished' && targetQuestions ? (
                            <button
                                type="button"
                                onClick={() => startGame(targetQuestions)}
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/20"
                            >
                                Replay Run
                            </button>
                        ) : null}
                    </div>
                </header>

                {gamePhase === 'setup' ? (
                    <section className="mt-16 flex flex-1 flex-col items-center justify-center">
                        <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
                            <h2 className="font-display text-4xl font-semibold text-white">Select your quiz length</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
                                Every mode guarantees fresh flags for the next round. Pick how many you want to conquer—earn one point for every correct answer.
                            </p>
                            <div className="mt-10 grid gap-6 sm:grid-cols-3">
                                {QUIZ_LENGTHS.map((length) => (
                                    <button
                                        key={length}
                                        type="button"
                                        onClick={() => handleModeSelect(length)}
                                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-2 hover:border-white/30"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 transition group-hover:text-white">
                                                {length} Questions
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                        <p className="mt-6 font-display text-5xl font-semibold text-white transition group-hover:text-white">
                                            {length}
                                        </p>
                                        <p className="mt-4 text-sm text-white/60 transition group-hover:text-white/80">
                                            {length === 10 && 'Perfect warm-up session.'}
                                            {length === 20 && 'Ramp up the challenge.'}
                                            {length === 30 && 'Go for the ultimate marathon.'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null}

                {gamePhase !== 'setup' ? (
                    <section className="mt-12 flex flex-1 flex-col gap-10">
                        <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="flex flex-1 flex-wrap items-center gap-6">
                                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-4 text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Score</p>
                                    <p className="mt-2 text-3xl font-bold text-white">
                                        {score}
                                        <span className="text-lg font-medium text-white/50"> / {targetQuestions ?? '—'}</span>
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-6 py-4 text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Question</p>
                                    <p className="mt-2 text-3xl font-bold text-white">
                                        {gamePhase === 'finished' ? targetQuestions : currentQuestionNumber}
                                        <span className="text-lg font-medium text-white/50"> / {targetQuestions ?? '—'}</span>
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 px-6 py-4 text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-200">Accuracy</p>
                                    <p className="mt-2 text-3xl font-bold text-white">{accuracy}%</p>
                                </div>
                            </div>
                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                <span
                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {gamePhase === 'question' || gamePhase === 'loading' ? (
                            <div className="grid flex-1 gap-8 lg:grid-cols-[3fr,2fr]">
                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-400/15 via-transparent to-transparent blur-3xl" />
                                    {flagImageData && gamePhase !== 'loading' ? (
                                        <img
                                            src={flagImageData}
                                            alt="Guess the country flag"
                                            className="relative z-10 h-full w-full rounded-2xl object-contain bg-slate-900/40 p-6"
                                        />
                                    ) : (
                                        <div className="relative z-10 flex h-full min-h-[280px] flex-col items-center justify-center gap-4 text-white/60">
                                            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-emerald-300" />
                                            <p className="text-sm uppercase tracking-[0.3em]">
                                                {gamePhase === 'loading' ? 'Loading next flag...' : 'No flag available'}
                                            </p>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent blur-3xl" />
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                        <h2 className="font-display text-2xl font-semibold text-white">Lock in your answer</h2>
                                        <p className="mt-2 text-sm text-white/60">
                                            Type the country or choose from the quick options below.
                                        </p>
                                        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                                            <input
                                                type="text"
                                                value={countryText}
                                                onChange={(event) => setCountryText(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        void handleGuess();
                                                    }
                                                }}
                                                placeholder="Your best guess..."
                                                disabled={isLoading || gamePhase !== 'question'}
                                                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-base text-white placeholder:text-white/40 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleGuess()}
                                                disabled={isLoading || gamePhase !== 'question'}
                                                className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                        {lastResult ? (
                                            <p
                                                className={`mt-4 text-sm font-medium ${lastResult.status === 'correct' ? 'text-emerald-200' : 'text-rose-200'}`}
                                            >
                                                {lastResult.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {options.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => handleGuess(option)}
                                                disabled={isLoading || gamePhase !== 'question'}
                                                className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 text-left transition hover:-translate-y-1 hover:border-white/30 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-white/30"
                                            >
                                                <span className="block text-lg font-semibold text-white transition group-hover:text-emerald-200">
                                                    {option}
                                                </span>
                                                <span className="mt-2 block text-xs uppercase tracking-[0.35em] text-white/40">
                                                    Quick answer
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {gamePhase === 'error' ? (
                            <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 p-10 text-center backdrop-blur">
                                <h2 className="font-display text-3xl font-semibold text-white">Connection hiccup</h2>
                                <p className="mt-3 text-sm text-white/70">
                                    {errorMessage ?? 'We could not load the next flag. Please try again.'}
                                </p>
                                <div className="mt-6 flex justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fetchFlagQuestion()}
                                        className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40 hover:text-white"
                                    >
                                        Retry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/60 transition hover:border-white/30 hover:text-white"
                                    >
                                        Change mode
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {gamePhase === 'finished' && targetQuestions ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-2xl backdrop-blur">
                                <h2 className="font-display text-4xl font-semibold text-white">Run complete!</h2>
                                <p className="mt-4 text-base text-white/70">
                                    You scored <span className="font-semibold text-emerald-200">{score}</span> out of{' '}
                                    <span className="font-semibold text-emerald-200">{targetQuestions}</span>. Keep the momentum going and try to beat your personal best.
                                </p>
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                                    <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 px-8 py-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Score</p>
                                        <p className="mt-2 text-4xl font-bold text-white">
                                            {score}
                                            <span className="text-lg font-medium text-white/50"> / {targetQuestions}</span>
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 px-8 py-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Accuracy</p>
                                        <p className="mt-2 text-4xl font-bold text-white">{accuracy}%</p>
                                    </div>
                                </div>
                                <div className="mt-12 flex flex-wrap justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => startGame(targetQuestions)}
                                        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/20"
                                    >
                                        Play again
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
                                    >
                                        Change mode
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </section>
                ) : null}
            </div>
        </div>
    );
}

export default Game;

