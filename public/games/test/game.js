window.Game = {
    ctx: ''

  , run: function() {
        console.log('test game running');

        var ctx = Game.scope.setup(); 
        Game.ctx = ctx;

        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0,0,640,480);

        ctx.fillStyle = 'rgb(200,0,0)';
        ctx.fillRect(10,10,620,460);
    }
}
