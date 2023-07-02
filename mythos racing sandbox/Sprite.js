class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    //Shadow
    this.shadow = new Image();
   this.useShadow = config.useShadow || true
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow2.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down" : [ [0,2],[0,2],[0,2],[1,2],[1,2],[2,2],[2,2],[3,2],[3,2],[4,2],[4,2],[5,2],[5,2],[0,2],[0,2],[0,2],[5,2],[5,2],[4,2],[4,2],[3,2],[3,2],[2,2],[2,2],[1,2],[1,2],],
      "idle-right": [ [0,4],[0,4],[0,4],[1,4],[1,4],[2,4],[2,4],[3,4],[3,4],[4,4],[4,4],[5,4],[5,4],[0,4],[0,4],[0,4],[5,4],[5,4],[4,4],[4,4],[3,4],[3,4],[2,4],[2,4],[1,4],[1,4],],
      "idle-up"   : [ [0,0],[0,0],[0,0],[1,0],[1,0],[2,0],[2,0],[3,0],[3,0],[4,0],[4,0],[5,0],[5,0],[0,0],[0,0],[0,0],[5,0],[5,0],[4,0],[4,0],[3,0],[3,0],[2,0],[2,0],[1,0],[1,0],],
      "idle-left" : [ [0,6],[0,6],[0,6],[1,6],[1,6],[2,6],[2,6],[3,6],[3,6],[4,6],[4,6],[5,6],[5,6],[0,6],[0,6],[0,6],[5,6],[5,6],[4,6],[4,6],[3,6],[3,6],[2,6],[2,6],[1,6],[1,6],],
      "walk-down" : [ [0,3],[1,3],[2,3],[1,3],[0,3],[3,3],[4,3],[5,3],[4,3],[3,3],],
      "walk-right": [ [0,5],[1,5],[2,5],[1,5],[0,5],[3,5],[4,5],[3,5]],
      "walk-up" :   [ [0,1],[1,1],[2,1],[1,1],[0,1],[3,1],[4,1],[5,1],[4,1],[3,1],],
      "walk-left" : [ [0,7],[1,7],[2,7],[1,7],[0,7],[3,7],[4,7],[3,7],],
      "swim-down": [[0,9],],
      "swim-right": [[0,9],],
      "swim-up": [ [0,9],[0,9],[1,9],[1,9],[2,9],[2,9],[1,9],[1,9],[0,9],[0,9],[3,9],[3,9],[4,9],[4,9],[5,9],[5,9],[4,9],[4,9],[3,9],[3,9],],
      "swim-left": [[0,9],],
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