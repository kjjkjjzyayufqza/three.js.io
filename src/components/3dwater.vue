<template>
  <div>
    hhhhhhhhhh
    <div class="three" id="three"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

export default {
  name: "App",
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      let controls, water, sun, mesh, container, stats;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#eee");

      var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
      });
      // 设置渲染区域尺寸，本质就是设置输出canvas的尺寸
      // 把渲染器的渲染结果canvas对象插入到'pos'对应的div元素中
      renderer.shadowMap.enabled = true;
      container = document.getElementById("three");
      container.appendChild(renderer.domElement);
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.set(200, 200, 400);

      sun = new THREE.Vector3();

      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

      water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          "textures/waternormals.jpg",
          function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
      });

      water.rotation.x = -Math.PI / 2;

      scene.add(water);

      // Skybox

      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const skyUniforms = sky.material.uniforms;

      skyUniforms["turbidity"].value = 10;
      skyUniforms["rayleigh"].value = 2;
      skyUniforms["mieCoefficient"].value = 0.005;
      skyUniforms["mieDirectionalG"].value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180,
      };

      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms["sunPosition"].value.copy(sun);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();

        scene.environment = pmremGenerator.fromScene(sky).texture;
      }

      updateSun();
      updateSun();

      //

      const geometry = new THREE.BoxGeometry(30, 30, 30);
      const material = new THREE.MeshStandardMaterial({ roughness: 0 });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();
      //

      stats = new Stats();
      container.appendChild(stats.dom);

      // GUI

      const gui = new GUI();

      const folderSky = gui.addFolder("Sky");
      folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
      folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
      folderSky.open();

      const waterUniforms = water.material.uniforms;

      const folderWater = gui.addFolder("Water");
      folderWater
        .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
        .name("distortionScale");
      folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
      folderWater.open();

      //

      function animate() {
        controls.update();
        render()
        requestAnimationFrame(animate);
        stats.update();
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
      }
      animate();

      function render() {
        const time = performance.now() * 0.001;

        mesh.position.y = Math.sin(time) * 20 + 5;
        mesh.rotation.x = time * 0.5;
        mesh.rotation.z = time * 0.51;

        water.material.uniforms["time"].value += 1.0 / 60.0;

        renderer.render(scene, camera);
      }
      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var canvasPixelWidth = canvas.width / window.devicePixelRatio;
        var canvasPixelHeight = canvas.height / window.devicePixelRatio;

        const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

    //   const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    //   hemLight.position.set(0, 48, 0);
    //   scene.add(hemLight);

    //   const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    //   //光源等位置
    //   dirLight.position.set(-10, 8, -5);
    //   //可以产生阴影
    //   dirLight.castShadow = true;
    //   dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    //   scene.add(dirLight);

    //   let floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    //   let floorMaterial = new THREE.MeshPhongMaterial({
    //     color: 0x857ebb,
    //     shininess: 0,
    //   });

    //   let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //   floor.rotation.x = -0.5 * Math.PI;
    //   floor.receiveShadow = true;
    //   floor.position.y = -0.001;
    //   scene.add(floor);

    //   controls.enableDamping = true;

    //   animate();
    },
  },
};
</script>

<style>
.three {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
