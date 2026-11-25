
import './styles.css';

import {
    Navbar,
    updateModelStatus,
} from './components/navbar.js';

import { Hero } from './components/hero.js';
import { Footer } from './components/footer.js';

import {
    Upload,
    initializeUpload,
} from './components/upload.js';

import {
    Results,
    renderResults,
    renderLoading,
    renderError,
    resetResults,
} from './components/results.js';

import {
    getHealth,
    predictImage,
} from './services/api.js';


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
                    Pets is an end-to-end deep learning project
                    exploring computer vision, transfer learning
                    and machine learning deployment.
                </p>

                <p class="mt-4 leading-relaxed text-slate-600">
                    Built using fastai, PyTorch, FastAPI,
                    Vanilla JavaScript, Tailwind CSS and Vite.
                </p>

            </section>

        </main>

        ${Footer()}

    </div>
`;


async function checkModelStatus() {
    updateModelStatus('checking');

    try {
        const health = await getHealth();

        updateModelStatus(
            health.model_loaded
                ? 'online'
                : 'unavailable'
        );
    } catch {
        updateModelStatus('offline');
    }
}


async function handlePrediction(file) {
    renderLoading();

    try {
        const prediction = await predictImage(file);

        renderResults(prediction);
    } catch (error) {
        renderError(error.message);
    } finally {
        checkModelStatus();
    }
}


initializeUpload(
    handlePrediction,
    resetResults
);

checkModelStatus();
