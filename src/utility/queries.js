import {gql} from "@apollo/client";

export class query {
    static Insert = (name, vol, weight) => `
  mutation MyMutation {
    insert_web3_strogate(objects: {name: "${name}", volume_m3: "${vol}", weight_kg: "${weight}"}) {
      returning {
        name
        volume_m3
        weight_kg
      }
    }
  }
`
    static DeleteBiggerThen = (maxVol) => `
  mutation MyMutation {
    delete_web3_strogate(where: {volume_m3: {_gt: "${maxVol}"}}) {
      returning {
        name
        volume_m3
        weight_kg
      }
    }
  }
`;

    static getSub = gql`subscription MySubscription {
  web3_strogate {
    id
    name
    volume_m3
    weight_kg
  }
}`
}