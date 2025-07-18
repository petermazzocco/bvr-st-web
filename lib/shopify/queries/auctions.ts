import productFragment from "../fragments/product";
import seoFragment from "../fragments/seo";

const auctionFragment = /* GraphQL */ `
  fragment auction on Metaobject {
    id
    handle
    type
    fields {
      key
      value
    }
    updatedAt
  }
`;

export const getAuctionQuery = /* GraphQL */ `
  query getAuction($handle: String!) {
    metaobject(handle: { handle: $handle, type: "auction" }) {
      ...auction
    }
  }
  ${auctionFragment}
`;

export const getAuctionsQuery = /* GraphQL */ `
  query getAuctions($first: Int = 100) {
    metaobjects(type: "auction", first: $first) {
      edges {
        node {
          ...auction
        }
      }
    }
  }
  ${auctionFragment}
`;

export const getAuctionProductsQuery = /* GraphQL */ `
  query getAuctionProducts($auctionHandle: String!) {
    metaobject(handle: { handle: $auctionHandle, type: "auction" }) {
      fields {
        key
        value
        ... on MetaobjectField {
          references(first: 100) {
            edges {
              node {
                ... on Product {
                  ...product
                }
              }
            }
          }
        }
      }
    }
  }
  ${productFragment}
`;
