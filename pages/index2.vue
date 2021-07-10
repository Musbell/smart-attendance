<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card
        class="mx-auto"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              Absence
            </div>
            <v-list-item-title class="text-h3 mb-1">
              100
            </v-list-item-title>
            <v-list-item-subtitle>Total number of staff absent</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
            size="80"
          >
            <v-icon dark size='60' color='error'>
              mdi-account-group
            </v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
          >
            Download report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <v-card
        class="mx-auto"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              Appearance
            </div>
            <v-list-item-title class="text-h3 mb-1">
              {{ totalPresent }}
            </v-list-item-title>
            <v-list-item-subtitle>Total number os staff present</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
            size="80"
          >
            <v-icon dark size='60' color='info'>
              mdi-account-group
            </v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
          >
            Download report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'
export default {
  data: () => ({
    totalPresent: 0
  }),
  apollo: {
    attendance: {
      query: gql`
            query getAttendance {
            attendance {
            id
            is_present
            }
            }
            `,
      context: {
        headers: {
          'x-hasura-admin-secret': 'al9qRRTz3KyATwkdyNuJCxXasdhnpZ7IQghfi7Dyn09dRmJgkdsJ3Wp3RxUPXu0t'
        }
      },
      update: data => {
        this.totalPresent = data.attendance
      }
// subscribeToMore: {
//   document: gql`subscription getAttendanceSubscription {
//   attendance {
//     id
//     is_present
//   }
// }`,
//   // Mutate the previous result
//   updateQuery: (previousResult, { subscriptionData }) => {
//     this.getTotalPresent(subscriptionData)
//     this.getTotalPresent('see me')
//   },
// }
    }
  },

}
</script>

