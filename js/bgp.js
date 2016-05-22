/**
 * Copyright © by Verstärker, Patric Eberle <line-in@derverstaerker.ch>
 */

$(function () {
    var SELECTOR_ATMOSPHERE_OBJ = '#atmosphere-object';
    var SELECTOR_ATMOSPHERE_PLAYER = '#atmosphere-player';
    var SELECTOR_MUSIC_OBJ = '#music-object';
    var swfPath = '../lib/jplayer/dist/jplayer';

    function createPlaylist(playlist, player, options) {
        var myPlaylist = new jPlayerPlaylist({
            jPlayer: player,
            cssSelectorAncestor: playlist
        }, [
            {
                title: 'Cro Magnon Man',
                artist: 'The Stark Palace',
                mp3: 'http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3',
                oga: 'http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg'
            }, {
                title: 'Lismore',
                artist: 'Unknown',
                mp3: 'http://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3'
            }
        ], {
            playlistOptions: {
                enableRemoveControls: true
            },
            swfPath: '../lib/jplayer/jplayer',
            supplied: 'webmv, ogv, m4v, oga, mp3',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            audioFullScreen: true
        });
    }

    function createPlayer(player, playlist, options) {
        $(player).jPlayer(options);

        createPlaylist(playlist, player, options);
    }

    function createAdtmospherePlaylist() {

    }

    function createMusicPlayer() {
        $(SELECTOR_MUSIC_OBJ).jPlayer({
            cssSelectorAncestor: '#atmosphere-player'
        });
    }

    createPlayer(SELECTOR_ATMOSPHERE_OBJ, SELECTOR_ATMOSPHERE_PLAYER, {
        supplied: 'mp3',
        wmode: 'window',
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        cssSelectorAncestor: SELECTOR_ATMOSPHERE_PLAYER
    });
    createMusicPlayer();
});
