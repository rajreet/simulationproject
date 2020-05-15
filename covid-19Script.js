//utilities
//1.
function randomNumber(min,max){
    return Math.random()*(max-min)+min;
}

//2.
function randomColor(){
    return `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
}

//3.
function distance(x1,y1,x2,y2){
    xdist=x1-x2;
    ydist=y1-y2;
    return Math.sqrt(xdist*xdist+ydist*ydist);
}

//4.
function radian(theta){
    return (Math.PI/180)*theta;
}

//5.
window.addEventListener('mousemove',function(el){
    mouse.x=el.clientX;
    mouse.y=el.clientY;
})

//setting up the canvas
let canvas=document.querySelector('canvas');
canvas.width=innerWidth;
canvas.height=innerHeight-100;
canvas.style.background='rgb(50,50,50)';

//important variables
let c=canvas.getContext('2d');
let pauseBtn=document.querySelector('#pause');
let resumeBtn=document.querySelector("#resume");
let stopBtn=document.querySelector("#stop");
let lockStage1=document.querySelector("#stage1");
let lockStage2=document.querySelector("#stage2");
let lockStage3=document.querySelector("#stage3");
let lockRemove=document.querySelector("#removeLockdown");
let days=document.querySelector("#days");
let infected=document.querySelector("#total-cases");
let deaths=document.querySelector("#total-deaths");
let mouse={
    x: canvas.width,
    y: canvas.height
};
let requestId=0;
let pause=0;
let resume=1;
let stop=0;
let populationSize=2000;                                                 //changable
let personSize=2;                                                        //changable
let range=1;                                                             //changable
let leftBoundary=canvas.width/4,rightBoundary=canvas.width*3/4;          //changable
let horizontalUnitLand=(rightBoundary-leftBoundary)/3;
let verticalUnitLand=(canvas.height)/3;
covid={
    infectiveDistance: personSize*2+range,
    R0: 0.2,
    infectedCount: 0,
    deathCount: 0
};
lockdown={
    stage1: 0,
    stage2: 0,
    stage3: 0
};
time={
    dayLength: 24,                                                        //changable
    hours: 0,
    day: 0
};

//program utilities
function forwardTime(){
    if(time.hours==time.dayLength){
        time.hours=0;
        time.day++;
    }
    else
        time.hours++;
}

boundaries={
    stage1Left: [0,rightBoundary,leftBoundary],
    stage1Right: [leftBoundary,canvas.width,rightBoundary],
    stage2Left: [0,rightBoundary,leftBoundary+horizontalUnitLand,leftBoundary,rightBoundary-horizontalUnitLand],
    stage2Right: [leftBoundary,canvas.width,rightBoundary-horizontalUnitLand,leftBoundary+horizontalUnitLand,rightBoundary],
    stage3Left: [0,rightBoundary,leftBoundary+horizontalUnitLand,leftBoundary+horizontalUnitLand,leftBoundary+horizontalUnitLand,leftBoundary,rightBoundary-horizontalUnitLand,leftBoundary,rightBoundary-horizontalUnitLand,leftBoundary,rightBoundary-horizontalUnitLand],
    stage3Right: [leftBoundary,canvas.width,rightBoundary-horizontalUnitLand,rightBoundary-horizontalUnitLand,rightBoundary-horizontalUnitLand,leftBoundary+horizontalUnitLand,rightBoundary,leftBoundary+horizontalUnitLand,rightBoundary,leftBoundary+horizontalUnitLand,rightBoundary],
    stage3Top: [0,0,verticalUnitLand,0,2*verticalUnitLand,verticalUnitLand,verticalUnitLand,0,0,2*verticalUnitLand,2*verticalUnitLand],
    stage3Bottom: [canvas.height,canvas.height,2*verticalUnitLand,verticalUnitLand,canvas.height,2*verticalUnitLand,2*verticalUnitLand,verticalUnitLand,verticalUnitLand,canvas.height,canvas.height],
    drawBoundaries: function(){
        if(lockdown.stage1==1){
            c.beginPath();
            c.strokeStyle='rgba(200,200,200,1)';
            c.moveTo(leftBoundary,0);
            c.lineTo(leftBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(rightBoundary,0);
            c.lineTo(rightBoundary,canvas.height);
            c.stroke();
            c.closePath();
        }   
        else if(lockdown.stage2==1){
            c.beginPath();
            c.strokeStyle='rgba(200,200,200,1)';
            c.moveTo(leftBoundary,0);
            c.lineTo(leftBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(rightBoundary,0);
            c.lineTo(rightBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.strokeStyle='rgba(200,200,200,0.5)';
            c.moveTo(leftBoundary+horizontalUnitLand,0);
            c.lineTo(leftBoundary+horizontalUnitLand,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(rightBoundary-horizontalUnitLand,0);
            c.lineTo(rightBoundary-horizontalUnitLand,canvas.height);
            c.stroke();
            c.closePath();
        } 
        else if(lockdown.stage3==1){
            c.beginPath();
            c.strokeStyle='rgba(200,200,200,1)';
            c.moveTo(leftBoundary,0);
            c.lineTo(leftBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(rightBoundary,0);
            c.lineTo(rightBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.strokeStyle='rgba(200,200,200,0.5)';
            c.moveTo(leftBoundary+horizontalUnitLand,0);
            c.lineTo(leftBoundary+horizontalUnitLand,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(rightBoundary-horizontalUnitLand,0);
            c.lineTo(rightBoundary-horizontalUnitLand,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(leftBoundary,verticalUnitLand);
            c.lineTo(rightBoundary,verticalUnitLand);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(leftBoundary,2*verticalUnitLand);
            c.lineTo(rightBoundary,2*verticalUnitLand);
            c.stroke();
            c.closePath();
        }
        else{
            c.beginPath();
            c.strokeStyle='rgb(200,200,200,0.3)';
            c.moveTo(leftBoundary,0);
            c.lineTo(leftBoundary,canvas.height);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.strokeStyle='rgb(200,200,200,0.3)';
            c.moveTo(rightBoundary,0);
            c.lineTo(rightBoundary,canvas.height);
            c.stroke();
            c.closePath();
        }
    }
}

function nativeLand(x,y){
    if(lockdown.stage1==1){
        let noOfRegions=boundaries.stage1Left.length;
        for(let i=0;i<noOfRegions;i++){
            if(x>=boundaries.stage1Left[i] && x<=boundaries.stage1Right[i])
                return [0,boundaries.stage1Right[i],canvas.height,boundaries.stage1Left[i]];
        }
    }
    else if(lockdown.stage2==1){
        let noOfRegions=boundaries.stage2Left.length;
        for(let i=0;i<noOfRegions;i++){
            if(x>=boundaries.stage2Left[i] && x<=boundaries.stage2Right[i])
                return [0,boundaries.stage2Right[i],canvas.height,boundaries.stage2Left[i]];
        }
    }
    else if(lockdown.stage3==1){
        let noOfRegions=boundaries.stage3Top.length;
        for(let i=0;i<noOfRegions;i++){
            if(x>=boundaries.stage3Left[i] && x<=boundaries.stage3Right[i] && y>=boundaries.stage3Top[i] && y<=boundaries.stage3Bottom[i])
                return [boundaries.stage3Top[i],boundaries.stage3Right[i],boundaries.stage3Bottom[i],boundaries.stage3Left[i]];
        }
    }
    else{
        return [0,canvas.width,canvas.height,0];
    }
}

pauseBtn.addEventListener('click',function(el){
    pause=1;
    resume=0;
    stop=0;
});
resumeBtn.addEventListener('click',function(el){
    pause=0;
    resume=1;
    stop=0;
});
stopBtn.addEventListener('click',function(el){
    pause=0;
    resume=0;
    stop=1;
});

lockStage1.addEventListener('click',function(el){
    lockdown.stage1=1;
    lockdown.stage2=0;
    lockdown.stage3=0;
});
lockStage2.addEventListener('click',function(el){
    lockdown.stage1=0;
    lockdown.stage2=1;
    lockdown.stage3=0;
});
lockStage3.addEventListener('click',function(el){
    lockdown.stage1=0;
    lockdown.stage2=0;
    lockdown.stage3=1;
});
lockRemove.addEventListener('click',function(el){
    lockdown.stage1=0;
    lockdown.stage2=0;
    lockdown.stage3=0;
});

class Person{
    constructor(x,y,r,color){
        this.x=x;
        this.y=y;
        this.r=r;
        this.state=color;
    }
    infected()
    {
        if(this.state!==1)
        {
            this.state=1;
            covid.infectedCount++;
        }
    }
    move(){
        this.x+=Math.round(Math.random()*2-1);
        this.y+=Math.round(Math.random()*2-1);
        let boundary=nativeLand(this.x,this.y);
        if(this.x>boundary[1]-(personSize+range))
            this.x+=-(personSize+range);
        if(this.x<boundary[3]+personSize+range)
            this.x+=(personSize+range);
        if(this.y>boundary[2]-(personSize+range))
            this.y+=-(personSize+range);
        if(this.y<boundary[0]+(personSize+range))
            this.y+=(personSize+range);
        this.draw();
    }
    draw(){
        c.beginPath();
        if(this.state===0)
            c.fillStyle='rgb(0,255,0)';
        else if(this.state===1)
            c.fillStyle='rgb(255,0,0)';
        c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }

    isInfected()
    {
        return this.state===1;
    }
}

//Creating the particles/objects
let population=[];
for(let i=0;i<populationSize;i++){
    let x=randomNumber(personSize+1,canvas.width-(personSize+range));
    let y=randomNumber(personSize+1,canvas.height-(personSize+range));
    let r=personSize;
    let color=0;

    // if(i%200===0)
    //   color=1;
    
    population.push(new Person(x,y,r,color));

    // if(i%200===0)
    //   population[i].infected();
}

for(let i=0;i<populationSize;i++){
    if(i%200===0)
      population[i].infected();
}

function checkRadius(person1,person2)
{
    if(person2.x>=person1.x-person1.r && person2.x<=person1.x+person1.r)
    {
        if(person2.y>=person1.y-person1.r && person2.y<=person1.y+person1.r)
            return true;
    }

    return false;
}

//Animate Function
function animate(){
    if(stop==1){
        window.cancelAnimationFrame(requestId);
        return;
    }
    else if(pause==1){
        requestId=window.requestAnimationFrame(animate);
        return;
    }
    else if(resume==1){
        requestId=window.requestAnimationFrame(animate);
        c.clearRect(0,0,canvas.width,canvas.height);
        forwardTime();
        days.innerHTML="Days - "+time.day;
        infected.innerHTML="Total Infected - "+covid.infectedCount;
        deaths.innerHTML="Total Deaths - "+covid.deathCount;
        boundaries.drawBoundaries();

        for(let i=0;i<populationSize;i++)
        {
            //new infections arise 0.001%
            // var rand=Math.floor(Math.random() * 10000) + 1;

            // if(rand===1)
            // {
            //     population[i].infected();
                
            // }

            population[i].move();

            if(population[i].isInfected())
            {
                console.log(i);
                for(let j=0;j<populationSize;j++)
                {
                    if(checkRadius(population[i],population[j]))
                    {
                        //infection rate 20%
                        var rand2=Math.floor(Math.random() * 100) + 1;
                        
                        if(rand2<=20)
                            population[j].infected();

                    }
                }
            }
        }
    }
}
animate();