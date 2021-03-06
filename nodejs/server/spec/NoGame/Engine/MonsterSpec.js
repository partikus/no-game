describe("Monster", () => {
    const expect = require('expect.js');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const TestKit = require('../TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("it has uuid", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(monster.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it ("moves to a different position with delay between moves", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.move(new Tile(new Position(1,2), new Item(0, false)), clock);
        expect(monster.isMoving(clock)).to.be(true);
        monster.move(new Tile(new Position(2,2), new Item(0, false)), clock); // should not move here because is moving already
        expect(monster.position.isEqualTo(new Position(1, 2))).to.be(true);

        clock.pushForward(600);

        expect(monster.isMoving(clock)).to.be(false);
    });

    it ("is not attacking by default", () => {
        let mon = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(mon.isExhausted(clock)).to.be(false);
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 5, 50, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("1111", "yaboomaster", 0, 100, 100, new Position(1, 2), new Position(1, 2));

        monster.attack(player.id);

        expect(monster.isExhausted(clock)).to.be(false);

        monster.meleeHit(10, clock, new TestKit.ManualRandomizer(1));

        expect(monster.isExhausted(clock)).to.be(true);

        clock.pushForward(100);

        expect(monster.isExhausted(clock)).to.be(false);
    });

    it ("can't have negative health", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(200, '111111');

        expect(monster.health).to.be(0);
        expect(monster.killerId).to.be('111111');
    });

    it ("don't have killer when is not dead", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(20, '111111');

        expect(() => { monster.killerId; }).to.throwError('Monster is not dead.');
    });

    it ("have only one killer with highest damage", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(20, '111111');
        monster.damage(20, '222222');
        monster.damage(20, '222222');
        monster.damage(20, '222222');
        monster.damage(20, '111111');

        expect(monster.killerId).to.be('222222');
    });

    it ("counts last highest hit as a killer", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(50, '111111');
        monster.damage(50, '222222');

        expect(monster.killerId).to.be('222222');
    });

    it ("calculate damage for defence", () => {
        let monster = new Monster("bobok", 100, 5, 20, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(monster.meleeHit(10, clock, new TestKit.ManualRandomizer(1))).to.be(10);
    });
});