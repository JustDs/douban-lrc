
/**
 * 歌词分享接口
 */

Share = (function () {

	function popupShareWindow(shareLink) {

		if (shareLink && shareLink.baseUrl) {

			var shareUrl = shareLink.baseUrl;

			if (shareLink.params) {

				shareUrl += '?';

				for (var key in shareLink.params) {

					shareUrl += encodeURIComponent(key) + "=" +
						encodeURIComponent(shareLink.params[key]) + "&";
				}
			}

			window.open(shareUrl, 'DoubanLRC-Share',
				'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=350');
		}
	};

	return {
		
		weibo: function (options) {

			var weiboAppKey = '2403884134';

			var content = (options.content || '') + ' —— ' +
				 (options.artist || '') + '《' + (options.title || '') +'》';

			popupShareWindow({
				baseUrl: 'http://service.weibo.com/share/share.php',
				params: {
					'url': options.url || '',
					'title': content,
					'pic': options.imageUrl || '',
					'appkey': weiboAppKey || '',
					'searchPic': 'false',
				}
			});
		}
	};

})();