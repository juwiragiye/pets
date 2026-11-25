
export function Footer() {
    return `
        <footer class="mt-20 border-t border-brand-100">

            <div class="mx-auto flex max-w-7xl flex-col
                        items-center justify-between gap-4
                        px-6 py-8 md:flex-row">

                <p class="font-bold text-brand-900">
                    pets.
                </p>

                <p class="text-sm text-slate-500">
                    An open-source deep learning project.
                </p>

                <p class="text-xs text-slate-400">
                    Built with fastai, FastAPI and JavaScript.
                </p>

            </div>

        </footer>
    `;
}
