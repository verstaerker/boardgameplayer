/**
 * Copyright © by Verstärker, Patric Eberle <line-in@derverstaerker.ch>
 */

$(function () {
    var SELECTOR_ATMOSPHERE_OBJ = '#atmosphere-object';
    var SELECTOR_ATMOSPHERE_PLAYER = '#atmosphere-player';
    var SELECTOR_MUSIC_OBJ = '#music-object';
    var SELECTOR_MUSIC_PLAYER = '#music-player';
    var SELECTOR_OBJ = '.jp';
    var PAUSE_OTHER_DELAY = 5000;
    var swfPath = '../lib/jplayer/dist/jplayer';
    var playlist = {};

    function getPlaylist(player) {
        var id = player.attr('id');

        return playlist['#' + id];
    }

    function canplay(e) {
        var player = $(this);
        var jPlayerPlaylist = getPlaylist(player);
        var media = e.jPlayer.status.media;

        // Delay track if defined so
        if (media.delay) {
            jPlayerPlaylist.pause();

            setTimeout(function () {
                jPlayerPlaylist.play();
            }, media.delay);
        }
    }

    function play(e) {
        var player = $(this);
        var otherPlayer = $(SELECTOR_OBJ).not(player);
        var media = e.jPlayer.status.media;

        if (media.pauseOther) {
            // TODO: Only if playing, remove timeouts
            otherPlayer
                .jPlayerFade()
                .out(PAUSE_OTHER_DELAY, null, 0, function() {
                    getPlaylist(otherPlayer).pause();
                });
        }

    }

    function createPlaylist(playerObj, playerEl, options) {
        playlist[playerObj] = new jPlayerPlaylist({
                jPlayer: playerObj,
                cssSelectorAncestor: playerEl
            }, options.tracks,
            {
                swfPath: swfPath,
                supplied: 'webmv, ogv, m4v, oga, mp3',
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true
            });
    }

    function createPlayer(playerObj, playerEl, customSettings) {
        var settings = {
            supplied: 'mp3',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            canplay: canplay,
            play: play
        };

        $.extend(settings, customSettings);

        $(playerObj).jPlayer(settings);

        createPlaylist(playerObj, playerEl, customSettings);
    }

    createPlayer(SELECTOR_MUSIC_OBJ, SELECTOR_MUSIC_PLAYER, {
        cssSelectorAncestor: SELECTOR_MUSIC_PLAYER,
        tracks: [
            {
                title: 'Anvengers',
                // artist: 'The Stark Palace',
                delay: 5000,
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/music/® Avengers, The Score - 19 - Alan Silvestri - The Avengers.mp3',
                pauseOther: true
            }, {
                title: 'Casino Royale',
                artist: 'Unknown',
                delay: 3000,
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/music/® Casino Royale [Disc 1] - 02 - Chris Cornell - You Know My Name.mp3'
            }
        ]
    });

    createPlayer(SELECTOR_ATMOSPHERE_OBJ, SELECTOR_ATMOSPHERE_PLAYER, {
        cssSelectorAncestor: SELECTOR_ATMOSPHERE_PLAYER,
        tracks: [
            {
                title: 'Dome City Centre',
                // artist: 'The Stark Palace',
                mp3: '/Users/Shared/Projekte/boardgameplayer/music/ambiente/43_Dome_City_Center.mp3',
                // pauseOther: true
            }
        ]
    });
});
