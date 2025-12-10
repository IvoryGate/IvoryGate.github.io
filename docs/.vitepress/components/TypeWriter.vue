<template>
  <div class="typer">
    <h3>
      <span>Hello, It's me.</span>
      <br><br>
      <span class="self-introduction">Call Me IvoryGate.</span>
      <br><br>
      <span class="typewriter">{{ message }}</span>
      <span class="mark">_</span>
      <br><br>
      <p>Some of us get dipped in flat, some in satin, some in gloss. But every once in a while you find someone who's iridescent, and when you do, nothing will ever compare.</p>
      <br><br>
      <router-link to="" class="enter-btn">Enter</router-link>
    </h3>
    <img src="./img/xiaolan.jpg" alt="touxiang">
  </div>
<!--  <div class="home_img">-->
<!--  </div>-->
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "JetBrains Mono", monospace;
}
.typer {
  display:flex;
  align-items: center;
  position: relative;
  width: 100%;
  /* height: 100vh; */
  justify-content: center;
  padding: 50px 10% 0;
}
.typer h3{
  max-width: 600px;
  position: relative;
  margin-left: 0;
  margin-top: 0;
  color: #fff;
  font-size: 26px;
  font-weight: 700;
}
.typer h3 .self-introduction{
  font-size: 32px;
  font-weight: 1000;
  color: #b7b2a9;
}
.typer h3 p{
  font-size: 16px;
}
span.mark{
  color:#fff;
  animation: blink 1s ease infinite;
}
@keyframes  blink{
  from,
  to {
    color: transparent;
  }
  50% {
    color: #fff;
  }
}
.typer img{
  max-width: 360px;
  border-radius: 50%;
  margin-left: 80px;
  box-shadow: 0 0 20px #fdc0aa;
  /* opacity: 0; */
  animation: floatImage 4s ease-in-out infinite;
  /* animation: zoomIn 1s ease forwards, floatImage 4s ease-in-out infinite; */
  /* animation-delay: 1s,3s; */
}
/* @keyframes zoomIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
} */
@keyframes floatImage {
  0%{
    transform: translateY(0);
  }
  50%{
    transform: translateY(-24px);
  }
  100%{
    transform: translateY(0);
  }
}
.social-media{
  margin-top: 10px;
}
.social-media .social-link{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
  color: #b7b2a9;
  border-radius: 25%;
}
.social-media .social-link:hover{
  background-color: #b7b2a9;
  color: black;
}
.social-media .social-link .icon{
  width: 40px;
  height: 40px;
}
.enter-btn{
  display: inline-flex;
  flex-direction: column;
  text-decoration: none;
  padding: 8px;
  background: #b7b2a9;
  border-radius: 40px;
  width: 140px;
  box-shadow: 0 0 10px #f9b39d;
  font-size: 16px;
  color:black;
  letter-spacing: 1px;
  font-weight: 600;
  transition: 0.5s ease;
  text-align: center;
}
.enter-btn:active{
  background: none;
  color: #b7b2a9;
  border: 2px solid #b7b2a9;
}
</style>

<script setup lang="ts">
  import { ref } from 'vue'
  const message = ref('');
  // const texts = ref(['Hello, World!','Coding is funny!']);
  const texts = ref(['或许不知是梦的缘故，流离之人追逐幻影。','枕头里藏着发霉的梦，梦里住着无法拥有的人！']);
  let index = 0;
  let charIndex = 0;
  let delta = 300;

  let start = null;
  let isDeleting = false;

  function type(time){
    window.requestAnimationFrame(type);
    if(!start) start = time;
    const progress = time - start;
    if(progress > delta){
      const text = texts.value[index];
      console.log(text);
      if(!isDeleting){
        message.value = text.slice(0,++charIndex);
        delta = 500 - Math.random()*400;
      }else {
        message.value = text.slice(0,charIndex--);
      }
      start = time;
      if(charIndex == text.length){
        isDeleting = true;
        delta = 200;
        start = time + 1200;
      }
      if(charIndex < 0){
        isDeleting = false;
        start = time + 200;
        index = ++index % texts.value.length;
      }
    }
  }

  window.requestAnimationFrame(type);
</script>