const creators = [
    { name: 'Wemmbu', id: 'UCkzzNLnuM-VsATWC53ehwOQ' },
    { name: 'Parrot', id: 'UC_7P5TEn_9S_pXpL-pY_gQA' },
    { name: 'Spoke', id: 'UCl5W96vYqN8N_O1M8O8M8Og' },
    { name: 'FlameFrags', id: 'UCn765mXW8S8_qQ6S8u8k7uQ' }
];

let allVideos = [];

async function loadVideos() {
    const grid = document.getElementById('video-grid');
    
    // Fetch all creators at the same time for speed
    const requests = creators.map(c => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${c.id}`)}`)
        .then(res => res.json())
        .then(data => {
            if(data.items) {
                return data.items.map(item => ({
                    title: item.title,
                    creator: c.name,
                    thumb: item.thumbnail,
                    id: item.link.split('v=')[1]
                }));
            }
            return [];
        })
    );

    const results = await Promise.all(requests);
    allVideos = results.flat();
    render('all');
}

function render(filter) {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '';
    const list = (filter === 'all') ? allVideos : allVideos.filter(v => v.creator === filter);

    list.forEach(video => {
        grid.innerHTML += `
            <div class="poster-card" onclick="openVideo('${video.id}')">
                <img src="${video.thumb}" loading="lazy">
                <div class="video-info">
                    <p class="creator-tag">${video.creator}</p>
                    <p class="video-title">${video.title}</p>
                </div>
            </div>`;
    });
}

function openVideo(id) {
    const overlay = document.getElementById('theater-mode');
    const player = document.getElementById('theater-player');
    overlay.style.display = 'block';
    player.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

function closeTheater() {
    document.getElementById('theater-mode').style.display = 'none';
    document.getElementById('theater-player').src = '';
}

function filterBy(name, event) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    render(name);
}

window.onload = loadVideos;
