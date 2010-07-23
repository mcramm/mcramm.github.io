class Twitter
  def initialize()
    uri = URI.parse('http://api.twitter.com/1/statuses/user_timeline/cramm.xml?count=3')
    @http = Net::HTTP.new(uri.host, uri.port)
    @req = Net::HTTP::Get.new(uri.request_uri)
  end

  def get_statuses
    response = @http.request(@req)
    tweets = REXML::Document.new(response.body)
    
    timeline = Array.new
    json = '{"tweets":['
    tweets.elements.each('statuses/status') do |tweet|
        json << '{'
        json << '"id":"' << tweet.elements['id'].text 
        json << '", "text":"' << sanitize(tweet.elements['text'].text)
        json << '", "date":"' << Time.parse(tweet.elements['created_at'].text).strftime("%a %b %d %I:%M %p")
        json << '"},'
    end

    if(json != '{"tweets":[')
        json.chop!
    end 

    json << "]}"

    json
  end
  
  private
  
  def sanitize(s)
    s.gsub!(/’/,'\'')
    s.gsub!(/”/,"\"")
    s.gsub!(/“/,"\"")
    s.gsub!(/\shttp:\/\/[www.]*[a-zA-Z0-9]+.[(com)(ca)(org)(ly)]+(\/)*[a-zA-Z0-9]*/){ |match| "\s<a href='#{match.strip!}' target='_blank'>#{match}</a>\s"}
    s.gsub!(/[^\s]*\@[a-zA-Z0-9]+\s/) { |match| "\s<a href='http://twitter.com/#{match.strip![1..match.length]}' target='_blank'>#{match}</a>\s"}
    return s
  end
  
end
