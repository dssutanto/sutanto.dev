// import three from 'https://cdn.skypack.dev/three';
// import * as THREE from "./node_modules/three/build/three.module.js";
// import { TWEEN } from "./node_modules/three/examples/jsm/libs/tween.module.min.js";
// import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { projects } from "./projects.js";
import { resume } from "./resume.js";

// const THREE = await import ('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js');
// const GLTFLoader = await import('https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js');
const TWEEN = await import('https://cdn.skypack.dev/@tweenjs/tween.js');


var nightMode, currentMode, daytime, nighttime;

nightMode = true;

nighttime = {
    background: 0x002135,
    accent: 0x005e97
};

daytime = {
    background: 0x005e97,
    accent: 0x002135
};

currentMode = nighttime;

function updateMode(mode) {
    mode ? currentMode = nighttime : currentMode = daytime;
    renderer.setClearColor(currentMode.background);
    scene.fog = new THREE.Fog(currentMode.background, 1, 5000);
    plane.material = new THREE.MeshBasicMaterial({
        color: currentMode.accent,
        wireframe: true
    });
    projects.map((project) => project.model.traverse((node) => {
        if (node.isMesh) node.material = new THREE.MeshBasicMaterial({
            color: currentMode.accent,
            wireframe: true
        });
    }));
}

var currentJob = 0;
document.querySelector("#job").innerHTML = resume[0];

setInterval(function () {
    document.querySelector("#job").classList.add("invisible");
    document.querySelector("#job").classList.remove("visible");
    setTimeout(function () {
        currentJob == resume.length - 1 ? currentJob = 0 : currentJob++;
        document.querySelector("#job").innerHTML = resume[currentJob];
        setTimeout(function () {
            document.querySelector("#job").classList.add("visible");
            document.querySelector("#job").classList.remove("invisible");
        }, 375);
    }, 375);
}, 5000);

var currentProject = 0;

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 25000);
camera.position.set(0, 500, 3000);

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(currentMode.background, 1, 5000);

var planeGeo = new THREE.PlaneBufferGeometry(10000, 10000, 50, 50);
var plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
    color: currentMode.accent,
    wireframe: true
}));

scene.add(plane);

plane.rotation.x = Math.PI * 0.5;

var renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(currentMode.background, 1);

document.body.appendChild(renderer.domElement);

// LOAD MODELS
const loader = new THREE.GLTFLoader();

projects.map((project) => {
    loader.load(project.url, function (gltf) {
        project.model = gltf.scene;
        project.model.traverse((node) => {
            if (node.isMesh) {
                node.material = new THREE.MeshBasicMaterial({
                    color: currentMode.accent,
                    wireframe: true
                });
            }
        });
        project.model.position.y = 5000;
    });
});

// SHOW PROJECTS
document.querySelector("#view").addEventListener("click", function () {
    document.querySelector("#title").classList.add("invisible");
    document.querySelector("#title").classList.remove("visible");
    document.querySelector("#subtitle").classList.add("invisible");
    document.querySelector("#subtitle").classList.remove("visible");
    document.querySelector("#job").classList.add("invisible");
    document.querySelector("#job").classList.remove("visible");
    document.querySelector("#view").classList.add("invisible");
    document.querySelector("#view").classList.remove("visible");
    document.querySelector("#gh").classList.add("invisible");
    document.querySelector("#gh").classList.remove("visible");
    document.querySelector("#mail").classList.add("invisible");
    document.querySelector("#mail").classList.remove("visible");
    scene.add(projects[currentProject].model);
    let tween = new TWEEN.Tween({ x: 0, y: 5000, z: 0 }).to({ x: 0, y: 750, z: 0 }, 375);
    tween.onUpdate(function (object) {
        projects[currentProject].model.position.set(object.x, object.y, object.z);
    });
    setTimeout(function () {
        document.querySelector(".landing").style.top = "75%";
        document.querySelector("#title").innerHTML = projects[currentProject].title;
        document.querySelector("#subtitle").querySelector(".text").style.display = "none";
        document.querySelector(".demo").querySelector(".text").innerHTML = projects[currentProject].desc;
        document.querySelector(".demo").style.display = "inline-block";
        document.querySelector(".demo").href = projects[currentProject].link;
        document.querySelector("#job").style.display = "none";
        document.querySelector("#contact").style.display = "none";
        setTimeout(function () {
            tween.start();
            document.querySelector("#title").classList.add("visible");
            document.querySelector("#title").classList.remove("invisible");
            document.querySelector("#subtitle").classList.add("visible");
            document.querySelector("#subtitle").classList.remove("invisible");
            document.querySelector("#prev").classList.add("visible");
            document.querySelector("#prev").classList.remove("invisible");
            document.querySelector("#next").classList.add("visible");
            document.querySelector("#next").classList.remove("invisible");
            document.querySelector("#back").classList.add("visible");
            document.querySelector("#back").classList.remove("invisible");
            document.body.style.cursor = "grab";
        }, 375);
    }, 375);
});

// RETURN HOME
document.querySelector("#back").addEventListener("click", function () {
    document.querySelector("#title").classList.add("invisible");
    document.querySelector("#title").classList.remove("visible");
    document.querySelector("#subtitle").classList.add("invisible");
    document.querySelector("#subtitle").classList.remove("visible");
    document.querySelector("#prev").classList.add("invisible");
    document.querySelector("#prev").classList.remove("visible");
    document.querySelector("#next").classList.add("invisible");
    document.querySelector("#next").classList.remove("visible");
    document.querySelector("#back").classList.add("invisible");
    document.querySelector("#back").classList.remove("visible");
    let tween = new TWEEN.Tween({ x: 0, y: 750, z: 0 }).to({ x: 0, y: 5000, z: 0 }, 375);
    tween.onUpdate(function (object) {
        projects[currentProject].model.position.set(object.x, object.y, object.z);
    });
    tween.start();
    document.body.style.cursor = "default";
    setTimeout(function () {
        scene.remove(projects[currentProject].model);
        document.querySelector(".landing").style.top = "50%";
        document.querySelector("#title").innerHTML = "Derrick Sutanto";
        document.querySelector("#subtitle").querySelector(".text").style.display = "block";
        document.querySelector(".demo").style.display = "none";
        setTimeout(function () {
            document.querySelector("#job").style.display = "block";
            document.querySelector("#contact").style.display = "inline-block";
            document.querySelector("#title").classList.add("visible");
            document.querySelector("#title").classList.remove("invisible");
            document.querySelector("#subtitle").classList.add("visible");
            document.querySelector("#subtitle").classList.remove("invisible");
            // document.querySelector("#job").classList.add("visible");
            // document.querySelector("#job").classList.remove("invisible");
            document.querySelector("#view").classList.add("visible");
            document.querySelector("#view").classList.remove("invisible");
            document.querySelector("#gh").classList.add("visible");
            document.querySelector("#gh").classList.remove("invisible");
            document.querySelector("#mail").classList.add("visible");
            document.querySelector("#mail").classList.remove("invisible");
        }, 375);
    }, 375);
});

// NAVIGATE PROJECTS
function navigate(direction) {
    document.querySelector("#title").classList.add("invisible");
    document.querySelector("#title").classList.remove("visible");
    document.querySelector("#subtitle").classList.add("invisible");
    document.querySelector("#subtitle").classList.remove("visible");
    let x1, x2;
    if (direction == "prev") {
        x1 = 5000;
        x2 = -5000;
    } else {
        x1 = -5000;
        x2 = 5000;
    }
    let tweenOld = new TWEEN.Tween({ x: 0, y: 750, z: 0 }).to({ x: x1, y: 750, z: 0 }, 375);
    tweenOld.onUpdate(function (object) {
        projects[currentProject].model.position.set(object.x, object.y, object.z);
    });
    tweenOld.start();
    setTimeout(function () {
        scene.remove(projects[currentProject].model);
        projects[currentProject].model.position.set(0, 5000, 0);
        if (direction == "prev") {
            currentProject == 0 ? currentProject = projects.length - 1 : currentProject--
        } else {
            currentProject == projects.length - 1 ? currentProject = 0 : currentProject++;
        }
        document.querySelector("#title").innerHTML = projects[currentProject].title;
        document.querySelector(".demo").querySelector(".text").innerHTML = projects[currentProject].desc;
        document.querySelector(".demo").href = projects[currentProject].link;
        setTimeout(function () {
            scene.add(projects[currentProject].model);
            projects[currentProject].model.position.set(x2, 750, 0);
            let tweenNew = new TWEEN.Tween({ x: x2, y: 750, z: 0 }).to({ x: 0, y: 750, z: 0 }, 375);
            tweenNew.onUpdate(function (object) {
                projects[currentProject].model.position.set(object.x, object.y, object.z);
            });
            tweenNew.start();
            document.querySelector("#title").classList.add("visible");
            document.querySelector("#title").classList.remove("invisible");
            document.querySelector("#subtitle").classList.add("visible");
            document.querySelector("#subtitle").classList.remove("invisible");
        }), 375;
    }, 375);
}

document.querySelector("#prev").addEventListener("click", function (e) {
    navigate(e.target.id);
});

document.querySelector("#next").addEventListener("click", function (e) {
    navigate(e.target.id);
});

// MANIPULATE OBJECTS
var isDragging = false;

function toRadians(n) {
    return n * Math.PI / 180;
}

var previousMousePosition = {
    x: 0,
    y: 0
};

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    document.body.style.cursor = "grabbing";
}

function drag(e) {
    e.preventDefault();
    var deltaMove = { x: 0, y: 0 }
    if (e.type == "touchmove") {
        let touch = e.touches[0] || e.changedTouches[0];
        let target = document.elementFromPoint(touch.clientX, touch.clientY);
        e.offsetX = touch.clientX - target.getBoundingClientRect().x;
        e.offsetY = touch.clientY - target.getBoundingClientRect().y;
    }

    deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
    };

    if (isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        projects[currentProject].model.quaternion.multiplyQuaternions(deltaRotationQuaternion, projects[currentProject].model.quaternion);
        // } else {
        //     var deltaRotationQuaternion = new THREE.Quaternion()
        //         .setFromEuler(new THREE.Euler(
        //             toRadians(deltaMove.y * 0.05),
        //             toRadians(deltaMove.x * 0.05),
        //             0,
        //             'XYZ'
        //         ));

        //     projects[currentProject].model.quaternion.multiplyQuaternions(deltaRotationQuaternion, projects[currentProject].model.quaternion);

    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
}

function endDrag(e) {
    e.preventDefault();
    isDragging = false;
    document.body.style.cursor = "grab";
}

renderer.domElement.addEventListener('mousedown', function (e) {
    startDrag(e);
});

renderer.domElement.addEventListener('touchstart', function (e) {
    startDrag(e);
});

renderer.domElement.addEventListener('mousemove', function (e) {
    drag(e);
});

renderer.domElement.addEventListener('touchmove', function (e) {
    drag(e);
});

renderer.domElement.addEventListener('mouseup', function (e) {
    endDrag(e);
});

renderer.domElement.addEventListener('touchend', function (e) {
    endDrag(e);
});

// var vertexHeight = 1500;

// ANIMATE WAVES
var myZ = [];
var vertices = plane.geometry.attributes.position;

function updatePlane() {
    for (var i = 0; i < vertices.array.length; i += 3) {
        vertices.array[i + 2] += Math.random() * 150 - 150;
        myZ.push(vertices.array[i + 2]);
    }
};
updatePlane();

var count = 0
function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();
    // controls.update();
    // camera.position.z -= 150;
    // var x = camera.position.x;
    // var z = camera.position.z;
    // camera.position.x = x * Math.cos(0.001) + z * Math.sin(0.001) - 10;
    // camera.position.z = z * Math.cos(0.001) - x * Math.sin(0.001) - 10;
    // camera.lookAt(new THREE.Vector3(0, 8000, 0))

    for (var i = 0; i < vertices.array.length; i += 3) {
        vertices.array[i + 2] = Math.sin(i + count * 0.025) * (myZ[Math.floor(i / 3)] - (myZ[Math.floor(i / 3)] * 2));
        plane.geometry.attributes.position.needsUpdate = true;
    }
    count++;
    renderer.render(scene, camera);
}

animate();

// RESPONSIVENESS
document.querySelector("#mode").addEventListener("click", function () {
    nightMode = !nightMode;
    updateMode(nightMode);
});

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}