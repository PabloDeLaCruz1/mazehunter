class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :profile
  accepts_nested_attributes_for :profile

  after_create :create_profile
  after_destroy :destroy_profile
  def create_profile
    Profile.create(user_id: self.id)
  end
end
