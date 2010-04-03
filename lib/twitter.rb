class Twitter
  def initialize()
    uri = URI.parse('http://api.twitter.com/1/statuses/user_timeline/15446319.xml')
    http = Net::HTTP.new(uri.host, uri.port)
    req = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(req)
    @tweets = REXML::Document.new(response.body)
    @timeline = Array.new
  end
  
  def retrieve(limit = 10)
    limit = 20 if limit > 20
    limit = 10 if limit <= 0
    index = 0
    @tweets.elements.each('statuses/status') do |tweet|
      unless index > limit - 1
        @timeline[index] = Hash.new
        @timeline[index]['id'] = tweet.elements['id'].text
        @timeline[index]['text'] = sanitize(tweet.elements['text'].text)
        @timeline[index]['date'] = Time.parse(tweet.elements['created_at'].text).strftime("%a %b %d %I:%M %p")
        index += 1
      end
    end
    return @timeline[0] if limit == 1
    return @timeline
  end
  
  private
  
  def sanitize(s)
    s.gsub!(/’/,'\'')
    s.gsub!(/”/,"\"")
    s.gsub!(/“/,"\"")
    s.gsub!(/\shttp:\/\/[www.]*[a-zA-Z0-9]+.[(com)(ca)(org)(ly)]+(\/)*[a-zA-Z0-9]*/){ |match| "\s<a href='#{match.strip!}' target='_blank'>#{match}</a>\s"}
    s.gsub!(/[^\s]*\@[a-zA-Z0-9]+\s/) { |match| "\s<a href='http://twitter.com/#{match.strip![1..match.length]} target='_blank'>#{match}</a>\s"}
    return s
  end
  
end