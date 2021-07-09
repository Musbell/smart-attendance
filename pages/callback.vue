<template>
  <div>
    <client-only>
      <particles
        color="#FFB300"
        :particles-number="20"
        shape-type="star"
        :particle-size="3"
        movement-direction="top"
        lines-color="#FFB300"
        :line-linked="true"
        :move-speed="0.75"
      />
    </client-only>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card style='z-index: 1' color='transparent' class='my-10'>
          <div style='width: 50%; margin: auto'>
            <v-img
              position='center'
              lazy-src="https://res.cloudinary.com/musbell/image/upload/v1625836513/karota_logo-removebg-preview_wbacaf.png"
              max-width="250"
              src="https://res.cloudinary.com/musbell/image/upload/v1625836513/karota_logo-removebg-preview_wbacaf.png"
            ></v-img>
          </div>
          <v-card-text>
           <v-container>
             <div style="min-height: 4px;">
               <v-progress-linear
                 v-model="value"
                 :active="show"
                 :indeterminate="query"
                 :query="true"
                 color="orange"
                 rounded
               ></v-progress-linear>
             </div>
           </v-container>
            <p style='text-align: center'> Loading...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Particles from '~/components/Particles'
export default {
  name: 'Callback',
  components: { Particles },
  layout: 'authenticate',
  auth: false,
  data () {
    return {
      value: 0,
      query: false,
      show: true,
      interval: 0,
    }
  },

  mounted () {
    this.queryAndIndeterminate()
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    queryAndIndeterminate () {
      this.query = true
      this.show = true
      this.value = 0

      setTimeout(() => {
        this.query = false

        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval)
            this.show = false
            return setTimeout(this.queryAndIndeterminate, 2000)
          }
          this.value += 25
        }, 1000)
      }, 2500)
    },
  },
}
</script>
<style lang="scss">
div[id^="particles-instance-"] {
  height: 100vh !important;
  width: 100vw !important;
  position: fixed !important;
  top: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  z-index: 1 !important;
}
</style>


