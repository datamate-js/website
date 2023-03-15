
function setup()
{
	createCanvas(windowWidth, windowHeight);
    Datamate.make('日付', ['2021/1','2021/2','2021/3','2021/4','2021/5','2021/6','2021/7','2021/8','2021/9','2021/10','2021/11','2021/12']);
	Datamate.make('月ごとの降水量', [118.5,194.5,69.5,92.0,163.5,893.5,337.5,109.5,241.0,107.5,92.5,66.0]);
	Datamate.play(1.0);
}

function draw()
{
	background(255);
	stroke(0);
	strokeWeight(1);
	fill(0);

	const count = Datamate.current('月ごとの降水量', true, 1, 100);
	for (let i=0; i<count; i++) {
		const x = map(random(), 0, 1, -100, width);	//　iを100-widthの値に換算する。
		line(x + 100, 0, x, height);
	}
}
