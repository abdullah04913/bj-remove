function triggerUpload() {
    document.getElementById('imageInput').click();
}

document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    document.getElementById('loading').style.display = 'block';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': 'YOUR_API_KEY' }, // Replace with your API Key
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        return response.blob();
    })
    .then(blob => {
        document.getElementById('loading').style.display = 'none';

        const originalImageUrl = URL.createObjectURL(file);
        document.getElementById('original-image').src = originalImageUrl;

        const processedImageUrl = URL.createObjectURL(blob);
        document.getElementById('preview').src = processedImageUrl;

        document.getElementById('preview-section').style.display = 'block';

        document.getElementById('download-btn').href = processedImageUrl;
        document.getElementById('download-btn').style.display = 'inline-block';

        setTimeout(() => {
            URL.revokeObjectURL(originalImageUrl);
            URL.revokeObjectURL(processedImageUrl);
        }, 60000);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Failed to process image. Please check your API key or try again later.');
    });
});