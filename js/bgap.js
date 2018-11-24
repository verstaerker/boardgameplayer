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
  var SELECTOR_TITLE = '.bgap-navigation__title';
  var SELECTOR_PLAYLIST = '.bgap-navigation__playlist-selector';
  var SELECTOR_WALLPAPER = '.bgap-wallpaper';
  var CLASS_PLAYING = 'bgap-navigation__play--playing';
  var PATH_WALLPAPER = 'img/wallpapers/';
  var swfPath = '../lib/jplayer/dist/jplayer';
  var playlistPlayer = {};
  var disableMusic = false;
  var startMusic = false;

  function getPlaylist(player) {
    var id = player.attr('id');

    return playlistPlayer['#' + id];
  }

  function onCanplay(e) {
    var player = $(this);
    var jPlayerPlaylist = getPlaylist(player);
    var status = e.jPlayer.status;
    var media = status.media;

    // Delay track if defined so and track did not already start
    if (!status.currentTime && !status.waitForPlay && media.delay) {
      jPlayerPlaylist.pause();

      setTimeout(function () {
        jPlayerPlaylist.play();
      }, media.delay * 1000 * 60);
    }
  }

  function onAtmospherePlay(e) {
    var player = $(this);
    var otherPlayer = $(SELECTOR_OBJ).not(player);
    var otherJPlayerPlaylist = getPlaylist(otherPlayer);
    var media = e.jPlayer.status.media;

    disableMusic = !!media.disableMusic;

    if (!disableMusic && startMusic) {
      otherJPlayerPlaylist.play();

      startMusic = false;
    }
  }

  function play(canBeDisabled) {
    var $player = $(this);
    var jPlayerPlaylist = getPlaylist($player);

    if (canBeDisabled && disableMusic) {
      jPlayerPlaylist.pause();

      startMusic = true;
    }
  }

  function onAtmosphereEnded(e) {
    var media = e.jPlayer.status.media;

    // Enable Music
    disableMusic = !media.disableMusic;
  }

  function onAtmospherePause(e) {
    var media = e.jPlayer.status.media;

    // Enable Music
    disableMusic = !media.disableMusic;

  }

  function createPlaylist(playerObj, playerEl, options) {
    playlistPlayer[playerObj] = new jPlayerPlaylist({
      jPlayer: playerObj,
      cssSelectorAncestor: playerEl
    }, options.tracks, options);
  }

  function createPlayer(playerObj, playerEl, customSettings) {
    var settings = {
      supplied: 'mp3, m4a',
      wmode: 'window',
      swfPath: swfPath,
      useStateClassSkin: true,
      autoBlur: false,
      smoothPlayBar: true,
      remainingDuration: true,
      toggleDuration: true,
      noVolume: false,
      volume: 1,
      canplay: onCanplay
    };

    $.extend(settings, customSettings);

    createPlaylist(playerObj, playerEl, settings);
  }

  function togglePlayButton(enable) {
    var $playButton = $(SELECTOR_PLAY_BUTTON);

    $playButton
      .toggleClass(CLASS_PLAYING + ' btn-danger', enable !== true)
      .addClass('btn-primary')
      .text(enable ? 'Play' : 'Pause');
  }

  function togglePlayAll(play) {
    $.each(playlistPlayer, function (key, data) {
      if (play) {
        // TODO: Does not start music after pausing all
        data.play();
      } else {
        data.pause();
      }
    });

    togglePlayButton(!play);
  }

  function createNavigation() {
    var $navigation = $(SELECTOR_NAVIGATION);

    $navigation.on('click', SELECTOR_PLAY_BUTTON, function () {
      var $button = $(this);

      togglePlayAll(!$button.hasClass(CLASS_PLAYING));
    });
  }

  function updatePlayer(playlist) {
    var music = playlist.music;
    var atmosphere = playlist.atmosphere;

    playlistPlayer[SELECTOR_MUSIC_OBJ].setPlaylist(music);
    playlistPlayer[SELECTOR_ATMOSPHERE_OBJ].setPlaylist(atmosphere);

    togglePlayButton(true);
  }

  function setWallpaper(fileName) {
    var $wallpaper = $(SELECTOR_WALLPAPER);

    $wallpaper.css('background-image', 'url(' + PATH_WALLPAPER + fileName + ')');
  }

  function buildPlayerSelect() {
    var $selectOptions = $();
    var $title = $(SELECTOR_TITLE);
    var $select = $(SELECTOR_PLAYLIST);
    var $option;

    $option = $('<option />')
      .text('-')
      .attr('value', '');

    $selectOptions = $selectOptions
      .add($option);

    $.each(playlists, function (key, value) {
      $option = $('<option />')
        .text(value.title)
        .attr('value', key);

      $selectOptions = $selectOptions
        .add($option);
    });

    $select
      .append($selectOptions)
      .val('')
      .on('change', function (e) {
        var id = $(this).val();
        var playlist = playlists[id];

        $title.text(playlist.title);
        updatePlayer(playlist);
        setWallpaper(playlist.wallpaper);
      });
  }

  // Create atmosphere player
  createPlayer(SELECTOR_ATMOSPHERE_OBJ, SELECTOR_ATMOSPHERE_PLAYER, {
    cssSelectorAncestor: SELECTOR_ATMOSPHERE_PLAYER,
    play: onAtmospherePlay,
    ended: onAtmosphereEnded,
    pause: onAtmospherePause,
    tracks: [/* use playlists.js */]
  });

  // Create music player
  createPlayer(SELECTOR_MUSIC_OBJ, SELECTOR_MUSIC_PLAYER, {
    cssSelectorAncestor: SELECTOR_MUSIC_PLAYER,
    volume: 0.6,
    play: function (e) {
      play.call(this, true);
    },
    tracks: [/* use playlists.js */]
  });

  createNavigation();
  buildPlayerSelect();
});
