<template>
    <div class="nav" id="nav">
      <div class="left">
        <router-link class="brand" to="/">
          <img class="brand_img" src="../assets/cerveau.png" />
          <p class="brand_title">WIKI-CHALENGE</p>
        </router-link>
        <div class="links">
          <router-link class="about" to="/solo">Solo</router-link>
          <router-link class="about" to="/multiplayer">Multiplayer</router-link>
          <router-link class="about" to="/competition">Compétiton</router-link>
          <router-link class="about" to="/about">A propos</router-link>
        </div>
      </div>
      <div class="right">
        right
      </div>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
}
</script>