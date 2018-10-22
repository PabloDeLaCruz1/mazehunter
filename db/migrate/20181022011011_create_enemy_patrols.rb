class CreateEnemyPatrols < ActiveRecord::Migration[5.2]
  def change
    create_table :enemy_patrols do |t|
      t.text :name, null: false
      t.json :data, null: false
    end
  end
end
