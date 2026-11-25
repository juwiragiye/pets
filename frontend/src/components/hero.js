
export function Hero() {
    return `
        <section class="mx-auto max-w-4xl px-6
                        pb-12 pt-20 text-center">

            <span class="inline-block rounded-full bg-brand-100
                         px-4 py-2 text-xs font-semibold
                         tracking-wider text-brand-700 uppercase">

                Powered by Deep Learning

            </span>

            <h1 class="mt-6 text-5xl font-bold tracking-tight
                       text-brand-900 md:text-7xl">

                Every pet has a story.

                <span class="block text-brand-500">
                    Discover their breed.
                </span>

            </h1>

            <p class="mx-auto mt-6 max-w-xl text-lg
                      leading-relaxed text-slate-600">

                Upload a picture of your cat or dog and
                discover its breed using artificial
                intelligence and computer vision.

            </p>

            <div class="mt-8 flex flex-wrap justify-center
                        gap-3 text-sm text-slate-600">

                <span class="rounded-full border
                             border-brand-200 px-4 py-2">
                    37 pet breeds
                </span>

                <span class="rounded-full border
                             border-brand-200 px-4 py-2">
                    Deep learning
                </span>

                <span class="rounded-full border
                             border-brand-200 px-4 py-2">
                    Real-time inference
                </span>

            </div>

        </section>
    `;
}
