<template>
<div class="photocarousel">
  <div id="wrap" ref="oWrap">
    <img src="./img/photosDisplay/bemd.jpg" alt="" />
    <img src="./img/photosDisplay/gtxy.jpg" alt="" />
    <img src="./img/photosDisplay/hya.jpg" alt="" />
    <img src="./img/photosDisplay/mll.jpg" alt="" />
    <img src="./img/photosDisplay/bemd.jpg" alt="" />
    <img src="./img/photosDisplay/gtxy.jpg" alt="" />
    <img src="./img/photosDisplay/hya.jpg" alt="" />
    <img src="./img/photosDisplay/mll.jpg" alt="" />
  </div>
</div>
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.photocarousel{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  perspective: 1000px;
  justify-content: center;
  align-items: center;
}
#wrap{
  align-items: center;
  width: 120px;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  animation: Spin 20s infinite linear;
}
@keyframes Spin {
  0%{
    transform: rotateY(0deg);
  }
  100%{
    transform: rotateY(360deg);
  }
}
#wrap img{
  position: absolute;
  left: 0;
  width: 133px;
  height: 200px;
  object-fit: cover;
  box-shadow: 0 0 10px #000;
  -webkit-box-reflect: below 5px -webkit-linear-gradient(top,rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 100%);
  border-radius: 5px;
  transform:rotateY(0deg) translateZ(0px);
  transition: 1s 1s;
}
</style>
<script setup lang="ts">
  import {ref,onMounted} from 'vue'
  const oWrap = ref(null);
  onMounted(()=>{
    console.log(oWrap.value)
    const aImg = oWrap.value.getElementsByTagName('img');
    function mTop(){
      const H = document.documentElement.clientWidth;
      // oWrap.value.style.marginTop = H/2 - 170 + "px"
    }
    mTop();
    window.onresize = mTop();

    let len = aImg.length;
    let Deg = 360/len;
    for(let i=0;i<len;i++){
      aImg[i].style.transform = "rotateY("+i*Deg+"deg) translateZ(350px)";
      aImg[i].style.transition = "1s " +(len-1-i)*0.1 +"s";
    }
  })
</script>
