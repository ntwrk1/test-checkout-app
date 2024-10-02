/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const deliveryOptions = [];

  for (const deliveryGroup of input.cart.deliveryGroups) {
    for (const deliveryOption of deliveryGroup.deliveryOptions) {
      deliveryOptions.push({
        deliveryOption: {
          handle: deliveryOption.handle,
        },
      });
    }
  }

  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets: deliveryOptions,
        // Define a percentage-based discount
        value: {
          percentage: {
            value: "50.0",
          },
        },
      },
    ],
  };
}
