export const GQL_ADD_BRAND = gql`
  mutation AddBrand($name: String!) {
    addBrand(name: $name) {
      brand {
        id
        name
      }
    }
  }
`;
