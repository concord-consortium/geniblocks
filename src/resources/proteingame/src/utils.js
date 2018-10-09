export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const clamp = (num, min, max) => {
	return Math.max(min, Math.min(num, max));
}

export const datalog = (description, details) => {
	var time = new Date();
	console.log("Log: ", time, description, details);
}

export const sqrMagnitude = (vector2) =>{
    return (vector2.x * vector2.x) + (vector2.y * vector2.y);
}

export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const tweenTint = (obj, startColor, endColor, time) => {
    // create an object to tween with our step value at 0    
    var colorBlend = {step: 0};    
    // create the tween on this object and tween its step property to 100    
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
    // run the interpolateColor function every time the tween updates, feeding it the    
    // updated value of our tween each time, and set the result as our tint    
    colorTween.onUpdateCallback(function() {      
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
    });        
    // set the object to the start color straight away    
    obj.tint = startColor;            
    // start the tween    
    return colorTween.start();

}

//https://medium.com/@jeffm712/formula-time-and-space-complexity-constant-2633e349625
export const fibonacci = (num) => {
  var a = 1, b = 0, temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}



export const stopTweensFor = (obj, children) => {  
        var o, c, t, len;
        
        if (Array.isArray(obj) )
        {
            for (o = 0, len = obj.length; o < len; o++)
            {
                this.removeFrom(obj[o]);   
            }
        }
        else if (obj.type === Phaser.GROUP && children)
        {
            for (c = 0, len = obj.children.length; c < len; c++)
            {
                this.removeFrom(obj.children[c]);   
            }
        }
        else
        {
            for (t = 0, len = this._tweens.length; t < len; t++)
            {
                if (obj === this._tweens[t]._object)
                {
                    this.remove(this._tweens[t]);
                }
            }
            for (t = 0, len = this._add.length; t < len; t++)
            {
                if (obj === this._add[t]._object)
                {
                    this.remove(this._add[t]);
                }
            }
        }
}




Phaser.TweenManager.prototype.removeFrom = function(obj, children) {
        
        var o, c, t, len;


        if (Array.isArray(obj) )
        {
            for (o = 0, len = obj.length; o < len; o++)
            {
                this.removeFrom(obj[o]);   
            }
        }
        else if (obj.type === Phaser.GROUP && children)
        {
            for (c = 0, len = obj.children.length; c < len; c++)
            {
                this.removeFrom(obj.children[c]);   
            }
        }
        else
        {
            for (t = 0, len = this._tweens.length; t < len; t++)
            {

                if (obj === this._tweens[t].target)
                {
                    this.remove(this._tweens[t]);
                }
            }
            for (t = 0, len = this._add.length; t < len; t++)
            {
                if (obj === this._add[t].target)
                {
                    this.remove(this._add[t]);
                }
            }
        }
};




export const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
