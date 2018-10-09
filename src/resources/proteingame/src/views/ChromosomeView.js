import { _ } from 'underscore';
import $ from 'jquery';
import { View } from 'backbone';

const mainTemplate = require('html-loader?root=../..!../templates/chromosomeTemplate.html')


class ChromosomeView extends View {
	constructor ({ el, model, initial_chromosome_location }){
		super({
			el: el,
			events: {
				'click .close': 'close',
				'change select': 'handleSelectChange',
				'click .allele-selector': 'handleSelectClick',
				'click .allele-label': 'handleSelectClick',
				'mousedown .chromosome-scrubber': 'startScrubbing',
				'mousemove .chromosome-scrubber': 'handleScrubber',
				'mouseexit .chromosome-scrubber': 'endScrubbing',
				'mouseleave .chromosome-scrubber': 'endScrubbing',
				'mouseup .chromosome-scrubber': 'endScrubbing'
			},
			model: model
		});
		this.template = _.template(mainTemplate);
		this.render();

		this.initial_chromosome_location = initial_chromosome_location;

		this.jumpToLocation(initial_chromosome_location);

		this.clickSfx = game.add.audio("click_hit");
	}

	initialize(){
		this.listenTo(this.model, "change", this.onModelChange);

	}

	onModelChange(){
		game.useBossMove();
		this.render();
	}

	render(){
		var oldScrollTop = $(".beta-inner").css("top");
		var oldIndicatorTop = $(".viewport-indicator").css("top");
		var c1Ahtml = this.template({
			"chromosome": this.model
		});
		this.$el.html(c1Ahtml);
		$(".beta-inner").css({"top": oldScrollTop});
		$(".viewport-indicator").css({"top": oldIndicatorTop});



		var that = this;

		//found online somewhere. Definitely not the backbone way to do it, but
		//i hate solving this problem over and over.
		//custom <select> elements
		this.$el.find('select').each(function(){
	    	var $this = $(this), 
	    		numberOfOptions = $(this).children('option').length;

			$this.addClass('select-hidden'); 
			
			
			var $selected = $this.find(":selected");
			var hasImg = $selected.data("img");

			var $selectWrap = $('<div class="select"></div>');
			if(hasImg) $selectWrap.addClass("image");
			$this.wrap($selectWrap);
		    $this.after('<div class="select-styled"></div>');

		    var $styledSelect = $this.next('div.select-styled');

			if(hasImg) {
				var $selectContent = $('<div class="content"/>')
				$selectContent.append($('<img src="' + $selected.data("img") + '" />'));
				if($this.data('label')) {
					$selectContent.append($('<label/>').text($this.data('label')));
				}
				$styledSelect.append($selectContent);
			} else {
				$styledSelect.removeClass('image').text($selected.text());
			}
			
		  
		    var $list = $('<ul />', {
		        'class': 'select-options'
		    }).insertBefore($styledSelect);
		  
		    for (var i = 0; i < numberOfOptions; i++) {
				var $opt = $this.children('option').eq(i);
		        var $li = $('<li />', {
		            html: $opt.html(),
					rel: $opt.val()
				}).appendTo($list);
				
				if($opt.data("img")) {
					$li.addClass('image').append($('<img src="' + $opt.data("img") + '" />'));
				}
		    }
		  
		    var $listItems = $list.children('li');
		  
		    $styledSelect.click(function(e) {
		        e.stopPropagation();
		        var $currentTarget = $(e.currentTarget);

		        that.newHandleSelectClick($this);


		        var isRel = $currentTarget.closest(".relevant");
		        if(isRel.length == 0){
		        	return false;
		        }


		        $('div.select-styled.active').not(this).each(function(){
		            $(this).removeClass('active').prev('ul.select-options').hide();
		        });
		        $(this).toggleClass('active').prev('ul.select-options').toggle();
		        

		        that.clickSfx.play();
		    });
		  
		    $listItems.click(function(e) {
		        e.stopPropagation();
		        $styledSelect.text($(this).text()).removeClass('active');
		        $this.val($(this).attr('rel'));
		        $list.hide();

				var $target = $this;

				var gene = $target.data("gene");
				var target_gene = _.find(that.model.get("genes"), function(g){
					return g.id == gene
				});

				
				target_gene.has_changed = true;
				target_gene.selected_allele = $target.val();
				that.model.trigger("change");

				
		        that.clickSfx.play();

		    });


        	$(document).click(function() {
		        $styledSelect.removeClass('active');
		        $list.hide();
		    });




		});

		

	}

	handleSelectClick(e){
		var $target = $(e.currentTarget);
		this.jumpToLocation($target.data("location"));

		return false;
	}
	newHandleSelectClick(select){
		this.jumpToLocation(select.data("location"));
		return false;
	}
	updateTRP(e){
		var $target = $(e.currentTarget);
		var modelAttributeName = $target.data("model");
		this.model.set(modelAttributeName, $target.val())
	}
	handleScrubber(e){
		if(this.isScrubbing){
			e.preventDefault();
			var $target = $(e.currentTarget);
			var offset = e.pageY - $target.offset().top;
			var percent = Math.min(.99, Math.max(.01, (offset/$target.height())));

			$(".viewport-indicator").css({"top": "" + (percent * 100) + "%"});

			var betaTop = (percent * $(".beta-inner .full-code").height()) - ($(".beta").height()/2);
			$(".beta-inner").css({"top": -betaTop + "px"});
			return false;
		}
	}

	jumpToLocation(location){
		var percent = Math.min(.99, Math.max(.01, (parseInt(location)/100) ) );


		$(".viewport-indicator").css({"top": "" + (percent * 100) + "%"});

		var betaTop = (percent * $(".beta-inner .full-code").height()) - ($(".beta").height()/2);
			$(".beta-inner").css({"top": -betaTop + "px"});
		// $(".beta-inner").scrollTop(betaTop);
	}
	startScrubbing(e){
		this.isScrubbing = true;
		this.handleScrubber(e);
	}
	endScrubbing(){
		this.isScrubbing = false;
	}
	close(){
		this.$el.hide();
	}

}

export default ChromosomeView;

