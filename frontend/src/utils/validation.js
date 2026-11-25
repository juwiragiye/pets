
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

export function validateImage(file) {
    if (!file) {
        return {
            valid: false,
            error: 'Please select an image.',
        };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Only JPEG, PNG and WEBP images are supported.',
        };
    }

    if (file.size === 0) {
        return {
            valid: false,
            error: 'The selected image is empty.',
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: 'Image must not exceed 5 MB.',
        };
    }

    return {
        valid: true,
        error: null,
    };
}

export function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
