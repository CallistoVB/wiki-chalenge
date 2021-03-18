<template>
  <div class="home">
    <div class="header">
      <div id="box" class="box">
        <h1 class="title">Wiki-Chalenge</h1>
        <p>
          Wiki-Chalenge est un jeu en ligne où le but est d'aller à une page
          demander juste avec les liens cliquables de Wikipédia<br />Trois modes
          sont disponibles :<br />
          - Solo : Jouer tout seul<br />
          - Multiplayer : Jouer avec vos amis<br />
          - Concours : Essayer de battre les records sur des trajet définis
        </p>
      </div>
      <div class="particule" id="particule" />
    </div>

    <div class="intro">
      <div class="item">
        
      </div>
      <div class="item">
        sqdqsdqsd
      </div>
      <div class="item">
        skdmsdfkdsf
      </div>
    </div>
  </div>
</template>

<script>
import Liquid from "../scripts/Liquid";

export default {
  name: 'Home',
  mounted() {
    Liquid(document.getElementById("particule"), 0.5, document.getElementById('box'));
  
    document.getElementById('nav').style.position = "absolute"
  },
};
</script>