class BubbleSprite{
    constructor(config) {

      //Set up the image
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
        this.isLoaded = true;
      }
      //Shadow
    this.shadow = new Image();
   this.useShadow = config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow2.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }
      //Configure Animation & Initial State
      this.animations = config.animations || {
        "idle-down" :   [ [0,2],[1,2],[2,2],],
        "idle-right":   [ [0,2],[1,2],[2,2],],
        "idle-up"   :   [ [0,2],[1,2],[2,2],],
        "idle-left" :   [ [0,2],[1,2],[2,2],],
        "walk-down" :   [ [0,2],[1,2],[2,2],],
        "walk-right":   [ [0,2],[1,2],[2,2],],
        "walk-up" :     [ [0,2],[1,2],[2,2],],
        "walk-left" :   [ [0,2],[1,2],[2,2],],
        "swim-down":    [ [0,2],[1,2],[2,2],],
        "swim-right":   [ [0,2],[1,2],[2,2],],
        "swim-up":      [ [0,2],[1,2],[2,2],],
        "swim-left":    [ [0,2],[1,2],[2,2],],
      }
      config.currentAnimation || "idle-down";
      this.currentAnimationFrame = 0;
  
      this.animationFrameLimit = config.animationFrameLimit ||7;
      this.animationFrameProgress = this.animationFrameLimit;
      
  
      //Reference the game object
      this.gameObject = config.gameObject;
    }
  
    get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }
  
    setAnimation(key) {
      if (this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }
  
    updateAnimationProgress() {
      //Downtick frame progress
      if (this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return;
      }
  
      //Reset the counter
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;
  
      if (this.frame === undefined) {
        this.currentAnimationFrame = 0
      }

    }
  
    draw(ctx, cameraPerson) {
      const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
      const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
  
      this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
  
      const [frameX, frameY] = this.frame;
  
      this.isLoaded && ctx.drawImage(this.image,
        frameX * 32, frameY * 32,
        32,32,
        x,y,
        32,32
      )
  
      this.updateAnimationProgress();
    }
  
  }