Rails.application.routes.draw do
  get 'profiles/index'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "sessions/new"
  get "sessions/create"
  get "sessions/destroy"
  get "welcome/index"

  get "/login", to: "sessions#new", as: "login" #login_path, loging_url
  post "/login", to: "sessions#create"

  get "/signup", to: "users#new", as: "signup"
  post "/signup", to: "users#create"

  delete "/logout", to: "sessions#destroy", as: "logout"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, except: [:new]
  resources :profiles
  root "welcome#index", as: "welcome"
end

