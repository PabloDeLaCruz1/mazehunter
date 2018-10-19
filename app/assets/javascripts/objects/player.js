export default class Player {

    constructor(type, name = "", inventory = []) {
        this.type = type;
        this.inventory = inventory;
        this.name = name;
    }
    collideWithItem(item) {
        this.inventory.push(item);
        //allow use
    }

    move() {

    }

    update() {

    }

    findPath() {

    }
}