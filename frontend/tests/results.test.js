
import {
    describe,
    it,
    expect,
    beforeEach,
} from 'vitest';

import {
    Results,
    renderResults,
    renderLoading,
    renderError,
    resetResults,
} from '../src/components/results.js';


const prediction = {
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


describe('Prediction results component', () => {

    beforeEach(() => {
        document.body.innerHTML = Results();
    });


    it('displays the initial empty state', () => {

        expect(document.body.textContent)
            .toContain('No predictions yet');
    });


    it('renders the predicted breed', () => {

        renderResults(prediction);

        expect(
            document.querySelector('#result-breed')
                .textContent
        ).toBe('Beagle');
    });


    it('formats confidence as a percentage', () => {

        renderResults(prediction);

        expect(
            document.querySelector('#result-confidence')
                .textContent
        ).toBe('96.21%');
    });


    it('renders the top three predictions', () => {

        renderResults(prediction);

        const predictions = document.querySelectorAll(
            '#prediction-list > div'
        );

        expect(predictions.length).toBe(3);
    });


    it('displays the loading state', () => {

        renderLoading();

        expect(document.body.textContent)
            .toContain('Analyzing your pet');

        expect(
            document.querySelector('#results-content')
                .getAttribute('aria-busy')
        ).toBe('true');
    });


    it('clears loading after a successful prediction', () => {

        renderLoading();
        renderResults(prediction);

        expect(
            document.querySelector('#results-content')
                .getAttribute('aria-busy')
        ).toBe('false');
    });


    it('displays prediction errors', () => {

        renderError('Model is not available.');

        expect(document.body.textContent)
            .toContain('Prediction failed');

        expect(document.body.textContent)
            .toContain('Model is not available.');
    });


    it('resets previous predictions', () => {

        renderResults(prediction);

        resetResults();

        expect(document.body.textContent)
            .toContain('No predictions yet');

        expect(
            document.querySelector('#result-breed')
        ).toBeNull();
    });


    it('renders external breed names safely', () => {

        renderResults({
            ...prediction,
            breed: '<img src=x onerror=alert(1)>',
        });

        const breed = document.querySelector(
            '#result-breed'
        );

        expect(breed.querySelector('img')).toBeNull();

        expect(breed.textContent).toBe(
            '<img src=x onerror=alert(1)>'
        );
    });

});
