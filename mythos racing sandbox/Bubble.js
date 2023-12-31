class Bubble {
  constructor(config) {
    this.movingProgressRemaining = 0;
    this.speed = config.speed || 1

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "up": ["y", this.speed * -1],
      "down": ["y", this.speed],
      "left": ["x", this.speed * -1],
      "right": ["x", this.speed],
    }
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "up";
    this.sprite = new BubbleSprite({
      gameObject: this,
      src: config.src || "/images/characters/people/whiteubbleanimation.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

  }
  mount(map) {
    console.log("mounting!")
    this.isMounted = true;
    map.addWall(this.x, this.y);

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) { 

    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init(); 

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    } 

    //Do it again!
    this.doBehaviorEvent(map);
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
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
      this.updateBubbleSprite(state);
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
      this.updateBubbleSprite(state);
    }

    if (behavior.type === "stand") {
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
      }, behavior.time)
    }

  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= this.speed; 

      if (this.movingProgressRemaining === 0) {
        //We finished the walk!
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })

      }
  }

  updateBubbleSprite(state) {
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