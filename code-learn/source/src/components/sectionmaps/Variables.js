import React, { useEffect, useRef, useState } from "react";
import SectionMap from "./SectionMap";
import routes from "../../routes";
import { Link } from "react-router-dom";
import progress from "../../utils/progress";
import Matter from "matter-js";

function catapault() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Vector = Matter.Vector;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            background: "transparent",
            wireframeBackground: "transparent",
            wireframes: false,
            width: 800,
            height: 600,
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();

    // add bodies
    var group = Body.nextGroup(true);

    var stack = Composites.stack(250, 255, 1, 6, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 30, 30);
    });

    var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });
    const ball = Bodies.circle(560, 100, 50, { density: 0.005, render: {fillStyle: 'green'} });
    Composite.add(world, [
        stack,
        catapult,
        Bodies.rectangle(-100, 300, 200, 620, { isStatic: true, render: { visible: false } }), // left
        Bodies.rectangle(400, -100, 800, 200, { isStatic: true, render: { visible: false } }), // top
        Bodies.rectangle(900, 300, 200, 620, { isStatic: true, render: { visible: false } }), // right
        Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: '#060a19' } }),
        Bodies.rectangle(250, 555, 20, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
        Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),
        ball,
        Constraint.create({ 
            bodyA: catapult, 
            pointB: Vector.clone(catapult.position),
            stiffness: 1,
            length: 0
        })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        objects: [stack, catapult, ball],
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

export const Variables = () => {
    const canvasContainer = useRef(null);
    const [physics,] = useState(() => catapault());
    const partsCompleted = progress.getSectionPartsCompleted("variables");
    progress.useProgress();

    useEffect(() => {
        var rect = canvasContainer.current.getBoundingClientRect();
        physics.canvas.width = rect.width;
        physics.canvas.height = rect.height;
        physics.render.options.width = rect.width;
        physics.render.options.height = rect.height;
        canvasContainer.current?.appendChild(physics.canvas);
    });
    const sectionProgress = progress.getSectionProgress("variables");
    useEffect(() => {
        Matter.Composite.allBodies(physics.objects[0]).map(body => body.render.visible = partsCompleted[0]);
        physics.objects[1].render.visible = partsCompleted[1];
        physics.objects[2].render.visible = partsCompleted[2];
        if (sectionProgress >= 100) {
            console.log("run", sectionProgress)
            Matter.Runner.run(physics.runner, physics.engine);
        } else {
            console.log("stop", sectionProgress)
            Matter.Runner.stop(physics.runner);
        }
    }, [sectionProgress])

    return (
        <SectionMap
            title="Variables"
            icon="box"
            style={{ position: "relative" }}
            sectionName="variables"
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                ref={canvasContainer}
            />
        </SectionMap>
    );
};
export default Variables;
