const creators = [
    { name: 'Wemmbu', id: 'UCkzzNLnuM-VsATWC53ehwOQ' },
    { name: 'Parrot', id: 'UC_7P5TEn_9S_pXpL-pY_gQA' },
    { name: 'Spoke', id: 'UCl5W96vYqN8N_O1M8O8M8Og' },
    { name: 'FlameFrags', id: 'UCn765mXW8S8_qQ6S8u8k7uQ' }
];

async function loadVideos() {
    const container = document.querySelector('.posters-container');
    container.innerHTML = ''; // Clear loading

    for (const creator of creators) {
        // We use rss2json (a free service) to read the YouTube RSS feed
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${creator.id}`;
        const fetchUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        try {
            const response = await fetch(fetchUrl);
            const data = await response.json();
            const latestVideo = data.items[0]; // Get the very latest video

            if (latestVideo) {
                // Extract the Video ID from the link
                const videoId = latestVideo.link.split('v=')[1];
                const thumbnail = latestVideo.thumbnail;

                container.innerHTML += `
                    <div class="poster-card" onclick="playMovie('${videoId}', '${creator.name}')">
                        <img src="${thumbnail}" alt="${latestVideo.title}">
                        <div class="video-info">
                            <p class="channel-name">${creator.name}</p>
                            <p class="video-title">${latestVideo.title}</p>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Failed to load " + creator.name);
        }
    }
}

function playMovie(id, name) {
    // 1. Update the Disclaimer
    document.getElementById('hero-creator').innerText = name;
    document.getElementById('hero-overlay').style.display = 'flex';
    document.getElementById('hero-overlay').style.opacity = '1';

    // 2. Load the Video into the Hero Player
    const player = document.getElementById('hero-player');
    player.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

    // 3. Auto-hide disclaimer after 5 seconds
    setTimeout(() => {
        document.getElementById('hero-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('hero-overlay').style.display = 'none';
        }, 1000);
    }, 5000);
}

window.onload = loadVideos;
