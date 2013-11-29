(function () {

	document.addEventListener('DOMContentLoaded', function (event) {

		var wrap = document.getElementById('wrap');
		var lyricsSlide = document.getElementById('lyrics-slide');
		var lyricsWrap = document.getElementById('lyrics');
		var lyricList = document.getElementById('lyric-list');
		var selectArea = document.getElementById('select-area');
		var shareBox = document.getElementById('share');
		var shareFold = document.getElementById('share-fold');


		lyricList.addEventListener('mousewheel', function (event) {

			event.preventDefault();
			event.stopPropagation();
		});


		// 自动根据窗口大小调整wrap的高度

		var autoSize = function (event) {

			wrap.style.height = window.innerHeight + 'px';
		};

		window.addEventListener(autoSize);
		autoSize();


		// 歌词框控制

		var lyricsBox = new LyricsBox(lyricsWrap, lyricsSlide, lyricList, selectArea);

		for (var index = 0; index < lyricList.children.length; index++) {

			lyricList.children[index].addEventListener('mousedown', function (event) {

				event.preventDefault();

				if (event.button === 0) {

					lyricsBox.startHover(event.target, event.offsetY);
				}
			});

			lyricList.children[index].addEventListener('mouseleave', function (event) {

				lyricsBox.stopHover();
			});
		}

		lyricList.addEventListener('mousemove', function (event) {

			lyricsBox.resizeSelectArea(event.layerY);
		});

		wrap.addEventListener('mouseup', function (event) {

			if (event.button === 0) {

				if (lyricsBox.selectState === 'selecting') {

					setTimeout(function () {

							shareBox.classList.remove('hidden');

					}, 500);
				}

				lyricsBox.stopHover();

				lyricsBox.stopSelect();
			}
		});

		shareFold.addEventListener('click', function (event) {

			event.preventDefault();

			lyricsBox.cancelSelect();

			shareBox.classList.add('hidden');
		});
	});

})();