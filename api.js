document.addEventListener('DOMContentLoaded', function() {
    // Data API (sama seperti sebelumnya)
    const apiData = [
        {
            method: 'GET',
            endpoint: '/bratgambar',
            title: 'Brat Gambar Generator',
            description: 'Buat gambar teks bergaya brat. Teks panjang otomatis 2 baris.',
            category: 'brat',
            docs: {
                summary: 'Menghasilkan gambar PNG dengan teks di tengah.',
                parameters: [
                    { name: 'text', type: 'string', required: true, description: 'Teks (URL encoded).' }
                ],
                example: '/bratgambar?text=Halo%20Dunia',
                response: 'Gambar PNG'
            }
        },
        {
            method: 'GET',
            endpoint: '/bratv2',
            title: 'Brat V2 (Warna)',
            description: 'Versi berwarna dengan latar gradien. Bisa atur warna teks.',
            category: 'brat',
            docs: {
                summary: 'Brat dengan warna kustom.',
                parameters: [
                    { name: 'text', type: 'string', required: true, description: 'Teks.' },
                    { name: 'color', type: 'string', required: false, description: 'Warna teks (contoh: red, #ff0000).' }
                ],
                example: '/bratv2?text=Halo&color=red',
                response: 'Gambar PNG berwarna'
            }
        },
        {
            method: 'POST',
            endpoint: '/image2text',
            title: 'Image to Text (OCR)',
            description: 'Ekstrak teks dari gambar. Kirim file via form-data.',
            category: 'image',
            docs: {
                summary: 'OCR untuk membaca teks dari gambar.',
                parameters: [
                    { name: 'image', type: 'file', required: true, description: 'File gambar (jpg/png).' }
                ],
                example: 'POST /image2text dengan form-data',
                response: '{ "text": "hasil ocr" }'
            }
        },
        {
            method: 'GET',
            endpoint: '/youtube',
            title: 'YouTube Downloader',
            description: 'Download video YouTube dalam berbagai kualitas.',
            category: 'video',
            docs: {
                summary: 'Download video YouTube.',
                parameters: [
                    { name: 'url', type: 'string', required: true, description: 'URL video YouTube.' },
                    { name: 'quality', type: 'string', required: false, description: 'Kualitas (360p, 720p).' }
                ],
                example: '/youtube?url=https://youtu.be/...&quality=720p',
                response: 'Redirect ke file video'
            }
        },
        {
            method: 'GET',
            endpoint: '/tiktok',
            title: 'TikTok Downloader',
            description: 'Download video TikTok tanpa watermark.',
            category: 'downloader',
            docs: {
                summary: 'Download video TikTok tanpa watermark.',
                parameters: [
                    { name: 'url', type: 'string', required: true, description: 'URL video TikTok.' }
                ],
                example: '/tiktok?url=https://tiktok.com/...',
                response: 'Redirect ke file video'
            }
        }
    ];

    const container = document.getElementById('cardContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const modal = document.getElementById('detailModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const modalContent = document.getElementById('modalContent');

    // Simpan semua data untuk filter
    let allData = apiData;

    // Fungsi render cards
    function renderCards(data) {
        container.innerHTML = data.map(item => `
            <div class="api-card">
                <div class="card-header">
                    <span class="method">${item.method}</span>
                    <span class="endpoint">${item.endpoint}</span>
                </div>
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="card-footer">
                    <button class="btn-detail" data-id='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
                        <i class="fas fa-info-circle"></i> Lihat Detail
                    </button>
                </div>
            </div>
        `).join('');
        attachDetailEvents();
    }

    // Event listener untuk tombol detail
    function attachDetailEvents() {
        document.querySelectorAll('.btn-detail').forEach(btn => {
            btn.addEventListener('click', function() {
                try {
                    const data = JSON.parse(this.dataset.id);
                    showModal(data);
                } catch (e) {
                    console.error(e);
                }
            });
        });
    }

    // Tampilkan modal
    function showModal(data) {
        let paramsHtml = '';
        if (data.docs.parameters && data.docs.parameters.length) {
            paramsHtml = '<h3>📌 Parameter</h3><ul>';
            data.docs.parameters.forEach(p => {
                paramsHtml += `<li><code>${p.name}</code> (${p.type}) ${p.required ? '<span style="color:#ff69b4;">wajib</span>' : 'opsional'}: ${p.description}</li>`;
            });
            paramsHtml += '</ul>';
        }
        modalContent.innerHTML = `
            <h2>${data.title}</h2>
            <div style="margin-bottom:25px">
                <span class="method-badge">${data.method}</span>
                <span class="endpoint-badge">${data.endpoint}</span>
            </div>
            <p>${data.docs.summary || data.description}</p>
            ${paramsHtml}
            <h3>📎 Contoh Request</h3>
            <pre>${data.docs.example}</pre>
            <h3>📦 Contoh Respons</h3>
            <pre>${data.docs.response}</pre>
        `;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Tutup modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Fungsi pencarian dengan loading
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        // Tampilkan loading, sembunyikan cards
        loadingSpinner.classList.add('show');
        container.style.display = 'none';

        // Simulasi loading (bisa diganti dengan setTimeout untuk efek)
        setTimeout(() => {
            let filtered = allData;
            if (query !== '') {
                filtered = allData.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.endpoint.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );
            }
            // Render ulang dengan hasil filter
            renderCards(filtered);
            // Sembunyikan loading, tampilkan cards
            loadingSpinner.classList.remove('show');
            container.style.display = 'grid';
        }, 500); // loading 0.5 detik
    }

    // Event listener
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Render awal semua data
    renderCards(allData);

    // Inisialisasi particles (dari script.js)
    if (typeof particleground === 'function') {
        particleground(document.getElementById('particles'), {
            dotColor: '#ffb6c1',
            lineColor: '#ff69b4',
            density: 12000
        });
    }
});