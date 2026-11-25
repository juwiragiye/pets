
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from 'vitest';

import {
    getHealth,
    getBreeds,
    predictImage,
} from '../src/services/api.js';


describe('Pets API service', () => {

    let fetchMock;

    beforeEach(() => {
        fetchMock = vi.fn();

        vi.stubGlobal('fetch', fetchMock);
    });


    it('retrieves API health status', async () => {

        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({
                status: 'ok',
                model_loaded: true,
            }),
        });

        const result = await getHealth();

        expect(result.status).toBe('ok');
        expect(result.model_loaded).toBe(true);

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringMatching(/\/health$/),
            expect.any(Object)
        );
    });


    it('retrieves supported breeds', async () => {

        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({
                count: 3,
                breeds: [
                    'Beagle',
                    'Basset Hound',
                    'Shiba Inu',
                ],
            }),
        });

        const result = await getBreeds();

        expect(result.count).toBe(3);
        expect(result.breeds).toContain('Beagle');
    });


    it('uploads an image using FormData', async () => {

        const file = new File(
            ['image-content'],
            'pet.jpg',
            { type: 'image/jpeg' }
        );

        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({
                breed: 'Beagle',
                confidence: 0.96,
                predictions: [],
            }),
        });

        const result = await predictImage(file);

        const [url, options] = fetchMock.mock.calls[0];

        expect(url).toMatch(/\/predict$/);
        expect(options.method).toBe('POST');

        expect(options.body).toBeInstanceOf(FormData);

        expect(options.body.get('file').name)
            .toBe('pet.jpg');

        expect(result.breed).toBe('Beagle');
    });


    it('handles network failures', async () => {

        fetchMock.mockRejectedValue(
            new TypeError('Failed to fetch')
        );

        await expect(getHealth()).rejects.toThrow(
            'Unable to connect to the Pets API.'
        );
    });


    it('handles request timeouts', async () => {

        fetchMock.mockRejectedValue(
            new DOMException(
                'Request timed out',
                'TimeoutError'
            )
        );

        await expect(getHealth()).rejects.toThrow(
            'The request timed out. Please try again.'
        );
    });


    it('handles unavailable models', async () => {

        fetchMock.mockResolvedValue({
            ok: false,
            status: 503,
            json: async () => ({
                detail: 'Model is not available.',
            }),
        });

        const file = new File(
            ['image'],
            'pet.jpg',
            { type: 'image/jpeg' }
        );

        await expect(predictImage(file)).rejects.toThrow(
            'Model is not available.'
        );
    });


    it('handles backend validation errors', async () => {

        fetchMock.mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({
                detail: 'Invalid or corrupted image.',
            }),
        });

        await expect(getHealth()).rejects.toThrow(
            'Invalid or corrupted image.'
        );
    });


    it('handles unexpected server errors', async () => {

        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => {
                throw new Error('Invalid JSON');
            },
        });

        await expect(getHealth()).rejects.toThrow(
            'Request failed (500).'
        );
    });

});
