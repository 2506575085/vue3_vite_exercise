<template>

</template>

<script setup lang="ts">
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(0, 0, 100)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const scene = new THREE.Scene();

function drawLine() {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  renderer.render(scene, camera)
}
drawLine()

function drawCube() {
  const geometry = new THREE.BoxGeometry(10,10,10)
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    // cube.material.color.set(cube.material.color.getHex()+0x1)
    renderer.render(scene, camera)
  }
  animate()
}
drawCube()


// import * as THREE from 'three'

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// )
// camera.position.z = 2

// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     wireframe: true,
// })

// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }

// function animate() {
//     requestAnimationFrame(animate)

//     cube.rotation.x += 0.01
//     cube.rotation.y += 0.01

//     render()
// }

// function render() {
//     renderer.render(scene, camera)
// }

// animate()

</script>

<style scoped lang="less">
</style>