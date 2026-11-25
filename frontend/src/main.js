
import './styles.css';

import { Navbar } from './components/navbar.js';
import { Hero } from './components/hero.js';
import { Footer } from './components/footer.js';

const app = document.querySelector('#app');

app.innerHTML = `
    <div class="flex min-h-screen flex-col">

        ${Navbar()}

        <main class="flex-1">

            ${Hero()}

            <section id="classifier"
                     class="mx-auto max-w-6xl px-6">

                <!-- Image classifier component -->

            </section>

            <section id="about"
                     class="mx-auto mt-20 max-w-3xl
                            px-6 text-center">

                <h2 class="text-2xl font-bold text-brand-900">
                    About Pets
                </h2>

                <p class="mt-4 leading-relaxed text-slate-600">
                    Pets is a deep learning project that explores
                    computer vision, transfer learning and
                    full-stack machine learning deployment.
                </p>

            </section>

        </main>

        ${Footer()}

    </div>
`;
