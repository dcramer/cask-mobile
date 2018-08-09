export const GQL_ADD_DISTILLERY = gql`
  mutation AddDistillery($name: String!, $region: String!) {
    addDistillery(name: $name, region: $region) {
      distillery {
        id
        name
        region
      }
    }
  }
`;
