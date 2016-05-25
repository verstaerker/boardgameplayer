/**
 * Copyright © by Verstärker, Patric Eberle <line-in@derverstaerker.ch>
 */

$(function () {
    var SELECTOR_ATMOSPHERE_OBJ = '#atmosphere-object';
    var SELECTOR_ATMOSPHERE_PLAYER = '#atmosphere-player';
    var SELECTOR_MUSIC_OBJ = '#music-object';
    var SELECTOR_MUSIC_PLAYER = '#music-player';
    var SELECTOR_OBJ = '.jp';
    var SELECTOR_NAVIGATION = '.bgap-navigation';
    var SELECTOR_PLAY_BUTTON = '.bgap-navigation__play';
    var CLASS_PLAYING = 'bgap-navigation__play--playing';
    var swfPath = '../lib/jplayer/dist/jplayer';
    var playlist = {};
    var disableMusic = false;
    var startMusic = false;

    function getPlaylist(player) {
        var id = player.attr('id');

        return playlist['#' + id];
    }

    function canplay(e) {
        var player = $(this);
        var jPlayerPlaylist = getPlaylist(player);
        var status = e.jPlayer.status;
        var media = status.media;

        console.log("e", e);

        // Delay track if defined so and track did not already start
        if (!status.currentTime && !status.waitForPlay && media.delay) {
            jPlayerPlaylist.pause();

            setTimeout(function () {
                jPlayerPlaylist.play();
            }, media.delay);
        }
    }

    function onAtmospherePlay(e) {
        var media = e.jPlayer.status.media;

        console.info('on atmosphere play', !!media.disableMusic);

        disableMusic = !!media.disableMusic;
    }

    function play(media, canBeDisabled) {
        var player = $(this);
        var jPlayerPlaylist = getPlaylist(player);

        console.log("play", canBeDisabled, disableMusic);

        if (canBeDisabled && disableMusic) {
            jPlayerPlaylist.pause();

            startMusic = true;
        }

    }

    function onAtmosphereEnded(e) {
        var player = $(this);
        var otherPlayer = $(SELECTOR_OBJ).not(player);
        var otherJPlayerPlaylist = getPlaylist(otherPlayer);
        var media = e.jPlayer.status.media;

        // Reset paused music and start it if flag is set
        if (media.disableMusic) {
            disableMusic = false;

            if (startMusic) {
                otherJPlayerPlaylist.play();

                startMusic = false;
            }
        }
    }

    function onAtmospherePause(e) {
        var media = e.jPlayer.status.media;

        // Reset pause
        if (media.disableMusic) {
            disableMusic = false;
        }
    }

    function createPlaylist(playerObj, playerEl, options) {
        playlist[playerObj] = new jPlayerPlaylist({
                jPlayer: playerObj,
                cssSelectorAncestor: playerEl
            }, options.tracks, options);
    }

    function createPlayer(playerObj, playerEl, customSettings) {
        var settings = {
            supplied: 'mp3',
            wmode: 'window',
            swfPath: swfPath,
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            loop: true,
            canplay: canplay
        };

        $.extend(settings, customSettings);

        createPlaylist(playerObj, playerEl, settings);
    }

    function playAll() {
        $.each(playlist, function(key, data) {
            data.play();
        });

        $(SELECTOR_PLAY_BUTTON).addClass(CLASS_PLAYING);
    }

    function pauseAll() {
        $.each(playlist, function(key, data) {
            data.pause();
        });

        $(SELECTOR_PLAY_BUTTON).removeClass(CLASS_PLAYING);
    }

    function createNavigation() {
        var $navigation = $(SELECTOR_NAVIGATION);

        $navigation.on('click', SELECTOR_PLAY_BUTTON, function() {
            var $button = $(this);

            if ($button.hasClass(CLASS_PLAYING)) {
                pauseAll();
            } else {
                playAll();
            }
        });
    }

    createPlayer(SELECTOR_ATMOSPHERE_OBJ, SELECTOR_ATMOSPHERE_PLAYER, {
        cssSelectorAncestor: SELECTOR_ATMOSPHERE_PLAYER,
        play: onAtmospherePlay,
        ended: onAtmosphereEnded,
        pause: onAtmospherePause,
        tracks: [
            {
                disableMusic: true,
                title: 'Crow 1',
                // artist: 'The Stark Palace',
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/sampler/black-crows.mp3',
                // pauseOther: true
            },{
                title: 'Crow 2',
                // artist: 'The Stark Palace',
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/sampler/black-crows.mp3',
                // pauseOther: true
            }
        ]
    });

    createPlayer(SELECTOR_MUSIC_OBJ, SELECTOR_MUSIC_PLAYER, {
        cssSelectorAncestor: SELECTOR_MUSIC_PLAYER,
        play: function (e) {
            play.call(this, e.jPlayer.status.media, true);
        },
        tracks: [
            {
                title: 'Anvengers',
                // artist: 'The Stark Palace',
                delay: 5000,
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/music/® Avengers, The Score - 19 - Alan Silvestri - The Avengers.mp3',
            }, {
                title: 'Casino Royale',
                artist: 'Unknown',
                delay: 3000,
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/music/® Casino Royale [Disc 1] - 02 - Chris Cornell - You Know My Name.mp3'
            }
        ]
    });

    createNavigation();
});
