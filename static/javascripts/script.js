function getTweet(value){
	var current_tweet = parseInt(document.getElementById('current-tweet').innerHTML);
	var tweet_limit = parseInt(document.getElementById('limit').innerHTML);
	var new_tweet = current_tweet + value;
	if (new_tweet >= 1 && new_tweet < tweet_limit+1){
		if(new_tweet == 1){
			document.getElementById('prev-tweet').innerHTML = 'prev';
		}
		if(new_tweet == tweet_limit){
			document.getElementById('next-tweet').innerHTML = 'next';
		}
		document.getElementById('tweet-'+current_tweet).style.display = 'none';
		document.getElementById('tweet-'+new_tweet).style.display = 'block';
		document.getElementById('current-tweet').innerHTML = new_tweet;
	}
}