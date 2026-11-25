
import { describe, it, expect } from 'vitest';

import {
    validateImage,
    formatFileSize,
    MAX_FILE_SIZE,
} from '../src/utils/validation.js';


describe('Image validation', () => {

    it.each([
        ['pet.jpg', 'image/jpeg'],
        ['pet.png', 'image/png'],
        ['pet.webp', 'image/webp'],
    ])('accepts supported image %s', (name, type) => {

        const file = new File(
            ['image-content'],
            name,
            { type }
        );

        expect(validateImage(file).valid).toBe(true);
    });


    it('rejects unsupported file types', () => {

        const file = new File(
            ['document'],
            'document.pdf',
            { type: 'application/pdf' }
        );

        expect(validateImage(file).valid).toBe(false);
    });


    it('rejects empty files', () => {

        const file = new File(
            [],
            'empty.jpg',
            { type: 'image/jpeg' }
        );

        expect(validateImage(file).valid).toBe(false);
    });


    it('rejects files larger than 5 MB', () => {

        const file = new File(
            [new Uint8Array(MAX_FILE_SIZE + 1)],
            'large.jpg',
            { type: 'image/jpeg' }
        );

        expect(validateImage(file).valid).toBe(false);
    });


    it('accepts files exactly at the size limit', () => {

        const file = new File(
            [new Uint8Array(MAX_FILE_SIZE)],
            'pet.jpg',
            { type: 'image/jpeg' }
        );

        expect(validateImage(file).valid).toBe(true);
    });


    it('rejects missing files', () => {

        expect(validateImage(null).valid).toBe(false);
    });

});


describe('File size formatting', () => {

    it('formats bytes', () => {
        expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes', () => {
        expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('formats megabytes', () => {
        expect(
            formatFileSize(1024 * 1024)
        ).toBe('1.00 MB');
    });

});
