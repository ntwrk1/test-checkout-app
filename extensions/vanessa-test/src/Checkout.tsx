import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useCartLines,
  useDeliveryGroups,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useDiscountCodes,
  // useCheckoutToken,
  // useTotalAmount,
  // useTotalShippingAmount,
  // useAttributes,
  useApplyCartLinesChange,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// interface CartData {
//   quantity: number;
// }

// 1. Choose an extension target
//The below is for the checkout block:
// export default reactExtension("purchase.checkout.block.render", () => (
//   <Extension />
// ));

export default reactExtension(
  "purchase.checkout.cart-line-item.render-after",
  () => <Extension />
);

function Extension() {
  console.log('HEllO? trying again?')
  const translate = useTranslate();
  const { extension, sessionToken } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const deliveryGroups = useDeliveryGroups();

  const modifyCartFn = useApplyCartLinesChange();
  const cartLines = useCartLines();

  // console.log('discount--', useDiscountCodes());
  
//   const options = {
//   method: 'POST',
//   headers: {'Content-Type': 'application/json'},
//   body: '{"base_currency":"USD","skus":[{"sku_id":12345,"quantity":1}],"customer":{"email":"p.sherman@findingnemo.com","first_name":"P","last_name":"Sherman","shipping_address":{"address_1":"42 Wallaby Way","city":"Sydney","country":"AU","postal_code":4000,"state":"NSW","type":"SHIPPING","phone":1234567890},"same_address":true}}'
// };

// fetch('https://sandbox-api.violet.io/v1/checkout/cart', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));




  // const lines = useCartLineTarget();
  // console.dir({ cartLines, deliveryGroups }, { depth: 4 });

  // useEffect(() => {
  //   async function getStuff() {
  //     const session = await sessionToken.get();
  //     // console.log({ modifyCartFn, session });
  //   }
  //   getStuff();
  // });

  console.log('cartLines', cartLines);


  const options = {
    method: 'POST',
    headers: {
    'X-Violet-App-Secret': '9b347f57631c4c76b65e9edcc693bd1c',
    'X-Violet-App-Id': '10928',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

  useEffect(() => {
    async function getStuff() {
      console.log('fetching');
      fetch('https://177b-104-34-160-75.ngrok-free.app/api/estimate-cart', {headers: {'ngrok-skip-browser-warning': '123'}})
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
    }

    getStuff();
  }, []);

  // useEffect(() => {
  //   if (cartLines.length === 1) {
  //     modifyCartFn({
  //       // use this to set the shipping profile ID
  //       type: "addCartLine",
  //       merchandiseId: "gid://shopify/ProductVariant/44959803703533",
  //       quantity: 1,
  //       attributes: [
  //         {
  //           key: "shipping",
  //           value: "free",
  //         },
  //       ],
  //     });
  //   }
  //   console.log("cartLines", cartLines);
  // }, [cartLines]);

  // useEffect(() => {
  //   modifyCartFn({
  //     // use this to set the shipping profile ID
  //     type: "updateCartLine",
  //     id: cartLines[0].id,
  //     attributes: [
  //       {
  //         key: "violet_shipping_id",
  //         value: "free",
  //       },
  //     ],
  //   });
  //   console.log("here");
  // }, []);
  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="shipping-engine" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="shipping-engine">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>
      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}



// function Extension() {
//   const translate = useTranslate();
//   const api = useApi();
//   const instructions = useInstructions();
//   const attributes = useAttributes();
//   const [variantData, setVariant] = useState<VariantData[] | null>(null);
//   const applyAttributeChange = useApplyAttributeChange();
//   const cartData = GetCartData();
//   const deliveryGroups = useDeliveryGroups();
//   const cost = useTotalAmount();
//   const shippingCost = useTotalShippingAmount();
//   const checkoutToken = useCheckoutToken();
//   const [data, setData] = useState();


//   console.log('cartlines', cartData);
//   console.log("shippingCost", shippingCost);
//   console.log('total amount', cost)
//   console.log('deliveryGroups', deliveryGroups);
//   console.log('checkoutToken', checkoutToken);


//   console.log("cart data-", cartData);

//     // useEffect(() => {
//     // api.query(
//     //   `query {
//     //     products(first: 5) {
//     //       nodes {
//     //         id
//     //         title
//     //         metafields(first: 5) {
//     //           edges {
//     //             node {
//     //               id
//     //               key
//     //               value
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }`,
//     // )
//     //   .then(({data, errors}) => setData(data))
//     //   .catch(console.error);
//     // }, [api.query]);
  
//   useEffect(() => {
//     api.query(
//       `query {
//         product(id: "gid://shopify/Product/8367945744621") {
//         title
//           metafields(first: 3) {
//           edges {
//             node {
//               namespace
//               key
//               value
//             }
//           }
//         }
//        }
//       }`,
//     )
//       .then(({data, errors}) => setData(data))
//       .catch(console.error);
//     }, [api.query]);
  
//   console.log("data", data);

//   // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
//   if (!instructions.attributes.canUpdateAttributes) {
//     // For checkouts such as draft order invoices, cart attributes may not be allowed
//     // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
//     return (
//       <Banner title="vanessa-test" status="warning">
//         {translate("attributeChangesAreNotSupported")}
//       </Banner>
//     );
//   }

//   // 3. Render a UI
//   return (
//     <BlockStack border={"dotted"} padding={"tight"}>
//       <Banner title="vanessa-test">
//         {translate("welcome", {
//           target: <Text emphasis="italic">{api.extension.target}</Text>,
//         })}
//       </Banner>
//       <Checkbox onChange={onCheckboxChange}>
//         {translate("iWouldLikeAFreeGiftWithMyOrder")}
//       </Checkbox>
//     </BlockStack>
//   );

//   async function onCheckboxChange(isChecked) {
//     // 4. Call the API to modify checkout
//     const result = await applyAttributeChange({
//       key: "requestedFreeGift",
//       type: "updateAttribute",
//       value: isChecked ? "yes" : "no",
//     });
//     console.log("applyAttributeChange result", result);
//   }
// }

// // GetCartData accesses the current cart lines and gets a map of variant IDs to their quantities.
// function GetCartData() {
//   const lines = useCartLines();
//   const variantMap: { [variantID: string]: CartData } = {};

//   lines.forEach((line) => {
//     const merchandise = line.merchandise;
//     const variantID = merchandise.id;
//     const quantity = line.quantity;

//     if (variantMap[variantID]) {
//       variantMap[variantID].quantity += quantity;
//     } else {
//       variantMap[variantID] = { quantity };
//     }
//   });

//   // return variantMap;
//   return lines
// }