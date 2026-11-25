
import './styles.css';

import { Navbar } from './components/navbar.js';
import { Hero } from './components/hero.js';
import { Footer } from './components/footer.js';

import {
    Upload,
    initializeUpload,
} from './components/upload.js';

import {
    Results,
    renderResults,
} from './components/results.js';


const app = document.querySelector('#app');


app.innerHTML = `
    <div class="flex min-h-screen flex-col">

        ${Navbar()}

        <main class="flex-1">

            ${Hero()}

            <section id="classifier"
                     class="mx-auto grid max-w-6xl
                            items-start gap-6 px-6
                            md:grid-cols-2">

                ${Upload()}
                ${Results()}

            </section>

            <section id="about"
                     class="mx-auto mt-20 max-w-3xl
                            px-6 text-center">

                <h2 class="text-2xl font-bold text-brand-900">
                    About Pets
                </h2>

                <p class="mt-4 leading-relaxed text-slate-600">
                    Pets is a deep learning project exploring
                    computer vision, transfer learning and
                    full-stack machine learning deployment.
                </p>

            </section>

        </main>

        ${Footer()}

    </div>
`;


initializeUpload(async (file) => {
    console.log('Selected image:', file);

    // Simulate network latency during frontend development.
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    // Temporary test data from our previous API result.
    const mockPrediction = {
        breed: 'Beagle',
        confidence: 0.9621317386627197,
        predictions: [
            {
                breed: 'Beagle',
                confidence: 0.9621317386627197,
            },
            {
                breed: 'Basset Hound',
                confidence: 0.024385787546634674,
            },
            {
                breed: 'Shiba Inu',
                confidence: 0.007599668111652136,
            },
        ],
    };

    renderResults(mockPrediction);
});
