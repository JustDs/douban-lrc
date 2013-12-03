
/**
 * 用于控制歌词框的模块
 */

LyricsBox = (function () {

	function LyricsBox(lyricsWrap, lyricsSlide, lyricList, notice, selectArea, onselect) {

		var lyricsBox = this;

		lyricsBox.lyricsWrap = lyricsWrap;
		lyricsBox.lyricsSlide = lyricsSlide;
		lyricsBox.lyricList = lyricList;
		lyricsBox.notice = notice;
		lyricsBox.selectArea = selectArea;
		lyricsBox.onselect = onselect;

		lyricsBox.lyricsInfo = {
			startTime: new Date().getTime(),
			lyrics: []
		};
		lyricsBox.lyricsInfoCache = {
			startTime: new Date().getTime(),
			lyrics: []
		};

		lyricList.addEventListener('mousemove', function (event) {

			lyricsBox.startSelect();

			lyricsBox.resizeSelectArea(event.layerY, event.clientY);
		});

		window.addEventListener('mouseup', function (event) {

			if (event.button === 0) {

				lyricsBox.stopHover();

				lyricsBox.stopSelect();
			}
		});

		setInterval(function () {

			lyricsBox.refresh();

		}, 50);
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
		 * 歌词框中通知元素
		 */
		notice: null,

		/**
		 * 选择区域元素
		 */
		selectArea: null,

		/**
		 * 歌词的全局时间偏移量
		 */
		overallOffset: 0,

		/**
		 * 歌词信息
		 */
		lyricsInfo: null,

		/**
		 * 歌词信息缓存
		 */
		lyricsInfoCache: null,

		/**
		 * 当前歌词位置
		 */
		currentPosition: 0,

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
		 * 刷新歌词框中歌词位置
		 */
		refresh: function () {

			var transitionTime = 0;
			var transitionOffset = 300;
			var transitionEasing = function (t) {

				return 0.5 - Math.cos(t * Math.PI) / 2;
			};

			var lyricsBox = this;

			var time = new Date().getTime() -
				(lyricsBox.lyricsInfo.startTime + lyricsBox.overallOffset + transitionOffset);

			if (!lyricsBox.lyricsInfo.lyrics.some(function (item, position) {

				var timeOffset = time - item.time;
				var positionOffset = 0;

				if (!lyricsBox.lyricsInfo.lyrics[position + 1] && time >= item.time) {

					lyricsBox.scrollTo(position);

					return true;
				}

				if (time >= item.time && time < lyricsBox.lyricsInfo.lyrics[position + 1].time) {

					var duration = lyricsBox.lyricsInfo.lyrics[position + 1].time - item.time;

					if (duration > transitionTime) {

						var easingOffset = timeOffset - (duration - transitionTime);

						if (easingOffset >= 0 && transitionTime > 0) {

							positionOffset = transitionEasing(easingOffset / transitionTime);
						}

					} else {

						positionOffset = transitionEasing(timeOffset / duration);
					}

					lyricsBox.scrollTo(position + positionOffset);

					return true;
				}

				return false;

			})) {

				lyricsBox.scrollTo(0);
			}
		},

		/**
		 * 向歌词缓存中添加一行歌词
		 */
		append: function (item) {

			var lyricsBox = this;

			lyricsBox.lyricsInfoCache.lyrics.push(item);
		},

		/**
		 * 设置歌词的开始时间
		 */
		setStartTime: function (startTime) {

			var lyricsBox = this;

			lyricsBox.lyricsInfoCache.startTime = startTime || new Date().getTime();
		},

		/**
		 * 从歌词缓存中加载歌词
		 */
		update: function () {

			var lyricsBox = this;

			lyricsBox.lyricsInfo.startTime = 0;

			if (lyricsBox.selectState === 'none') {

				lyricsBox.lyricList.innerHTML = '';

				lyricsBox.lyricsInfo = {
					startTime: lyricsBox.lyricsInfoCache.startTime,
					lyrics: lyricsBox.lyricsInfoCache.lyrics.map(function (item) {

						return item;
					})
				};

				if (lyricsBox.lyricsInfo.lyrics.length > 0) {

					lyricsBox.lyricsInfo.lyrics.forEach(function (item) {

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

						lyricsBox.lyricList.appendChild(element);
					});

					for (var index = 0; index < lyricsBox.lyricList.children.length; index++) {

						var element = lyricsBox.lyricList.children[index];

						element.offsetBottom = lyricsBox.lyricList.clientHeight -
							element.offsetTop - element.clientHeight;
						element.offsetMidline = element.offsetTop +
							element.clientHeight / 2;
					}

					lyricsBox.scrollTo();

					lyricsBox.notice.classList.add('hidden');

				} else {

					lyricsBox.scrollTo(0);

					lyricsBox.notice.classList.remove('hidden');
				}
			}
		},

		/**
		 * 清空歌词缓存
		 */
		clear: function () {

			var lyricsBox = this;

			lyricsBox.lyricsInfoCache = {
				startTime: new Date().getTime(),
				lyrics: []
			};
		},

		/**
		 * 滚动到指定行的歌词
		 */
		scrollTo: function (position) {

			var lyricsBox = this;

			if (typeof(position) === 'undefined') position = lyricsBox.currentPosition;

			lyricsBox.currentPosition = position;

			for (var index = 0; index < lyricsBox.lyricList.children.length; index++) {

				var element = lyricsBox.lyricList.children[index];

				element.classList.remove('highlight');
			}

			var element = lyricsBox.lyricList.children[Math.floor(position)];

			if (element) {

				element.classList.add('highlight');
			}

			position = Math.min(position, lyricsBox.lyricList.children.length - 1);
			position = Math.max(position, 0);

			element = lyricsBox.lyricList.children[Math.floor(position)];

			if (lyricsBox.selectState === 'none') {

				var offset = 0;

				if (element) {

					offset = element.offsetMidline + ((element.nextElementSibling ||
						element).offsetMidline - element.offsetMidline) *
						(position - Math.floor(position)) + lyricsBox.lyricList.offsetTop;
				}

				lyricsBox.lyricsSlide.style.top = (320 - offset) + 'px';
			}
		},

		/**
		 * 滚动到下一行歌词
		 */
		scroll: function () {

			var lyricsBox = this;
			
			lyricsBox.scrollTo(Math.floor(lyricsBox.currentPosition + 1));
		},

		/**
		 * 设置选择区域范围
		 */
		setSelectArea: function (offsetTop, offsetBottom) {

			var lyricsBox = this;

			lyricsBox.selectArea.style.top = offsetTop + lyricsBox.lyricList.offsetTop + 'px';
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

				}, 850);
			}
		},

		/**
		 * 取消开始选择准备
		 */
		stopHover: function () {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'hover') {

				lyricsBox.selectState = 'none';

				lyricsBox.update();
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

				lyricsBox.lyricsSlide.style.top = (407 - lyricsBox.selectArea.offsetTop -
					lyricsBox.selectArea.clientHeight * 0.6) + 'px';

				lyricsBox.lyricsWrap.classList.remove('selecting');

				var selectContent = [];

				for (var element = lyricsBox.selectStartItem;
					element; element = element.nextElementSibling) {

					selectContent.push(element.innerHTML);

					if (element === lyricsBox.selectEndItem) break;
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

				lyricsBox.update();
			}
		}

	};

	return LyricsBox;

})();