(function () {

	document.addEventListener('DOMContentLoaded', function (event) {

		var wrap = document.getElementById('wrap');
		var lyricsSlide = document.getElementById('lyrics-slide');
		var lyricsWrap = document.getElementById('lyrics');
		var lyricList = document.getElementById('lyric-list');
		var selectArea = document.getElementById('select-area');
		var shareBox = document.getElementById('share');
		var shareFold = document.getElementById('share-fold');


		// 自动根据窗口大小调整wrap的高度

		var autoSize = function (event) {

			wrap.style.height = window.innerHeight + 'px';
		};

		window.addEventListener('resize', autoSize);
		autoSize();


		// 歌词框控制

		var lyricsBox = new LyricsBox(lyricsWrap, lyricsSlide,lyricList, selectArea, function (event) {

			console.log(event.content);

			setTimeout(function () {

				shareBox.classList.remove('hidden');

			}, 500);
		});

		shareFold.addEventListener('click', function (event) {

			event.preventDefault();

			lyricsBox.cancelSelect();

			shareBox.classList.add('hidden');
		});


		// Ajax测试
		
		function requestLyrics(fmInfo, callback) {

			Ajax.post({

				url: '/',
				data: fmInfo,
				responseType: 'json',

				onsuccess: function (event) {

					if (callback) callback(event.response);
				},

				onerror: function (event) {

					if (callback) callback(null);
				}
			});
		}

		window.addEventListener('message', function (event) {

			var message = {};

			try {

				message = JSON.parse(event.data);

			} catch (err) {

				message = {};
			}

			var fmInfo = {
				songId: message.id,
				artist: message.artist,
				title: message.song_name,
				album: message.album,
				albumImgUrl: message.cover,
				startTime: message.timestamp,
				channel: message.channel,
				shareUrl: message.url
			};

			console.log(fmInfo);
			requestLyrics(fmInfo, function (fullInfo) {

				lyricsBox.clear();

				if (fullInfo) {

					console.log(fullInfo);

					var lyrics = fullInfo.lyricsInfo.lyrics || [];

					lyrics.sort(function (item1, item2) {

						return item1.time - item2.time;
					});

					lyricsBox.overallOffset = 0;
					lyricsBox.setStartTime(parseInt(fullInfo.lyricsInfo.startTime));

					lyrics.forEach(function (item) {

						lyricsBox.append(item);
					});
				}

				lyricsBox.update();

				lyricsBox.scrollTo(0);
			});
		});

		var mousewheel = function (event) {

			event.preventDefault();
			event.stopPropagation();

			var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

			lyricsBox.overallOffset += delta * 400;
		};

		lyricsWrap.addEventListener('DOMMouseScroll', mousewheel);
		lyricsWrap.addEventListener('mousewheel', mousewheel);
	});

})();