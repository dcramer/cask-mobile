export const GQL_ADD_BOTTLE = gql`
  mutation AddBottle($name: String!, $distillery: String!, $brand: String!, $age: Int) {
    addBottle(name: $name, distillery: $distillery, brand: $brand, age: $age) {
      bottle {
        id
        brand
        distillery
        age
      }
    }
  }
`;
