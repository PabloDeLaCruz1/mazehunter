class CreateProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :profiles do |t|
      t.integer :wins
      t.integer :total_games
      t.integer :best_time
      t.references :user

      t.timestamps
    end
  end
end
