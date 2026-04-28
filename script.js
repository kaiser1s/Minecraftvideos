const creators = [
    { name: 'Wemmbu', id: 'UCkzzNLnuM-VsATWC53ehwOQ' },
    { name: 'Parrot', id: 'UC_7P5TEn_9S_pXpL-pY_gQA' },
    { name: 'Spoke', id: 'UCl5W96vYqN8N_O1M8O8M8Og' },
    { name: 'FlameFrags', id: 'UCn765mXW8S8_qQ6S8u8k7uQ' }
];

let allVideos = [];

async function init() {
    const grid = document.getElementById('video-grid');
    
    for (const creator of creators) {
        // Fetching from YouTube RSS via a free JSON converter
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${creator.id}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items) {
                data.items.forEach(item => {
                    allVideos.push({
                        title: item.title,
                        creator: creator.name,
                        thumb: item.thumbnail,
                        id: item.link.split('v=')[1]
                    });
                });
            }
        } catch (err) {
            console.error("Error loading " + creator.name);
        }
    }
    
    // Sort videos by date (approximate based on order)
    render('all');
}

function render(filter) {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '';

    const list = (filter === 'all') ? allVideos : allVideos.filter(v => v.creator === filter);

    list.forEach(video => {
        const card = `
            <div class="poster-card" onclick="playVideo('${video.id}', '${video.creator}')">
                <img src="${video.thumb}" alt="thumbnail">
                <div class="video-info">
                    <p class="creator-tag">${video.creator}</p>
                    <p class="video-title">${video.title}</p>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function playVideo(id, creator) {
    const overlay = document.getElementById('theater-mode');
    const player = document.getElementById('theater-player');
    const disclaimer = document.getElementById('theater-disclaimer');
    
    document.getElementById('current-creator').innerText = creator;
    
    overlay.style.display = 'block';
    player.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&showinfo=0`;

    // Handle 5-second disclaimer
    disclaimer.style.display = 'flex';
    disclaimer.style.opacity = '1';

    setTimeout(() => {
        disclaimer.style.opacity = '0';
        setTimeout(() => {
            disclaimer.style.display = 'none';
        }, 800);
    }, 5000);
}

function closeTheater() {
    document.getElementById('theater-mode').style.display = 'none';
    document.getElementById('theater-player').src = ''; // Kill the audio
}

function filterBy(name, event) {
    // Update active UI
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    render(name);
}

// Start everything
init();
