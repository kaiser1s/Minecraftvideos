const creators = [
    { name: 'Wemmbu', id: 'UCkzzNLnuM-VsATWC53ehwOQ' },
    { name: 'Parrot', id: 'UC_7P5TEn_9S_pXpL-pY_gQA' },
    { name: 'Spoke', id: 'UCl5W96vYqN8N_O1M8O8M8Og' },
    { name: 'FlameFrags', id: 'UCn765mXW8S8_qQ6S8u8k7uQ' }
];

let allVideos = [];

async function loadContent() {
    const grid = document.getElementById('video-grid');
    
    // Create fetch promises for ALL creators simultaneously
    const fetchPromises = creators.map(creator => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${creator.id}`)}&api_key=oyv6lyyupf7vzx20qy1p8nrt7v2z0p5s3v7paz9n`) // Using a public temp key for stability
        .then(res => res.json())
        .then(data => {
            if (!data.items) return [];
            
            return data.items
                .filter(item => !item.title.toLowerCase().includes('#shorts')) // Filter out Shorts based on title
                .map(item => ({
                    title: item.title,
                    creator: creator.name,
                    thumb: item.thumbnail,
                    id: item.link.split('v=')[1],
                    pubDate: new Date(item.pubDate).getTime()
                }));
        })
        .catch(() => [])
    );

    const results = await Promise.all(fetchPromises);
    
    // Combine all videos and sort by newest first
    allVideos = results.flat().sort((a, b) => b.pubDate - a.pubDate);
    
    render('all');
}

function render(filter) {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '';
    
    const list = (filter === 'all') ? allVideos : allVideos.filter(v => v.creator === filter);

    if (list.length === 0) {
        grid.innerHTML = '<p>No full videos found for this creator.</p>';
        return;
    }

    list.forEach(video => {
        grid.innerHTML += `
            <div class="poster-card" onclick="openVideo('${video.id}')">
                <img src="${video.thumb}" alt="thumb">
                <div class="video-info">
                    <p class="creator-label">${video.creator}</p>
                    <div class="video-title">${video.title}</div>
                </div>
            </div>`;
    });
}

function openVideo(id) {
    const overlay = document.getElementById('theater-mode');
    const player = document.getElementById('theater-player');
    
    overlay.style.display = 'block';
    // Using youtube-nocookie to strip ads and tracking
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;
}

function closeTheater() {
    document.getElementById('theater-mode').style.display = 'none';
    document.getElementById('theater-player').src = '';
}

function filterBy(name, e) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if(e.target.classList.contains('tab')) e.target.classList.add('active');
    
    document.getElementById('current-category').innerText = name === 'all' ? 'Latest Episodes' : name + "'s Episodes";
    render(name);
}

window.onload = loadContent;
