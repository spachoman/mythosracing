class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.speed = config.speed || this.speed;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "up": ["y", (this.speed * -1)], 
      "down": ["y", this.speed],
      "left": ["x", (this.speed * -1)],
      "right": ["x", this.speed],
    }
  }

  

  updatePosition = (state) => {
    if (state.map.isSpaceWet(this.x, this.y, this.direction) == true) {
      this.speed =1; 
      console.log(this); // when this is this.speed-1, racer 1 (with all swim blocks, swims forever, racer 2 (with entry swim block, stops)) -- when -2, both swim forever.
      //  return; // with this - they both stop outside of the water and swim animate infinite loop
    }
    else if (state.map.isSpaceWet(this.x, this.y, this.direction) == false){
      this.speed = this.speed; // if I change speed here even to make it positive (1,2,4) it subtracts from moving progress remaining and then goes below 0. 
    }
   
    let [property, change] = this.directionUpdate[this.direction]; // property === "y" & change this.speed === *-1 , <-- this change needs to pull from the new speed value
      this[property] += change;  
      this.movingProgressRemaining -= this.speed; // when I change this to -=1 continue past alls forever, run animation. 
      // if (state.map.isSpaceWet(this.x, this.y, this.direction == true)) {
      //   console.log(this);
      // }
      if (this.movingProgressRemaining === 0) {
        //We finished the walk!
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })
  
      }  
  } 

  update(state) {
    if (this.movingProgressRemaining != 0) {;
      this.updatePosition(state);
      console.log(this.speed);
      console.log(this.directionUpdate);
    } else {

      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
      this.updateSprite(state);
    }
  }

  

  startBehavior(state, behavior) {
    //Set character direction to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === "walk") {
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10);

        return;
      }

      //Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
      }, behavior.time)
    }

  }

  updateSprite(state) {
    if (this.movingProgressRemaining > 0 && state.map.isSpaceWet(this.x, this.y, this.direction) == true) {
      this.sprite.setAnimation("swim-"+this.direction);
      return;
    }
    else if (this.movingProgressRemaining > 0 && state.map.isSpaceWet(this.x, this.y, this.direction) == false) {
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);    
  }

  
  }

