<template>
  <v-data-table
    :headers="headers"
    :items="staff"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><v-icon class='mx-3'>mdi-account</v-icon>Staff</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-dialog
        v-model="dialog"
        max-width="800px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ staffDetail.first_name }}  {{ staffDetail.last_name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify='space-between'>
                <v-col cols='12' sm='4'>
                  <v-avatar tile size='200'>
                    <img
                      :src="staffDetail.photo"
                      :alt="staffDetail.id"
                    >
                  </v-avatar>
                 <div class='mt-3'>
                  <v-card color='white' width='200'>
                    <v-card-text>
                      <qrcode-vue :value="staffDetail.staff_id" size="150" level="L" margin='20' />
                    </v-card-text>
                  </v-card>
<!--                   <qrcode-->
<!--                     :value="staffDetail.id"-->
<!--                     :options="{ width: 200, color: { dark: '#424242', light: '#BDBDBD' } }"-->
<!--                     tag="img"-->
<!--                   ></qrcode>-->
                 </div>
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
                  <v-subheader>
                    <v-icon small class='mx-3'>mdi-checkbox-marked-circle-outline</v-icon> {{ staffDetail.getTotalPresent() }}
                    <v-icon small class='mx-3'>mdi-close-circle-outline</v-icon> {{ staffDetail.getTotalAbsent() }}
                    <span class='caption mx-2'>of {{ staffDetail.working_days }} working days</span>
                    <v-spacer/> Net pay: ₦0
                  </v-subheader>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="text-left">
                          status
                        </th>
                        <th class="text-left">
                          Date
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                        v-for="item in staffDetail.attendances"
                        :key="item.id"
                      >
                        <td>
                          <v-icon v-if='item.is_present'>mdi-checkbox-marked-circle-outline</v-icon>
                          <v-icon v-if='!item.is_present'>mdi-close-circle-outline</v-icon>
                        </td>
                        <td>{{ item.date }}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="close"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template  #[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click.stop="openDialog(item)"
      >
        mdi-eye
      </v-icon>
    </template>
    <template #[`item.photo`]="{ item }">
     <v-container>
       <v-avatar size='30'>
         <img
           :src="item.photo"
           alt="John"
         >
       </v-avatar>
     </v-container>
    </template>
  </v-data-table>
</template>
<script>
// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'
import QrcodeVue from 'qrcode.vue'


export default {
  name: 'Staff',
  components: {
    QrcodeVue,
  },
  data: () => ({
    dialog: false,
    staff: [],
    headers: [
      {
        text: 'Photo',
        align: 'start',
        sortable: false,
        value: 'photo',
      },
      { text: 'First name', value: 'first_name' },
      { text: 'last name', value: 'last_name' },
      { text: 'Role', value: 'role' },
      { text: 'Salary (₦)', value: 'salary' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
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
  }),
  apollo: {
    staff: {
      query: gql`
            query getStaff {
            staff {
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
          }`,
      update: data => data.staff,
      result ({ data, loading, networkStatus }) {
        this.staff = [...data.staff]
      },
      context: {
        headers: {
          'x-hasura-admin-secret': 'al9qRRTz3KyATwkdyNuJCxXasdhnpZ7IQghfi7Dyn09dRmJgkdsJ3Wp3RxUPXu0t'
        }
      },
    }
  },
  methods: {
    close () {
      this.dialog = false
    },
    openDialog(item) {
      this.dialog = true
      this.staffDetail = {...item, getTotalPresent() {
          // eslint-disable-next-line no-unused-expressions,camelcase
          return this.attendances.filter(({is_present}) => is_present === true).length
        },
        getTotalAbsent() {
          // eslint-disable-next-line no-unused-expressions,camelcase
          return this.attendances.filter(({is_present}) => is_present === false).length
        }
      }
    }
  },
}
</script>
