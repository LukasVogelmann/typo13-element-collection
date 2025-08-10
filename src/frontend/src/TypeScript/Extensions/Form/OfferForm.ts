export default class OfferForm {
    private nodes = <NodeListOf<HTMLInputElement>>document.querySelectorAll('input[type="file"]');
    private selectedFiles: { id: string; file: File }[] = [];
    private STATE_UPLOADING = 'uploading';
    private STATE_UPLOADED = 'uploaded';
    private STATE_ERROR = 'error';

    constructor() {
        if (this.nodes.length === 0) {
            return;
        }

        for (const node of this.nodes) {
            node.addEventListener('change', (event) => this.handleFileInput(event));
        }
    }

    private handleFileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        const newFiles = Array.from(input.files).map((file) => ({
            id: this.generateUniqueId(),
            file,
        }));

        this.selectedFiles = [...this.selectedFiles, ...newFiles];
        this.selectedFiles = this.removeDuplicates(this.selectedFiles);

        this.clearUI();
        this.uploadFiles(input);
        this.updateFileList(input);
        this.updateSubmitButton(input);
    }

    private generateUniqueId(): string {
        return `file-${Math.random().toString(36).substr(2, 9)}`;
    }

    private async uploadFiles(input: HTMLInputElement): Promise<void> {
        const formData = new FormData();

        for (const fileObj of this.selectedFiles) {
            const nodeFile = this.createNodeForFile(fileObj, input);
            this.validateFile(nodeFile, fileObj.file, input);
            formData.append('files[]', fileObj.file);
        }
    }

    private updateFileList(input: HTMLInputElement): void {
        const dataTransfer = new DataTransfer();
        this.selectedFiles.forEach(({ file }) => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    }

    private createNodeForFile(fileObj: { id: string; file: File }, input: HTMLInputElement): HTMLElement {
        const formNode = input.closest('form');

        if (!formNode) {
            console.error('Form not found!');
            return document.createElement('div');
        }

        const nodes = {
            uploading: formNode.querySelector('.files-uploading'),
            currentFile: formNode.querySelector('.files-uploading .current-file'),
            totalFiles: formNode.querySelector('.files-uploading .total-files'),
            file: formNode.querySelector('.template .file'),
            uploaded: formNode.querySelector('.files-uploaded'),
            uploadedFiles: formNode.querySelector('.files-uploaded .files'),
        };

        (<HTMLDivElement>nodes.uploading).removeAttribute('hidden');
        (<HTMLSpanElement>nodes.totalFiles).textContent = this.selectedFiles.length.toString();

        const nodeFile = nodes.file?.cloneNode(true) as HTMLElement;
        nodeFile.removeAttribute('hidden');
        nodeFile.setAttribute('data-state', this.STATE_UPLOADING);
        nodeFile.setAttribute('data-id', fileObj.id);

        (<HTMLDivElement>nodeFile.querySelector('.heading')).textContent = fileObj.file.name;
        formNode.querySelector('.files')?.appendChild(nodeFile);

        const deleteIcons = nodeFile.querySelectorAll('svg');
        for (const icon of deleteIcons) {
            icon.onclick = async () => {
                this.removeFileById(input, fileObj.id, nodeFile);
                this.updateSubmitButton(input);
            };
        }
        return nodeFile;
    }

    private removeFileById(input: HTMLInputElement, id: string, nodeFile: HTMLElement): void {
        this.selectedFiles = this.selectedFiles.filter((fileObj) => fileObj.id !== id);

        this.clearUI();
        this.uploadFiles(input);
        this.updateFileList(input);

        nodeFile.parentNode?.removeChild(nodeFile);

        const uploadingSection = document.querySelector('.files-uploading');
        const uploadedSection = document.querySelector('.files-uploaded');
        const filesSection = document.querySelector('.files');

        if (filesSection && filesSection.children.length === 0) {
            uploadingSection?.setAttribute('hidden', 'true');
        }
        if (uploadedSection && uploadedSection.querySelector('.files')?.children.length === 0) {
            uploadedSection?.setAttribute('hidden', 'true');
        }
    }

    private removeDuplicates(files: { id: string; file: File }[]): { id: string; file: File }[] {
        const uniqueFiles = new Map<string, { id: string; file: File }>();
        files.forEach((fileObj) => uniqueFiles.set(fileObj.file.name, fileObj));
        return Array.from(uniqueFiles.values());
    }

    private clearUI(): void {
        const allFiles = document.querySelectorAll('.files .file') as NodeListOf<HTMLElement>;
        allFiles.forEach((file) => file.remove());
    }

    private validateFile(node: HTMLElement, file: File, input: HTMLInputElement): void {
        const accept = input.getAttribute('accept');
        const allowedMimeTypes = accept ? accept.split(',').map((type) => type.trim()) : [];
        const maxSize = 20 * 1024 * 1024; // 20MB

        if (allowedMimeTypes.includes('application/zip')) {
            allowedMimeTypes.push('application/x-zip-compressed');
        }

        if (!allowedMimeTypes.includes(file.type)) {
            this.showError(node, 'This document is not supported, please delete and upload another file.');
            return;
        }

        if (file.size > maxSize) {
            this.showError(node, 'File size exceeds the 20MB limit.');
            return;
        }

        this.markAsUploaded(node);
    }

    private showError(node: HTMLElement, message: string): void {
        const pTag = document.createElement('p');
        node.setAttribute('data-state', this.STATE_ERROR);
        pTag.classList.add('error');
        pTag.textContent = message;
        node.appendChild(pTag);
    }

    private markAsUploaded(node: HTMLElement): void {
        const uploadedSection = document.querySelector('.files-uploaded') as HTMLElement;
        const uploadingSection = document.querySelector('.files-uploading');
        const filesSection = document.querySelector('.files');

        if (uploadedSection) {
            uploadedSection.removeAttribute('hidden');
            node.setAttribute('data-state', this.STATE_UPLOADED);
            uploadedSection.querySelector('.files')?.appendChild(node);
        }

        if (filesSection && filesSection.children.length === 0) {
            uploadingSection?.setAttribute('hidden', 'true');
        }
    }

    private updateSubmitButton(input: HTMLInputElement): void {
        const submitButton = input.closest('form')?.querySelector('button[type="submit"]');
        const hasErrors = !!input.closest('.input')?.querySelector('.error');

        if (hasErrors) {
            submitButton?.setAttribute('disabled', 'true');
            submitButton?.classList.remove('btnPrimary');
            submitButton?.classList.add('btnPrimaryDisabled');
        } else {
            submitButton?.removeAttribute('disabled');
            submitButton?.classList.add('btnPrimary');
            submitButton?.classList.remove('btnPrimaryDisabled');
        }
    }
}
