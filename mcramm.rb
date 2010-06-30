require 'rubygems'
require 'compass'
require 'sinatra'
require 'haml'
require 'net/http'
require 'uri'
require 'digest/md5'
require 'rexml/document'
require 'lib/twitter'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"
set :public, "static"
# set :bind, '10.131.25.4'

configure do 
  Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

get '/' do
  twitter = Twitter.new
  @timeline = twitter.retrieve
  haml :index
end

get '/info' do
  email_address = "gmcramm@gmail.com"
  hash = Digest::MD5.hexdigest(email_address)
  @image_src = "http://www.gravatar.com/avatar/#{hash}"
  haml :info
end

private
