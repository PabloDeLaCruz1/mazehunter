Rails.application.routes.draw do
  get 'profiles/index'
  devise_for :users

  root "welcome#index"

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

  # game editor
  get 'game/editor', to: "game_editor#index", as: 'game_editor'  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, except: [:new]
<<<<<<< HEAD
  resources :profiles
  root "welcome#index", as: "welcome"
=======
>>>>>>> origin
end

