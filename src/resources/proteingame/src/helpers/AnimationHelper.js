export const Jiggle = (gameobject) => {
  var startScale = gameobject.scale;
  gameobject.scale.set(startScale.x+1, startScale.y + 1);
  game.time.events.add(100, function(){
  	this.scale.set(startScale.x, startScale.y);
  }, gameobject);
}
