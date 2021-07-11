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
     <v-subheader>{{ $moment().format('MMMM Do YYYY, h:mm:ss a') }}</v-subheader>
     <v-btn icon @click='$router.push("/")'>
       <v-icon>mdi-home</v-icon>
     </v-btn>
   </v-app-bar>
   <v-row justify="center" align="center" class='mt-2'>
     <v-col cols="12" sm="8" md="4">
       <v-subheader><v-icon class='mr-3'>mdi-alert-box-outline</v-icon>Clock-in with your Qrcode<v-icon class='ml-3'>mdi-qrcode</v-icon></v-subheader>
       <v-card
         class="mx-auto"
         flat
         color='transparent'
       >
         <div v-if="loading" class="loading-indicator">
           Loading...
         </div>
         <div  v-if='result' style='max-width: 100%'>
           <v-img
             style='margin: auto'
             lazy-src="https://innovativesecurities.com/images/icons/success-2-once.gif"
             max-width="100"
             src="https://innovativesecurities.com/images/icons/success-2-once.gif"
           ></v-img>
         </div>
        <div v-else>
          <qrcode-stream v-if="!destroyed" :key="_uid" :camera='camera' :track="paintCenterText" @decode='onDecode' @init="onInit">
            <div v-show="showScanConfirmation" class="scan-confirmation">
              <img src="https://res.cloudinary.com/musbell/image/upload/v1593962985/5d4d82ec574a788542d8e1e9_success-2-once_fayepz.gif" alt="Checkmark"  />
            </div>
          </qrcode-stream>
        </div>
         <v-card-text>
           <p class="decode-result">Staff ID: <b>{{ result }}</b></p>
           <v-btn v-if='result' block class='my-5' @click='$router.go()'>
             Reset
           </v-btn>
         </v-card-text>
       </v-card>
     </v-col>
     <v-col cols="12" sm="8" md="8">
       <v-card
         class="mx-auto"
         color='black'
         style='opacity: 0.8'
         height='500'
         elevation='10'
         rounded
       >
         <div v-if='profileLoading'>Loading profile...</div>
         <v-container v-if='result && profileLoading === false'>
           <v-row justify='space-between' class='mt-5'>
             <v-col cols='12' sm='4'>
               <v-avatar tile size='200'>
                 <img
                   :src="staffDetail.photo"
                   :alt="staffDetail.id"
                 >
               </v-avatar>
             </v-col>
             <v-col cols='12' sm='8'>
               <v-row>
                 <v-col
                   cols="12"
                   sm="6"
                   md="4"
                 >
                   <v-text-field
                     v-model="staffDetail.first_name"
                     disabled
                     label="First name"
                   ></v-text-field>
                 </v-col>
                 <v-col
                   cols="12"
                   sm="6"
                   md="4"
                 >
                   <v-text-field
                     v-model="staffDetail.last_name"
                     disabled
                     label="last name"
                   ></v-text-field>
                 </v-col>
                 <v-col
                   cols="12"
                   sm="6"
                   md="4"
                 >
                   <v-text-field
                     v-model="staffDetail.role"
                     disabled
                     label="Role"
                   ></v-text-field>
                 </v-col>
                 <v-col
                   cols="12"
                   sm="6"
                   md="4"
                 >
                   <v-text-field
                     v-model="staffDetail.salary"
                     disabled
                     label="Salary (₦)"
                   ></v-text-field>
                 </v-col>
                 <v-col
                   cols="12"
                   sm="6"
                   md="4"
                 >
                   <v-text-field
                     v-model="staffDetail.working_days"
                     disabled
                     label="Working days"
                   ></v-text-field>
                 </v-col>
               </v-row>
               <v-subheader class='mt-10'>
                 <v-icon small class='mx-3'>mdi-checkbox-marked-circle-outline</v-icon> {{ staffDetail.getTotalPresent() }}
                 <v-icon small class='mx-3'>mdi-close-circle-outline</v-icon> {{ staffDetail.working_days - staffDetail.getTotalPresent() }}
                 <span class='caption mx-2'>of {{ staffDetail.working_days }} working days</span>
                 <v-spacer/> Net pay: ₦{{ calculateNetPay((((staffDetail.working_days - staffDetail.getTotalPresent()) / 5) >> 0) * 10, staffDetail.salary) }}
               </v-subheader>
             </v-col>
           </v-row>
         </v-container>
         <v-img
           v-else
           height="500"
           style='opacity: 0.8;'
           src="https://res.cloudinary.com/musbell/image/upload/v1625850827/2c6884_53d196003ef84b7eaf535640b426b016_mv2_h0t4lb.gif"
         ></v-img>
       </v-card>
     </v-col>
   </v-row>
 </div>
</template>
<script>
// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'
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
      profileLoading: false,
      destroyed: false,
      camera: 'auto',
      result: null,
      showScanConfirmation: false,
      staffDetail: {
        id: null,
        photo: '',
        first_name: '',
        last_name: '',
        role: '',
        salary: '',
        working_days: 0,
        staff_id: null,
        attendances: [{
          id: null,
          is_present: false,
          date: null,
        }],
        getTotalPresent() {
          return 0
        },
        getTotalAbsent() {
          return 0
        }
      }
    }
  },

  methods: {
    calculateNetPay(partialValue, totalValue) {
      return totalValue - ((totalValue / 100) * partialValue);
    },
    // eslint-disable-next-line camelcase
    async postAttendance(staff, is_present) {
      try {
        await this.$apollo.mutate({mutation: gql`
            mutation postAttendance($staff: Int!, $is_present: Boolean! ) {
            insert_attendance_one(object: {
              staff: $staff,
              is_present: $is_present,
            }) {
              id
            }
          }
        `,  context: {
            headers: {
              'x-hasura-admin-secret': 'al9qRRTz3KyATwkdyNuJCxXasdhnpZ7IQghfi7Dyn09dRmJgkdsJ3Wp3RxUPXu0t'
            }
          },
          variables: {
            staff,
            is_present
          },
        })
      } catch (e) {
        console.log(e)
      }
    },
    async getStaff() {
      this.profileLoading = true
      try {
        await this.$apollo.query({
          query: gql`
                query getStaff($staff_id: uuid_comparison_exp! ){
                    staff_aggregate(where: {
                      staff_id: $staff_id
                    }) {
                      nodes {
                         id
                          first_name
                          last_name
                          role
                          salary
                          working_days
                          photo
                          staff_id
                          attendances {
                            id
                            is_present
                            date
                          }
                      }
                    }
                  }
          `,
          context: {
            headers: {
              'x-hasura-admin-secret': 'al9qRRTz3KyATwkdyNuJCxXasdhnpZ7IQghfi7Dyn09dRmJgkdsJ3Wp3RxUPXu0t'
            }
          },
          variables: {
            staff_id:  {
              _eq: this.result
            }
          },
        }).then(({data}) => {
          (this.staffDetail = {...data.staff_aggregate.nodes[0],  getTotalPresent() {
            // eslint-disable-next-line no-unused-expressions,camelcase
            return this.attendances.filter(({is_present}) => is_present === true).length + 1
          },
          getTotalAbsent() {
            // eslint-disable-next-line no-unused-expressions,camelcase
            return this.attendances.filter(({is_present}) => is_present === false).length
          }})
          this.postAttendance(this.staffDetail.id, true)
          this.profileLoading = false
        })
      } catch (e) {
        this.profileLoading = false
        console.error(e)
      }
    },
    paintCenterText (detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode

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
      if(this.result) {
        await this.getStaff()
      }

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
