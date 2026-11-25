
import {
    describe,
    it,
    expect,
    beforeEach,
} from 'vitest';

import {
    Navbar,
    updateModelStatus,
} from '../src/components/navbar.js';


describe('Navigation component', () => {

    beforeEach(() => {
        document.body.innerHTML = Navbar();
    });


    it('renders the navigation bar', () => {

        expect(document.querySelector('nav'))
            .not.toBeNull();
    });


    it.each([
        ['checking', 'Checking model'],
        ['online', 'Model online'],
        ['unavailable', 'Model unavailable'],
        ['offline', 'API offline'],
    ])('displays model status: %s', (status, label) => {

        updateModelStatus(status);

        expect(
            document.querySelector('#model-status')
                .textContent
        ).toContain(label);
    });


    it('ignores an unknown status', () => {

        updateModelStatus('online');
        updateModelStatus('invalid');

        expect(
            document.querySelector('#model-status')
                .textContent
        ).toContain('Model online');
    });

});
