require 'rubygems'
require 'compass'
require 'sinatra'
require 'haml'
require 'net/http'
require 'uri'
require 'rexml/document'


set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"
set :public, "static"

configure do 
  Compass.configuration.parse(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

get '/' do
  get_timeline
  haml :index
end

private

def get_timeline
  uri = URI.parse('http://api.twitter.com/1/statuses/user_timeline/15446319.xml')
  http = Net::HTTP.new(uri.host, uri.port)
  req = Net::HTTP::Get.new(uri.request_uri)
  response = http.request(req)
  
  doc = REXML::Document.new(response.body)
  statuses = doc.elements['statuses/status']
  @timeline = Array.new
  index =0 
  doc.elements.each('statuses/status') do |status|
    unless index > 9
      @timeline[index] = Hash.new
      @timeline[index]['id'] = status.elements['id'].text
      tweet_content = status.elements['text'].text

      tweet_content.gsub!(/’/,'\'')
      tweet_content.gsub!(/”/,"\"")
      tweet_content.gsub!(/“/,"\"")
      tweet_content.gsub!(/\shttp:\/\/[www.]*[a-zA-Z0-9]+.[(com)(ca)(org)(ly)]+(\/)*[a-zA-Z0-9]*/){ |match| "\s<a href='#{match.strip!}' target='_blank'>#{match}</a>\s"}
      tweet_content.gsub!(/[^\s]*\@[a-zA-Z0-9]+\s/) { |match| "\s<a href='http://twitter.com/#{match.strip![1..match.length]} target='_blank'>#{match}</a>\s"}

      @timeline[index]['text'] = tweet_content
      @timeline[index]['date'] = Time.parse(status.elements['created_at'].text).strftime("%a %b %d %I:%M %p")
      index += 1
    end
  end
end