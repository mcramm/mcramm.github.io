GITHUB_USERNAME='mcramm';
function getTimeline(){
    $.ajax({ 
            url: "/tweets.json", 
            context: document.body,
            dataType: 'json',

            success: function(response){
                place(response);
            },  
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }   
            }); 

}

function place(json){
    str = "";
    for(var i in json.tweets){
        tweet = json.tweets[i];
        str += "<p class='tweet'>" + tweet.text + " <a href='http://twitter.com/cramm/statuses/"+tweet.id+"'class='date'>("+tweet.date+")</a></p>";
    }           

    $('#tweets').html(str);

}
$('document').ready( function(){
    getTimeline();
});
