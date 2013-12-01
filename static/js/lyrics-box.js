
/**
 * 用于控制歌词框的模块
 */

LyricsBox = (function () {

	function LyricsBox(lyricsWrap, lyricsSlide, lyricList, selectArea, onselect) {

		var lyricsBox = this;

		lyricsBox.lyricsWrap = lyricsWrap;
		lyricsBox.lyricsSlide = lyricsSlide;
		lyricsBox.lyricList = lyricList;
		lyricsBox.selectArea = selectArea;
		lyricsBox.onselect = onselect;

		lyricsBox.cache = [];

		lyricList.addEventListener('mousewheel', function (event) {

			event.preventDefault();
			event.stopPropagation();
		});

		lyricList.addEventListener('mousemove', function (event) {

			lyricsBox.resizeSelectArea(event.layerY, event.y);
		});

		window.addEventListener('mouseup', function (event) {

			if (event.button === 0) {

				lyricsBox.stopHover();

				lyricsBox.stopSelect();
			}
		});
	}

	LyricsBox.prototype = {

		/**
		 * 重置构造函数
		 */
		constructor: LyricsBox,

		/**
		 * 歌词外框元素
		 */
		lyricsWrap: null,

		/**
		 * 歌词滑动框元素
		 */
		lyricsSlide: null,

		/**
		 * 歌词列表元素
		 */
		lyricList: null,

		/**
		 * 选择区域元素
		 */
		selectArea: null,

		/**
		 * 歌词缓存
		 */
		cache: null,

		/**
		 * 当前歌词序号
		 */
		currentIndex: 0,

		/**
		 * 选择状态
		 *  'none' - 未选择
		 *  'hover' - 准备选择
		 *  'selecting' - 正在选择
		 *  'selected' - 已选择
		 */
		selectState: 'none',

		/**
		 * 选择开始元素
		 */
		selectStartItem: null,

		/**
		 * 选择结束元素
		 */
		selectEndItem: null,

		/**
		 * 当歌词被选中时触发该句柄
		 */
		onselect: null,

		/**
		 * 向歌词缓存中添加一行歌词
		 */
		append: function (item) {

			var lyricsBox = this;

			var element = document.createElement('li');

			element.innerHTML = item.lyric;

			if (item.lyric === '') element.classList.add('blank');

			element.addEventListener('mousedown', function (event) {

				event.preventDefault();

				if (event.button === 0) {

					lyricsBox.startHover(event.target, event.offsetY);
				}
			});

			element.addEventListener('mouseleave', function (event) {

				lyricsBox.stopHover();
			});

			lyricsBox.cache.push(element);
		},

		/**
		 * 从歌词缓存中刷新歌词框中的歌词
		 */
		refresh: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'none') {

				lyricsBox.lyricList.innerHTML = '';

				if (lyricsBox.cache.length > 0) {

					lyricsBox.cache.forEach(function (lyricElement) {

						lyricsBox.lyricList.appendChild(lyricElement);
					});

					for (var index = 0; index < lyricsBox.lyricList.children.length; index++) {

						var lyricElement = lyricsBox.lyricList.children[index];

						lyricElement.offsetBottom = lyricsBox.lyricList.clientHeight -
							lyricElement.offsetTop - lyricElement.clientHeight;
						lyricElement.offsetMidline = lyricElement.offsetTop +
							lyricElement.clientHeight / 2;
					}

					lyricsBox.scrollTo(lyricsBox.currentIndex);

				} else {

					;
				}
			}
		},

		/**
		 * 清空歌词缓存
		 */
		clear: function () {

			var lyricsBox = this;

			lyricsBox.cache = [];
		},

		/**
		 * 滚动到指定行的歌词
		 */
		scrollTo: function (lyricIndex) {

			var lyricsBox = this;

			lyricsBox.currentIndex = lyricIndex;

			if (lyricsBox.selectState === 'none') {

				for (var index = 0; index < lyricsBox.lyricList.children.length; index++) {

					var lyricElement = lyricsBox.lyricList.children[index];

					lyricElement.classList.remove('highlight');
				}

				var lyricElement = lyricsBox.lyricList.children[Math.floor(lyricIndex)];

				lyricElement.classList.add('highlight');

				var offset = lyricElement.offsetMidline + (lyricElement.nextElementSibling.offsetMidline -
					lyricElement.offsetMidline) * (lyricIndex - Math.floor(lyricIndex));

				lyricsBox.lyricsSlide.style.top = (320 - offset) + 'px';
			}
		},

		/**
		 * 滚动到下一行歌词
		 */
		scroll: function () {

			var lyricsBox = this;
			
			lyricsBox.scrollTo(Math.floor(lyricsBox.currentIndex + 1));
		},

		/**
		 * 设置选择区域范围
		 */
		setSelectArea: function (offsetTop, offsetBottom) {

			var lyricsBox = this;

			lyricsBox.selectArea.style.top = offsetTop + 'px';
			lyricsBox.selectArea.style.bottom = offsetBottom + 'px';
		},

		/**
		 * 准备开始选择
		 */
		startHover: function (item, cursorOffset) {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'none') {

				lyricsBox.selectState = 'hover';

				lyricsBox.selectStartItem = item;
				lyricsBox.selectEndItem = item;

				lyricsBox.setSelectArea(
					lyricsBox.selectStartItem.offsetTop + cursorOffset,
					lyricsBox.lyricList.clientHeight - lyricsBox.selectStartItem.offsetTop - cursorOffset
				);

				setTimeout(function () {

					lyricsBox.startSelect();

				}, 1000);
			}
		},

		/**
		 * 取消开始选择准备
		 */
		stopHover: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'hover') {

				lyricsBox.selectState = 'none';

				lyricsBox.refresh();
			}
		},

		/**
		 * 开始选择
		 */
		startSelect: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'hover') {

				lyricsBox.selectState = 'selecting';

				lyricsBox.selectArea.classList.remove('hidden');
				lyricsBox.lyricsWrap.classList.add('selecting');

				lyricsBox.setSelectArea(
					lyricsBox.selectStartItem.offsetTop,
					lyricsBox.selectStartItem.offsetBottom
				);
			}
		},

		/**
		 * 改变选择区域范围大小
		 */
		resizeSelectArea: function (cursorOffset, cursorOffsetToWindow) {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'selecting') {

				if (cursorOffsetToWindow < 80
				 && lyricsBox.selectEndItem !== lyricsBox.lyricList.firstElementChild) {

					lyricsBox.lyricsSlide.style.top =
						(parseInt(lyricsBox.lyricsSlide.style.top) + 4) + 'px';
				}

				if (window.innerHeight - cursorOffsetToWindow < 80
				 && lyricsBox.selectEndItem !== lyricsBox.lyricList.lastElementChild) {

					lyricsBox.lyricsSlide.style.top =
						(parseInt(lyricsBox.lyricsSlide.style.top) - 4) + 'px';
				}

				if (cursorOffset < lyricsBox.selectStartItem.offsetMidline) {

					for (var index = 0; index < lyricsBox.lyricList.children.length; index++) {

						lyricsBox.selectEndItem = lyricsBox.lyricList.children[index];

						if (lyricsBox.selectEndItem === lyricsBox.selectStartItem
							|| lyricsBox.selectEndItem.offsetMidline > cursorOffset) {

							lyricsBox.setSelectArea(
								lyricsBox.selectEndItem.offsetTop,
								lyricsBox.selectStartItem.offsetBottom
							);

							break;
						}
					}

				} else {

					for (var index = lyricsBox.lyricList.children.length - 1; index >= 0; index--) {

						lyricsBox.selectEndItem = lyricsBox.lyricList.children[index];

						if (lyricsBox.selectEndItem === lyricsBox.selectStartItem
							|| lyricsBox.selectEndItem.offsetMidline < cursorOffset) {

							lyricsBox.setSelectArea(
								lyricsBox.selectStartItem.offsetTop,
								lyricsBox.selectEndItem.offsetBottom
							);

							break;
						}
					}
				}
			}
		},

		/**
		 * 结束选择
		 */
		stopSelect: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'selecting') {

				lyricsBox.selectState = 'selected';

				lyricsBox.lyricsSlide.style.top = (320 - Math.min(
					lyricsBox.selectStartItem.offsetTop, lyricsBox.selectEndItem.offsetTop)) + 'px';

				lyricsBox.lyricsWrap.classList.remove('selecting');

				var selectContent = [];

				for (var lyricElement = lyricsBox.selectStartItem;
					lyricElement; lyricElement = lyricElement.nextElementSibling) {

					selectContent.push(lyricElement.innerHTML);

					if (lyricElement === lyricsBox.selectEndItem) break;
				}

				if (lyricsBox.onselect) lyricsBox.onselect({
					target: lyricsBox,
					content: selectContent.join(' ')
				});
			}
		},

		/**
		 * 取消选择
		 */
		cancelSelect: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'selected') {

				lyricsBox.selectState = 'none';

				lyricsBox.selectArea.classList.add('hidden');

				lyricsBox.refresh();
			}
		}

	}

	return LyricsBox;

})();