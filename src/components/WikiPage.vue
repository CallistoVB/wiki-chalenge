<template>
    <iframe id="wikipage" @load="iframeLoad" src="/wikipage/wikipage.html" />
</template>

<script>
export default {
    name: 'WikiPage',
    props: {
        title: String,
        callback: Function,
    },
    data() {
        return {
            wikipage: null,
        }
    },
    methods: {
        iframeLoad() {
            const wikipage = document.getElementById('wikipage');

            wikipage.contentWindow.postMessage({
                    eventId: "loadPage",
                    pageUrlTitle: this.title
                },
                window.location.origin.startsWith("http") ? window.location.origin : "*")
        }
    },
    mounted() {
        window.addEventListener('message', (event) => {
            if(event.origin != location.origin) return;

            switch(event.data.eventId) {
                case 'loadedPage':
                    console.log(event.data.pageId)
            }
        })
    }
}
</script>