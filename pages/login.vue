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
          <v-card-title class="headline">
            Welcome to Karota page
          </v-card-title>
          <v-card-text>
            <p>Kano Road Traffic Agency is a Kano State government agency which was established to transform the state's transportation system and ensure free traffic in Kano as well as reduce road accidents.</p>
            <hr class="my-3">
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="#FFA000"
              @click="$auth.loginWith('auth0')"
            >
              Authenticate
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Particles from '~/components/Particles'
export default {
  name: 'Login',
  components: { Particles },
  layout: 'authenticate',
  auth: false,
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


