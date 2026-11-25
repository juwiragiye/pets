
import {
    validateImage,
    formatFileSize,
} from '../utils/validation.js';


export function Upload() {
    return `
        <div class="rounded-2xl border border-brand-100
                    bg-white p-6 shadow-sm">

            <h2 class="text-xl font-semibold text-brand-900">
                Upload an image
            </h2>

            <p class="mt-2 text-sm text-slate-500">
                Choose a clear picture of your cat or dog.
            </p>

            <input
                type="file"
                id="file-input"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
            />

            <div id="drop-zone"
                 class="mt-6 flex min-h-72 flex-col
                        items-center justify-center
                        rounded-xl border-2 border-dashed
                        border-brand-300 bg-brand-50
                        p-6 text-center transition-colors">

                <svg xmlns="http://www.w3.org/2000/svg"
                     class="mb-4 h-12 w-12 text-brand-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     stroke-width="1.5">

                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 16V4m-5 5 5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>

                </svg>

                <p class="font-medium text-brand-900">
                    Drag and drop your image here
                </p>

                <p class="mt-2 text-sm text-slate-500">
                    or browse your files
                </p>

                <button id="browse-button"
                        type="button"
                        class="mt-5 rounded-lg bg-brand-800
                               px-5 py-3 text-sm font-medium
                               text-white hover:bg-brand-700">

                    Choose image

                </button>

                <p class="mt-4 text-xs text-slate-400">
                    JPG, PNG, WEBP · Maximum 5 MB
                </p>

            </div>

            <div id="image-preview" class="mt-6 hidden">

                <img id="preview-image"
                     alt="Selected pet image"
                     class="h-72 w-full rounded-xl
                            bg-brand-50 object-contain" />

                <div class="mt-4 flex items-center
                            justify-between gap-4">

                    <div class="min-w-0">
                        <p id="file-name"
                           class="truncate text-sm font-medium
                                  text-slate-700"></p>

                        <p id="file-size"
                           class="text-xs text-slate-500"></p>
                    </div>

                    <button id="remove-button"
                            type="button"
                            class="rounded-lg px-3 py-2
                                   text-sm font-medium
                                   text-red-600 hover:bg-red-50">

                        Remove

                    </button>

                </div>

            </div>

            <div id="upload-error"
                 role="alert"
                 class="mt-4 hidden rounded-lg bg-red-50
                        p-3 text-sm text-red-700">
            </div>

            <button id="predict-button"
                    type="button"
                    disabled
                    class="mt-6 w-full rounded-xl bg-brand-800
                           px-6 py-4 font-semibold text-white
                           transition-colors hover:bg-brand-700
                           disabled:cursor-not-allowed
                           disabled:opacity-40">

                Identify breed

            </button>

        </div>
    `;
}


export function initializeUpload(onPredict) {
    const fileInput = document.querySelector('#file-input');
    const browseButton = document.querySelector('#browse-button');
    const dropZone = document.querySelector('#drop-zone');

    const preview = document.querySelector('#image-preview');
    const previewImage = document.querySelector('#preview-image');

    const fileName = document.querySelector('#file-name');
    const fileSize = document.querySelector('#file-size');

    const removeButton = document.querySelector('#remove-button');
    const predictButton = document.querySelector('#predict-button');
    const errorBox = document.querySelector('#upload-error');

    let selectedFile = null;
    let previewUrl = null;
    let isLoading = false;


    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }


    function clearError() {
        errorBox.textContent = '';
        errorBox.classList.add('hidden');
    }


    function revokePreview() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }
    }


    function selectFile(file) {
        if (isLoading) return;

        clearError();

        const validation = validateImage(file);

        if (!validation.valid) {
            showError(validation.error);
            return;
        }

        revokePreview();

        selectedFile = file;
        previewUrl = URL.createObjectURL(file);

        previewImage.src = previewUrl;

        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);

        dropZone.classList.add('hidden');
        preview.classList.remove('hidden');

        predictButton.disabled = false;
    }


    function removeFile() {
        if (isLoading) return;

        selectedFile = null;

        revokePreview();

        fileInput.value = '';
        previewImage.removeAttribute('src');

        preview.classList.add('hidden');
        dropZone.classList.remove('hidden');

        predictButton.disabled = true;

        clearError();
    }


    browseButton.addEventListener('click', () => {
        fileInput.click();
    });


    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) selectFile(file);
    });


    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();

        dropZone.classList.add(
            'border-brand-600',
            'bg-brand-100'
        );
    });


    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove(
            'border-brand-600',
            'bg-brand-100'
        );
    });


    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();

        dropZone.classList.remove(
            'border-brand-600',
            'bg-brand-100'
        );

        const file = event.dataTransfer.files[0];

        if (file) selectFile(file);
    });


    removeButton.addEventListener('click', removeFile);


    predictButton.addEventListener('click', async () => {
        if (!selectedFile || isLoading) return;

        clearError();

        isLoading = true;

        predictButton.disabled = true;
        removeButton.disabled = true;

        predictButton.textContent = 'Analyzing image...';

        try {
            await onPredict(selectedFile);
        } catch (error) {
            showError(
                error.message || 'Something went wrong.'
            );
        } finally {
            isLoading = false;

            predictButton.disabled = !selectedFile;
            removeButton.disabled = false;

            predictButton.textContent = 'Identify breed';
        }
    });


    previewImage.addEventListener('error', () => {
        removeFile();
        showError('Unable to preview this image.');
    });
}
