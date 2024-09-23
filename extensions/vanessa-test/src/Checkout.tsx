import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useCheckoutToken,
  useCartLines,
  useDeliveryGroups,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useTotalAmount,
  useTotalShippingAmount,
  useAttributes
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

interface CartData {
  quantity: number;
}

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

interface VariantData {
  id: string;
  price: {
    amount: string;
  };
  product: {
    opt_in_umg_metaobject?: {
      id: string;
    };
  };
}

function Extension() {
  const translate = useTranslate();
  const api = useApi();
  const instructions = useInstructions();
  const attributes = useAttributes();
  const [variantData, setVariant] = useState<VariantData[] | null>(null);
  const applyAttributeChange = useApplyAttributeChange();
  const cartData = GetCartData();
  const deliveryGroups = useDeliveryGroups();
  const cost = useTotalAmount();
  const shippingCost = useTotalShippingAmount();
  const [cart, setCart] = useState([]);
  const checkoutToken = useCheckoutToken();


  console.log('cartlines', cartData);
  console.log("shippingCost", shippingCost);
  console.log('total amount', cost)
  console.log('deliveryGroups', deliveryGroups);
  console.log('checkoutToken', checkoutToken);


  useEffect(() => {
    async function getCart() {
      try {
        const queryResult = await api.query(`{
          nodes(id: "${checkoutToken}") {
            ... on Cart {
              id
            }
          }
        }`);

        if (queryResult.data) {
          setCart(queryResult.data.nodes);
        }
      } catch (error) {
        console.error("error fetching cart data:", error);
      }
    }
    getCart();
  }, []);

    console.log("cart-", cart);

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="vanessa-test" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="vanessa-test">
        {translate("welcome", {
          target: <Text emphasis="italic">{api.extension.target}</Text>,
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

// GetCartData accesses the current cart lines and gets a map of variant IDs to their quantities.
function GetCartData() {
  const lines = useCartLines();
  const variantMap: { [variantID: string]: CartData } = {};

  lines.forEach((line) => {
    const merchandise = line.merchandise;
    const variantID = merchandise.id;
    const quantity = line.quantity;

    if (variantMap[variantID]) {
      variantMap[variantID].quantity += quantity;
    } else {
      variantMap[variantID] = { quantity };
    }
  });

  // return variantMap;
  return lines
}