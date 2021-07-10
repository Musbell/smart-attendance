import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'

export default (ctx) => {
  const wsLink = process.browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
    uri: `ws://smart-attendace.hasura.app/v1/graphql`,
    options: {
      reconnect: true
    }
  }) : null;

  const httplink = new HttpLink({
    uri: 'https://smart-attendace.hasura.app/v1/graphql',
    credentials: 'same-origin'
  });
  const link = process.browser ? split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httplink,
  ) : httplink;

  const cache = new InMemoryCache()

  return {
    link,
    cache
  }
}
