
const API_URL = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:8000'
).replace(/\/+$/, '');


async function request(endpoint, options = {}) {
    let response;

    try {
        response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                signal: AbortSignal.timeout(30000),
            }
        );
    } catch (error) {
        if (error.name === 'TimeoutError') {
            throw new Error(
                'The request timed out. Please try again.'
            );
        }

        throw new Error(
            'Unable to connect to the Pets API.'
        );
    }

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        const message = typeof data?.detail === 'string'
            ? data.detail
            : `Request failed (${response.status}).`;

        throw new Error(message);
    }

    return response.json();
}


export async function getHealth() {
    return request('/health');
}


export async function getBreeds() {
    return request('/breeds');
}


export async function predictImage(file) {
    const formData = new FormData();

    formData.append('file', file);

    return request('/predict', {
        method: 'POST',
        body: formData,
    });
}
