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
        var player = $(this);
        var otherPlayer = $(SELECTOR_OBJ).not(player);
        var otherJPlayerPlaylist = getPlaylist(otherPlayer);
        var media = e.jPlayer.status.media;

        console.info('on atmosphere play', !!media.disableMusic);

        disableMusic = !!media.disableMusic;

        if (!disableMusic && startMusic) {
            otherJPlayerPlaylist.play();

            startMusic = false;
        }
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
        var media = e.jPlayer.status.media;

        // Reset paused music
        if (media.disableMusic) {
            disableMusic = false;
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
            remainingDuration: true,
            toggleDuration: true,
            noVolume: false,
            // loop: true,
            canplay: canplay
        };

        $.extend(settings, customSettings);

        createPlaylist(playerObj, playerEl, settings);
    }

    function playAll() {
        $.each(playlist, function(key, data) {
            data.play();
        });

        $(SELECTOR_PLAY_BUTTON)
            .addClass(CLASS_PLAYING + ' btn-danger')
            .addClass('btn-danger')
            .text('Pause');
    }

    function pauseAll() {
        $.each(playlist, function(key, data) {
            data.pause();
        });

        $(SELECTOR_PLAY_BUTTON)
            .removeClass(CLASS_PLAYING + ' btn-danger')
            .addClass('btn-primary')
            .text('Play');
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
                title: 'Welcome',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/voy_engineering.mp3',
                disableMusic: true
            },{
                title: 'Door',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/aliendoor03.mp3',
                disableMusic: true
            },{
                title: 'The Time Machine 1',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/voy_relativity_bridge.mp3',
                disableMusic: false
            },{
                title: 'The Time Machine 2',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/tos_lab_4.mp3',
                disableMusic: false
            },{
                title: 'The Time Machine 3',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/voy_bridge.mp3',
                disableMusic: true
            },{
                title: '1992',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/43_Dome_City_Center.mp3',
                disableMusic: false
            },{
                title: 'Sirenes',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/SIREN WAIL UP AND PAST.mp3',
                disableMusic: false
            },{
                title: 'The City 1',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/94_Noir_Procedural.mp3',
                disableMusic: true
            },{
                title: 'Crows',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/Detunized_Urban-Crows_13.mp3',
                disableMusic: false
            },{
                title: 'The City 2',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/MARKET_CITY_MORNING_GERMAN_PEOPLE_03.mp3',
                disableMusic: false
            },{
                title: 'Subway',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/Europe_England_UK_City_London_Tube_Underground Station Platform_Train Leaving_Commuter Walla_Announcements_Footsteps_HutchSFX.mp3',
                disableMusic: false
            },{
                title: 'Something in the dark 1',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/74_Zombies!.mp3',
                disableMusic: false
            },{
                title: 'The City 3',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/32_City_and_the_City.mp3',
                disableMusic: true
            },{
                title: 'Something in the dark 2',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/86_Dark_City.mp3',
                disableMusic: true
            },{
                title: 'More Crows',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/Detunized_Urban-Crows_19.mp3',
                disableMusic: false
            },{
                title: 'Park',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/AMB INT of EXT Park Slope Day 01.mp3',
                disableMusic: true
            },{
                title: 'Something in the dark 3',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/85_Sewers.mp3',
                disableMusic: false
            },{
                title: 'Rain',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/60_Dark_and_Stormy.mp3',
                disableMusic: true
            },{
                title: 'Labs',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/28_Nephilim_Labs_FE.mp3',
                disableMusic: false
            },{
                title: 'Warehouse 1',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/52_Warehouse_13.mp3',
                disableMusic: true
            },{
                title: 'Shadows 1',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/39_Temple_of_the_Eye.mp3',
                disableMusic: false
            },{
                title: 'Shadows 2',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/10_In_The_Shadows.mp3',
                disableMusic: false
            },{
                title: 'More Rain',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/40_The_Long_Rain.mp3',
                disableMusic: true
            },{
                title: 'Something in the dark 4',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/74_Zombies!.mp3',
                disableMusic: false
            },{
                title: 'Warehouse 2',
                mp3: 'http://bgap.elfenbeinturm.ch/music/ambiente/52_Warehouse_13.mp3',
                disableMusic: true
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
                title: 'T.I.M.E',
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/01-john_paesano-main_title-tsx.mp3',
                delay: 2 * 1000
            },{
                title: 'The Order',
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/® The Space Between Us - 05 - Craig Armstrong - Laura\'s theme.mp3',
                delay: 10 * 1000
            },{
                title: '1992',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/® Greatest Hits - 14 - The Cure - Friday I\'m Love.mp3'
            },{
                title: 'Finding the way',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/08-john_paesano-ben_urich-tsx.mp3'
            },{
                title: 'Time',
                delay: 3000,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/® Inception - 12 - Hans Zimmer - Time.mp3'
            },{
                title: 'Marcy',
                delay: 3000,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/® Dizzy Up The Girl - 11 - Goo Goo Dolls - Iris.mp3'
            },{
                title: 'Halo',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/Violator - 04 - Depeche Mode - Halo.mp3'
            },{
                title: 'Secrets 1',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/05-john_paesano-union_allied-tsx.mp3'
            },{
                title: 'Hope?',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/Jurassic Park - 02 - John Williams - Theme From Jurassic Park.mp3'
            },{
                title: 'Secrets 2',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/10-john_paesano-wilson_fisk-tsx.mp3'
            },{
                title: 'Under Water',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/® Flying Away - 01 - Smoke City - Underwater Love.mp3'
            },{
                title: 'Gotta Have More Love',
                delay: 3 * 1000 * 60,
                mp3: 'http://bgap.elfenbeinturm.ch/music/music/Climax - Gotta Have More Love.mp3'
            }
        ]
    });

    createNavigation();
});
