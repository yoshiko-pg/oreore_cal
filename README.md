#おれおれ勉強会カレンダー
http://yoshiko-pg.github.io/oreore_cal/  
ATND,connpass,Zusaarで入れた自分の予定をまとめて把握しよう！  

##使い方
上部の「ID setting」を開いて、ATND・connpass・Zusaarそれぞれ自分のIDを入力します。  
（空欄のサービスがあっても大丈夫です。）  
（IDがどこにあるかは、入力欄下のリンク「Where is my ID?」を参考にしてください。）  

IDを入れたら、「view events」ボタンをクリックすると予定がまとめて表示されます。  
気に入ったら、「save ID setting」ボタンを押すとIDをlocalStorageに保存するので  
次回からページを開くだけで予定を確認することができます。  

##コードについて
js/event_api_wrapper.jquery.js は ATND・connpass・Zusaarからまとめて予定を取得できるスクリプトとして使用できるように書きました。  
```
event_api_wrapper.get_events(
	{atnd:'xxxxx', connpass:'xxxxx', zusaar:'xxxxx'}, 
	function(events){ //... }, 
	['201402','201403','201404']
); 
```
の形で

* サービス名とIDを対にしたオブジェクト
* コールバック関数
* 取得したいイベントの年月（オプション）

を渡すと、コールバック関数の第一引数に、イベントオブジェクトをまとめた配列を返します。

ヘッダーコメントに詳しい使い方を書いていますので、利用したい方はご自由にどうぞ。  
