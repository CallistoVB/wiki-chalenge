import * as Matter from 'matter-js'

export default (domElement, gravity, box) => {
    const count = 80;
    var width = window.innerWidth
    var height = window.innerHeight;

    var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Events = Matter.Events;

    var render, engine, solid;
    var isMobile = false;

    init()
    animate()
    function init() {
        solid = [];
        isMobile = mobilecheck()

        window.addEventListener('resize', (event) => {
            width = window.innerWidth; height = window.innerHeight;
    
            render.canvas.width = width;
            render.canvas.height = height;

            World.remove(engine.world, solid)
            generateSolid()
            World.add(engine.world, solid)
        });
    }

    function mobilecheck() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    function generateSolid() {
        solid = [
            Bodies.rectangle(width / 2, height / 2, box.offsetWidth, box.offsetHeight, { isStatic: true, render: {fillStyle: 'transparent'} })
        ]
        if(!isMobile) {
            var barLeft = Bodies.rectangle(width / 8, height / 2, width / 4 - 50, 25, {render: {fillStyle: "#F85E00"}, chamfer: {radius: 5}, id: 100 });
            var barRight = Bodies.rectangle(width - width / 8, height / 2, width / 4 - 50, 25, {render: {fillStyle: "#F85E00"}, chamfer: {radius: 5}, id: 101 });

            solid.push(
                barLeft, barRight,
                Constraint.create({
                    pointA: {x : barLeft.position.x, y: barLeft.position.y},
                    bodyB: barLeft,
                    length: 0,
                }),
                Constraint.create({
                    pointA: {x : barRight.position.x, y: barRight.position.y},
                    bodyB: barRight,
                    length: 0,
                })
            )
        } else {
            solid.push([

            ])
        }
    }

    function animate() {
        engine = Engine.create();
        engine.world.gravity.y = gravity
        
        render = Render.create({
            element: domElement,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: 0xffffff
            }
        });

        generateSolid()
        World.add(engine.world, solid)

        const mouse = Matter.Mouse.create(render.canvas)
        const mouseContraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                }   
            }
        })
        mouseContraint.mouse.element.removeEventListener("mousewheel", mouseContraint.mouse.mousewheel);
        mouseContraint.mouse.element.removeEventListener("DOMMouseScroll", mouseContraint.mouse.mousewheel);
        World.add(engine.world, mouseContraint)

        Events.on(engine, 'tick', (event) => {
            if(mouseContraint.body) {
                const obj = mouseContraint.body;

                if(obj.id == 100 || obj.id == 101) {
                    obj.angle += .002
                }
            }
        })
        
        function circle() {
            var x = Common.random(width / 2.5, width / 1.5)
            var sides = Math.round(Common.random(1, 8));
            sides = (sides === 3) ? 4 : sides;
    
            var chamfer = null;
            if (sides > 2 && Common.random() > 0.7) {
                chamfer = {
                    radius: 10
                };
            }
    
            var obj;
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        obj = Bodies.rectangle(x, -50, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
                    } else {
                        obj = Bodies.rectangle(x, -50, Common.random(80, 200), Common.random(25, 30), { chamfer: chamfer });
                    }
                    break;

                case 1:
                    obj = Bodies.polygon(x, -50, sides, Common.random(25, 50), { chamfer: chamfer });
                    break;
            }

            function removeObject(obj) {
                if(obj.position.x > width || obj.position.y > height) {
                    World.remove(engine.world, obj)
                } else {
                    setTimeout(() => removeObject(), 5000)
                }
            }
            setTimeout(() => {removeObject(obj)}, 5000)

            return obj;
        }

        setInterval(() => {
            World.add(engine.world, circle())
        }, 200);

        Engine.run(engine);
        Render.run(render);
    }
}