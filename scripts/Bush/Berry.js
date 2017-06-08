//a berry is red, and doesn't respond to ticks

function Berry(x,y,maxx,maxy, parent){
	this.x = x;
	this.y = y;
	this.age = 0;
	this.path = "M" + this.x + " " + this.y + "a 2.25,2.5 0 1 1 -4.5,0 2.25,2.5 0 1 1 4.5,0 z";
	this.color = "45-#000-#f00";
	this.red = 255;;
	this.green = Math.random() * 155 + 100;
	this.stroke = '#000';
	this.parent = parent;
	this.max_x = maxx;
	this.is_dead = false;
	this.on_ground = false;
	this.is_stasis = false;
	this.is_floating = false;
	this.max_y = maxy;
	this.test = function(){
		return "Leaf is working!";
	};
	//so that leaves stay attached to their parents
	this.set_path = function(){
		this.path = "M" + this.x + " " + this.y + "a 2.25,2.5 0 1 1 -4.5,0 2.25,2.5 0 1 1 4.5,0 z";
	};
	
	this.grow = function(sprite){
	    scale_amount = "" + (this.age/5)+1 + "," + (this.age/5)+1;	
	};
	
	this.animate = function(sprite, wind){
		sprite.animate({path: this.path}, 0);
		sprite.attr({fill: this.color});
	}
	//floating is animated differently
	this.animate_floating = function(sprite){
		sprite.animate({path:this.path, rotation: 10 * wind},4000);
		sprite.attr({fill: this.color});
	};
	
	this.color_change = function(){
		if(this.red < 215){
		this.red = this.red + Math.random() * 20;
		}
		if(this.green > 10){
		this.green = this.green - Math.random() * 5;
		}

	};//end color change
	
	this.set_color = function(){
		var red = this.red; //goes up with age
		var green = this.green; //goes down with age
		var blue = "0";
		
		this.color = "rgb(" + red + "," + green + "," + blue+")";
		//console.log(this.color);
	}//end set color
	
	this.tick = function(sprite){
		
	};//end tick
}//end Leaf