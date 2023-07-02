class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.water = config.water || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;


  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceWet(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.water[`${x},${y}`] || false;
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}
window.OverworldMaps = {
Racemap2: {
  lowerSrc: "/images/maps/racemaplower.png",
  upperSrc: "images/maps/racemap2upper.png",
  gameObjects:{
    hero: new Person({
      isPlayerControlled: true,
      x: utils.withGrid(4),
      y: utils.withGrid(25),
      // speed: 2,
      src: "/images/characters/people/6frameani.png",
  
        }
            ),
    racer1: new Person({
      isPlayerControlled: false,
      x: utils.withGrid(6),
      y: utils.withGrid(25),
      speed: 2,
      src: "/images/characters/people/6frameani.png",
      behaviorLoop: [ 
      {type: "walk", direction: "up",}
      ]
        }
            ),
    // racer1Bubble: new Bubble({
    //   isPlayerControlled: false,
    //   x: utils.withGrid(6),
    //   y: utils.withGrid(24),
    //   speed: 1,
    //   src: "/images/characters/whitebubbleanimation.png",
    //   behaviorLoop: [ 
    //   {type: "walk", direction: "up",}
    //   ]
    //     }
    //         ),

  hero: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(25),
        speed: 2,
        src: "/images/characters/people/6frameani2.png",
        behaviorLoop: [ 
        {type: "walk", direction: "up"}
  ]
      }),
      // racer2Bubble: new Bubble({
      //   isPlayerControlled: false,
      //   x: utils.withGrid(10),
      //   y: utils.withGrid(24),
      //   speed: 1,
      //   src: "/images/characters/whitebubbleanimation.png",
      //   behaviorLoop: [ 
      //   {type: "walk", direction: "up",}
      //   ]
      //     }
      //         ),
   
  },
  water: {
    // [utils.asGridCoord(5,9)] : true,
    // [utils.asGridCoord(5,10)] : true,
    // [utils.asGridCoord(5,11)] : true,
    // [utils.asGridCoord(5,12)] : true,
    // [utils.asGridCoord(6,4)] : true, 
    // [utils.asGridCoord(6,5)] : true,
    // [utils.asGridCoord(6,6)] : true,
    // [utils.asGridCoord(6,7)] : true,
    // [utils.asGridCoord(6,8)] : true,
    [utils.asGridCoord(6,9)] : true,
    [utils.asGridCoord(6,10)] : true,
    [utils.asGridCoord(6,11)] : true,
    [utils.asGridCoord(6,12)] : true,
    [utils.asGridCoord(6,13)] : true,
    // [utils.asGridCoord(7,9)] : true,
    // [utils.asGridCoord(7,10)] : true,
    // [utils.asGridCoord(7,11)] : true,
    // [utils.asGridCoord(7,12)] : true,
    [utils.asGridCoord(7,13)] : true,
    // [utils.asGridCoord(8,9)] : true,
    // [utils.asGridCoord(8,10)] : true,
    // [utils.asGridCoord(8,11)] : true,
    // [utils.asGridCoord(8,12)] : true,
    [utils.asGridCoord(8,13)] : true,
    // [utils.asGridCoord(9,9)] : true,
    // [utils.asGridCoord(9,10)] : true,
    // [utils.asGridCoord(9,11)] : true,
    // [utils.asGridCoord(9,12)] : true,
    [utils.asGridCoord(9,13)] : true,
    // [utils.asGridCoord(10,9)] : true,
    // [utils.asGridCoord(10,10)] : true,
    // [utils.asGridCoord(10,11)] : true,
    [utils.asGridCoord(10,12)] : true,
    [utils.asGridCoord(10,13)] : true,
    // [utils.asGridCoord(11,9)] : true,
    // [utils.asGridCoord(11,10)] : true,
    // [utils.asGridCoord(11,11)] : true,
    // [utils.asGridCoord(11,12)] : true,
    [utils.asGridCoord(11,13)] : true,
    // [utils.asGridCoord(12,9)] : true,
    // [utils.asGridCoord(12,10)] : true,
    // [utils.asGridCoord(12,11)] : true,
    // [utils.asGridCoord(12,12)] : true,
    [utils.asGridCoord(12,13)] : true,
    // [utils.asGridCoord(13,9)] : true,
    // [utils.asGridCoord(13,10)] : true,
    // [utils.asGridCoord(13,11)] : true,
    // [utils.asGridCoord(13,12)] : true,
    [utils.asGridCoord(13,13)] : true,
  },
  walls: {
    [utils.asGridCoord(0,-1)] : true,
    [utils.asGridCoord(1,-1)] : true,
    [utils.asGridCoord(2,-1)] : true,
    [utils.asGridCoord(3,-1)] : true,
    [utils.asGridCoord(4,-1)] : true,
    [utils.asGridCoord(5,-1)] : true,
    [utils.asGridCoord(6,-1)] : true,
    [utils.asGridCoord(7,-1)] : true,
    [utils.asGridCoord(8,-1)] : true,
    [utils.asGridCoord(9,-1)] : true,
    [utils.asGridCoord(10,-1)] : true,
    [utils.asGridCoord(11,-1)] : true,
    [utils.asGridCoord(12,-1)] : true,
    [utils.asGridCoord(13,-1)] : true,
},
},

  Olympia: {
    lowerSrc: "/images/maps/OlympiaLower.png",
    upperSrc: "/images/maps/racemap2upper.png",
    gameObjects:{
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(4),
        y: utils.withGrid(25),
        speed: 2,
        src: "/images/characters/people/herc.png",
    
          }
              ),
      // racer1: new Person({
      //   isPlayerControlled: false,
      //   x: utils.withGrid(6),
      //   y: utils.withGrid(25),
      //   speed: 2,
      //   src: "/images/characters/people/6frameani.png",
      //   behaviorLoop: [ 
      //   {type: "walk", direction: "up",}
      //   ]
      //     }
      //         ),
      // racer1Bubble: new Bubble({
      //   isPlayerControlled: false,
      //   x: utils.withGrid(6),
      //   y: utils.withGrid(24),
      //   speed: 1,
      //   src: "/images/characters/whitebubbleanimation.png",
      //   behaviorLoop: [ 
      //   {type: "walk", direction: "up",}
      //   ]
      //     }
      //         ),
        }
      }

}