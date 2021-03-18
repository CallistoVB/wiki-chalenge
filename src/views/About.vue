<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="test">Test</button>
  </div>
</template>

<script>
export default {
  name: "About",
  methods: {
    async test() {
      const response = await (await fetch('https://fr.wikipedia.org/w/api.php?action=parse&page=Avion&format=json')).json();

      console.log(response)
    }
  },
  mounted() {
    document.getElementById('nav').style.position = "unset"
  }
}
</script>
