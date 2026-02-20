// api/brat.js
document.addEventListener('DOMContentLoaded', function() {
    const endpoints = [
        {
            method: 'GET',
            endpoint: '/bratgambar',
            title: 'Brat Gambar Generator',
            desc: 'Buat gambar teks bergaya brat. Parameter <code>text</code> wajib.',
            test: true,
            docs: {
                summary: 'Menghasilkan gambar PNG dengan teks di tengah.',
                params: [{ name: 'text', type: 'string', required: true, desc: 'Teks yang akan digambar.' }],
                example: '/bratgambar?text=Halo%20Dunia',
                response: 'Gambar PNG.'
            }
        },
        {
            method: 'GET',
            endpoint: '/bratv2',
            title: 'Brat V2 (Warna)',
            desc: 'Versi berwarna dengan parameter <code>text</code> dan <code>color</code>.',
            test: false,
            docs: {
                summary: 'Brat dengan latar gradien dan teks berwarna.',
                params: [
                    { name: 'text', type: 'string', required: true, desc: 'Teks.' },
                    { name: 'color', type: 'string', required: false, desc: 'Warna teks (nama atau hex).' }
                ],
                example: '/bratv2?text=Halo&color=red',
                response: 'Gambar PNG berwarna.'
            }
        }
    ];

    const container = document.getElementById('cardContainer');
    container.innerHTML = endpoints.map(e => `
        <div class="brat-card">
            <div class="card-header">
                <span class="method">${e.method}</span>
                <span class="endpoint">${e.endpoint}</span>
            </div>
            <div class="card-body">
                <h3>${e.title}</h3>
                <p>${e.desc}</p>
            </div>
            <div class="card-footer">
                <button class="btn-docs" data-docs='${JSON.stringify(e)}'><i class="fas fa-book"></i> Dokumentasi</button>
                ${e.test ? 
                    '<button class="btn-test test-brat"><i class="fas fa-paper-plane"></i> TEST ENDPOINT →</button>' : 
                    '<button class="btn-test" disabled><i class="fas fa-clock"></i> Coming Soon</button>'}
            </div>
        </div>
    `).join('');

    // Modal
    const modal = document.getElementById('docsModal');
    const closeBtn = document.getElementById('closeModalBtn');
    document.querySelectorAll('.btn-docs').forEach(btn => {
        btn.addEventListener('click', function() {
            const data = JSON.parse(this.dataset.docs);
            document.getElementById('modalTitle').innerText = data.title;
            let paramsHtml = '';
            if (data.docs.params) {
                paramsHtml = '<h4>Parameter</h4><ul>';
                data.docs.params.forEach(p => {
                    paramsHtml += `<li><code>${p.name}</code> (${p.type}) ${p.required ? '<span style="color:#ff69b4;">wajib</span>' : ''}: ${p.desc}</li>`;
                });
                paramsHtml += '</ul>';
            }
            document.getElementById('modalBody').innerHTML = `
                <p>${data.docs.summary}</p>
                ${paramsHtml}
                <h4>Contoh Request</h4><pre>${data.docs.example}</pre>
                <h4>Contoh Respons</h4><pre>${data.docs.response}</pre>
            `;
            modal.classList.add('show');
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    // Tombol test
    document.querySelectorAll('.test-brat').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = prompt('Masukkan teks:', 'Halo KEI');
            if (text) {
                const baseUrl = window.CONFIG?.API_BASE_URL || 'http://localhost:3000';
                window.open(baseUrl + '/bratgambar?text=' + encodeURIComponent(text), '_blank');
            }
        });
    });
});