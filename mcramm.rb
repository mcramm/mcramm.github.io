require 'rubygems'
require 'compass'
require 'sinatra'
require 'haml'
require 'net/http'
require 'uri'
require 'rexml/document'
require 'lib/twitter'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"
set :public, "static"
#set :bind, '10.131.25.4'
#set :bind, '192.168.0.17'

configure do 
  Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

get '/' do
  haml :index
end

get "/tweets.json" do
    twitter = Twitter.new
    twitter.get_statuses
end

get "/reviews" do
    haml :reviews
end

private
