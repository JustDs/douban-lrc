
/**
 * 用于控制歌词框的模块
 */

LyricsBox = (function () {

	function LyricsBox(lyricsWrap, lyricsSlide, lyricList, selectArea) {

		this.lyricsWrap = lyricsWrap;
		this.lyricsSlide = lyricsSlide;
		this.lyricList = lyricList;
		this.selectArea = selectArea;

		// 为每行歌词元素计算位置偏移量信息
		
		for (var index = 0; index < lyricList.children.length; index++) {

			var lyricItem = lyricList.children[index];

			lyricItem.offsetBottom = lyricList.clientHeight
				- lyricItem.offsetTop - lyricItem.clientHeight;
			lyricItem.offsetMidline = lyricItem.offsetTop
				+ lyricItem.clientHeight / 2;
		}
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
		 * 当前歌词序号
		 */
		currentIndex: 0,

		/**
		 * 选择状态
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
		 * 滚动到指定行的歌词
		 */
		scrollTo: function (index) {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'none') {

				lyricsBox.currentIndex = index;

				var lyricItem = lyricsBox.lyricList.children[index];

				lyricsBox.lyricsSlide.style.top = (320 - lyricItem.offsetMidline) + 'px';
			}
		},

		/**
		 * 滚动到下一行歌词
		 */
		scroll: function () {

			var lyricsBox = this;
			
			lyricsBox.scrollTo(lyricsBox.currentIndex + 1);
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
		resizeSelectArea: function (cursorOffset) {

			var lyricsBox = this;

			if (lyricsBox.selectState === 'selecting') {

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
			}
		}

	}

	return LyricsBox;

})();