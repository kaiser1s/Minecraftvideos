function onYouTubeIframeAPIReady() {
    player = new YT.Player('hero-player', {
        videoId: 'VIDEO_ID', // Replace with an Unstable SMP video ID
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'mute': 1,
            'loop': 1,
            'playlist': 'VIDEO_ID'
        },
        events: {
            'onStateChange': function(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    // Start the 5s countdown for the cinematic disclaimer
                    setTimeout(() => {
                        document.getElementById('hero-overlay').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('hero-overlay').style.display = 'none';
                        }, 1000);
                    }, 5000);
                }
            }
        }
    });
}

function playHeroVideo() {
    player.unMute();
    player.playVideo();
    // This allows the user to trigger the audio and "enter" the movie
}
