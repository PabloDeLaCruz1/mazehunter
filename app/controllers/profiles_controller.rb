class ProfilesController < ApplicationController
  def index
  end

  def show
    @user = User.find(params[:id])
    @profile = Profile.find(params[:id])
  end
end
