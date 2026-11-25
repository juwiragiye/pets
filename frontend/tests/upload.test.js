
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from 'vitest';

import {
    Upload,
    initializeUpload,
} from '../src/components/upload.js';


describe('Image upload component', () => {

    let onPredict;
    let onReset;


    beforeEach(() => {

        document.body.innerHTML = Upload();

        onPredict = vi.fn().mockResolvedValue(undefined);
        onReset = vi.fn();

        vi.stubGlobal(
            'URL',
            class extends URL {
                static createObjectURL = vi.fn(
                    () => 'blob:test-image'
                );

                static revokeObjectURL = vi.fn();
            }
        );

        initializeUpload(onPredict, onReset);
    });


    function selectFile(file) {

        const input = document.querySelector('#file-input');

        Object.defineProperty(input, 'files', {
            value: [file],
            configurable: true,
        });

        input.dispatchEvent(
            new Event('change', { bubbles: true })
        );
    }


    function createImage() {

        return new File(
            ['image-content'],
            'beagle.jpg',
            { type: 'image/jpeg' }
        );
    }


    it('disables prediction initially', () => {

        expect(
            document.querySelector('#predict-button')
                .disabled
        ).toBe(true);
    });


    it('enables prediction after image selection', () => {

        selectFile(createImage());

        expect(
            document.querySelector('#predict-button')
                .disabled
        ).toBe(false);
    });


    it('displays the selected filename', () => {

        selectFile(createImage());

        expect(
            document.querySelector('#file-name')
                .textContent
        ).toBe('beagle.jpg');
    });


    it('displays the image preview', () => {

        selectFile(createImage());

        expect(
            document.querySelector('#image-preview')
                .classList.contains('hidden')
        ).toBe(false);
    });


    it('rejects unsupported files', () => {

        const file = new File(
            ['document'],
            'document.pdf',
            { type: 'application/pdf' }
        );

        selectFile(file);

        const error = document.querySelector(
            '#upload-error'
        );

        expect(
            error.classList.contains('hidden')
        ).toBe(false);

        expect(error.textContent)
            .toContain('Only JPEG, PNG and WEBP');
    });


    it('removes the selected image', () => {

        selectFile(createImage());

        document.querySelector('#remove-button').click();

        expect(
            document.querySelector('#predict-button')
                .disabled
        ).toBe(true);

        expect(
            document.querySelector('#image-preview')
                .classList.contains('hidden')
        ).toBe(true);
    });


    it('releases the preview URL when removing an image', () => {

        selectFile(createImage());

        document.querySelector('#remove-button').click();

        expect(URL.revokeObjectURL)
            .toHaveBeenCalledWith('blob:test-image');
    });


    it('calls prediction with the selected file', async () => {

        const file = createImage();

        selectFile(file);

        document.querySelector('#predict-button').click();

        await vi.waitFor(() => {
            expect(onPredict).toHaveBeenCalledWith(file);
        });
    });


    it('restores the button after prediction', async () => {

        selectFile(createImage());

        const button = document.querySelector(
            '#predict-button'
        );

        button.click();

        await vi.waitFor(() => {

            expect(button.disabled).toBe(false);

            expect(button.textContent)
                .toContain('Identify breed');
        });
    });


    it('resets results when selecting or removing an image', () => {

        selectFile(createImage());

        document.querySelector('#remove-button').click();

        expect(onReset).toHaveBeenCalledTimes(2);
    });


    it('displays errors when prediction fails', async () => {

        onPredict.mockRejectedValue(
            new Error('API connection failed')
        );

        selectFile(createImage());

        document.querySelector('#predict-button').click();

        await vi.waitFor(() => {

            expect(
                document.querySelector('#upload-error')
                    .textContent
            ).toContain('API connection failed');
        });
    });

});
