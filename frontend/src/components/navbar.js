
export function Navbar() {
    return `
        <header class="border-b border-brand-100">
            <nav class="mx-auto flex max-w-7xl items-center
                        justify-between px-6 py-5">

                <a href="/" class="text-3xl font-bold
                                   tracking-tight text-brand-900">
                    pets.
                </a>

                <div class="flex items-center gap-6">

                    <a href="#classifier"
                       class="text-sm font-medium text-slate-600
                              hover:text-brand-800">
                        Classifier
                    </a>

                    <a href="#about"
                       class="text-sm font-medium text-slate-600
                              hover:text-brand-800">
                        About
                    </a>

                    <span id="model-status"
                          class="flex items-center gap-2 text-xs
                                 text-slate-500">

                        <span class="h-2 w-2 rounded-full
                                     bg-slate-400"></span>

                        Checking model

                    </span>

                </div>
            </nav>
        </header>
    `;
}
