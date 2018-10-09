import { _ } from 'underscore';
import $ from 'jquery';
import { View } from 'backbone';

const mainTemplate = require('html-loader!../templates/sizeTutorialTemplate.html')

class SizeTutorialView extends View {
	constructor ({model, game, state, closeCallback}){
		super({
			events: {
				'click .prev': 'prevPage',
				'click .next': 'nextPage',
				'click .finish': 'finish',
				'click .close': 'close'
			},
			model: model
		});
		this.game = game;
		this.state = state;
		this.closeCallback = closeCallback;
		this.template = mainTemplate;
		this.render();
        // this.clickSfx = game.add.audio("click_hit");

	}
	initialize(){
	}
	render(){
		var appTemplate = _.template(this.template);
		var html = appTemplate({"pages": this.model});
		this.$el.addClass(this.className);
		this.$el.html(html);

		this.$allPages = this.$el.find(".page");
		this.$currentPage = this.$allPages.first();
		this.pageIndex = 0;
		this.setAction(true);
	}
	prevPage(){
		this.setAction(false);
		this.$currentPage.hide();
		this.$currentPage = this.$currentPage.prev();
		this.$currentPage.show();
		--this.pageIndex;
		this.setAction(true);
	}
	nextPage(){
		this.setAction(false);
		this.$currentPage.hide();
		this.$currentPage = this.$currentPage.next();
		this.$currentPage.show();
		++this.pageIndex;
		this.setAction(true);
	}
	close(){
		this.setAction(false);
		this.closeCallback();
		this.game.input.enabled = true;
	}
	finish(){
		this.$currentPage.hide();
		this.$currentPage = this.$allPages.first();

		//this.$el.hide();
		this.close();
		this.pageIndex = 0;
		this.$currentPage.show();
	}
	setAction(on) {
		var page = this.model[this.pageIndex];
		if(page.action) {
			switch(page.action) {
				case "highlight_chromoscope":
					this.state.highlightChromoscope(on);
					break;
				case "highlight_drake":
					this.state.highlightDrake(on);
					break;
				case "highlight_build":
					this.state.highlightBuild(on);
					break;
					
				default: 
					break;
			}
		}
	}
}

export default SizeTutorialView;

