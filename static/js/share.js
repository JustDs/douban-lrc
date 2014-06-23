
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

			var weiboAppKey = 'http://app.weibo.com/t/feed/3Sgirk';

			popupShareWindow({
				baseUrl: 'http://service.weibo.com/share/share.php',
				params: {
					'url': options.url || '',
					'title': options.content || '',
					'pic': options.imageUrl || '',
					'appkey': weiboAppKey || '',
					'searchPic': 'false',
				}
			});
		}
	};

})();