source "https://rubygems.org"

# Use GitHub Pages gem which includes Jekyll and approved plugins
gem "github-pages", "~> 231", group: :jekyll_plugins

# Additional plugins compatible with GitHub Pages
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"
  gem "jekyll-paginate"
end

# Windows and JRuby does not include zoneinfo files
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# webrick is required for Jekyll 4+ on Ruby 3.0+
gem "webrick", "~> 1.8"
