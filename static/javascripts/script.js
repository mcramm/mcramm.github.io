function getTweet(value){
	var current_tweet = parseInt(document.getElementById('current-tweet').innerHTML);
	var new_tweet = current_tweet + value;
	if (new_tweet >= 1 && new_tweet < 11){
		if(new_tweet == 1){
			document.getElementById('prev-tweet').innerHTML = 'prev';
		}
		if(new_tweet == 10){
			document.getElementById('next-tweet').innerHTML = 'next';
		}
		document.getElementById('tweet-'+current_tweet).style.display = 'none';
		document.getElementById('tweet-'+new_tweet).style.display = 'block';
		document.getElementById('current-tweet').innerHTML = new_tweet;
	}
}