const creators = [
    { name: 'Wemmbu', id: 'UCkzzNLnuM-VsATWC53ehwOQ' },
    { name: 'Parrot', id: 'UC_7P5TEn_9S_pXpL-pY_gQA' },
    { name: 'Spoke', id: 'UCl5W96vYqN8N_O1M8O8M8Og' },
    { name: 'FlameFrags', id: 'UCn765mXW8S8_qQ6S8u8k7uQ' }
];

let allVideos = [];

async function loadContent() {
    const promises = creators.map(c => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${c.id}`)}`)
        .then(res => res.json())
        .then(data => {
            return (data.items || []).map(item => ({
                title: item.title,
                creator: c.name,
                thumb: item.thumbnail,
                id: item.link.split('v=')[1]
            }));
        })
    );

    const results = await Promise.all(promises);
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
                <img src="${video.thumb}">
                <div class="video-title">${video.title}</div>
            </div>`;
    });
}

function openVideo(id) {
    document.getElementById('theater-mode').style.display = 'block';
    document.getElementById('theater-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
}

function closeTheater() {
    document.getElementById('theater-mode').style.display = 'none';
    document.getElementById('theater-player').src = '';
}

function filterBy(name, e) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if(e.target.classList.contains('tab')) e.target.classList.add('active');
    render(name);
}

window.onload = loadContent;
