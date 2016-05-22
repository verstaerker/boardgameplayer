/**
 * Copyright © by Verstärker, Patric Eberle <line-in@derverstaerker.ch>
 */

$(function() {
    var SELECTOR_ATMOSPHERE = '#atmosphere-object';
    var SELECTOR_MUSIC = '#music-object';
    var swfPath = '../lib/jplayer/dist/jplayer';

    function createAtmospherePlayer() {
        $(SELECTOR_ATMOSPHERE).jPlayer({
            ready: function () {
                $(this).jPlayer('setMedia', {
                    title: 'Bubble',
                    mp3: 'http://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3'
                });
            },
            swfPath: 'swfPath',
            supplied: 'mp3',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            cssSelectorAncestor: '#atmosphere-player'
        });
    }
    
    function createMusicPlayer() {
        $(SELECTOR_MUSIC).jPlayer({
            cssSelectorAncestor: '#atmosphere-player'
        });
    }
    
    createAtmospherePlayer();
    createMusicPlayer();
});
