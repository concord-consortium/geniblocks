import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000000'
    // this.fontsReady = false
    // this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    //game.time.advancedTiming = true;
    // WebFont.load({
    //   google: {
    //     families: ['Bangers']
    //   },
    //   active: this.fontsLoaded
    // })

    // let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    // text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }
  create(){
      this.state.start('Splash')
    
  }
  render () {
    // if (this.fontsReady) {
    // }
  }

  fontsLoaded () {
    // this.fontsReady = true
  }

}
