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
   <v-app-bar flat color='transparent'>
     <v-img
       position='center'
       lazy-src="https://res.cloudinary.com/musbell/image/upload/v1625836513/karota_logo-removebg-preview_wbacaf.png"
       max-width="70"
       src="https://res.cloudinary.com/musbell/image/upload/v1625836513/karota_logo-removebg-preview_wbacaf.png"
     ></v-img>
     <v-toolbar-title>Staff Attendance</v-toolbar-title>
     <v-spacer></v-spacer>
     <v-btn icon @click='$router.push("/")'>
       <v-icon>mdi-home</v-icon>
     </v-btn>
   </v-app-bar>
   <v-row justify="center" align="center" class='mt-2'>
     <v-col cols="12" sm="8" md="4">
       <v-card
         class="mx-auto"
         flat
         color='transparent'
       >
         <div v-if="loading" class="loading-indicator">
           Loading...
         </div>
         <qrcode-stream v-if="!destroyed" :key="_uid" :camera='camera' :track="paintCenterText" @decode='onDecode' @init="onInit">
           <div v-show="showScanConfirmation" class="scan-confirmation">
             <img src="https://res.cloudinary.com/musbell/image/upload/v1593962985/5d4d82ec574a788542d8e1e9_success-2-once_fayepz.gif" alt="Checkmark"  />
           </div>
         </qrcode-stream>
         <v-card-text>
           <p class="decode-result">Staff ID: <b>{{ result }}</b></p>
         </v-card-text>
       </v-card>
     </v-col>
     <v-col cols="12" sm="8" md="8">
       <v-card
         class="mx-auto"
         color='transparent'
         height='500'
         elevation='5'
         rounded
       >
         <v-img
           height="500"
           src="https://res.cloudinary.com/musbell/image/upload/v1625850827/2c6884_53d196003ef84b7eaf535640b426b016_mv2_h0t4lb.gif"
         ></v-img>
       </v-card>
     </v-col>
   </v-row>
 </div>
</template>
<script>
import Particles from '~/components/Particles'
export default {
  name: 'Attendance',
  components: {
    Particles,
  },
  layout: 'authenticate',
  auth: false,
  data () {
    return {
      loading: false,
      destroyed: false,
      camera: 'auto',
      result: null,
      showScanConfirmation: false
    }
  },
  methods: {
    paintCenterText (detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode
        console.log(rawValue)

        const centerX = boundingBox.x + boundingBox.width/ 2
        const centerY = boundingBox.y + boundingBox.height/ 2

        const fontSize = Math.max(12, 30 * boundingBox.width/ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = "center"

        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)

        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
      }
    },
    async onInit (promise) {
      this.loading = true
      try {
        await promise
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
        this.showScanConfirmation = this.camera === "off"
      }
    },
    async onDecode (content) {
      this.result = content

      this.pause()
      await this.timeout(500)
      this.unpause()
    },

    unpause () {
      this.camera = 'auto'
    },

    pause () {
      this.camera = 'off'
    },
    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
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
}
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .8);
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>
