// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Operation} Operation
 */

// The configured entrypoint for the 'purchase.delivery-customization.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // The message to be added to the delivery option
  const message = "LA traffic ain't it";
  console.log(input.cart.deliveryGroups);
  let toRename = input.cart.deliveryGroups
    // Filter for delivery groups with a shipping address containing the affected state or province
    .filter(
      (group) =>
        group.deliveryAddress?.provinceCode &&
        group.deliveryAddress.provinceCode == "CA",
    )
    // Collect the delivery options from these groups
    .flatMap((group) => group.deliveryOptions)
    // Construct a rename operation for each, adding the message to the option title
    .map(
      (option) =>
        /** @type {Operation} */ ({
          rename: {
            deliveryOptionHandle: option.handle,
            title: option.title ? `${option.title} - ${message}` : message,
          },
        }),
    );

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    // operations: toRename,
    operations: [
      {
        hide: {
          deliveryOptionHandle:
            "d182bc2fb160855d7bc57c881e40ad30-8388085074acab7e91de633521be86f0",
        },
      },
      {
        hide: {
          deliveryOptionHandle:
            "d182bc2fb160855d7bc57c881e40ad30-6d5a64f58240381019fc074473bab3ab",
        },
      },
      {
        rename: {
          deliveryOptionHandle:
            "d182bc2fb160855d7bc57c881e40ad30-4126b244bcf58c0aedd4241906cd7b03",
          title: "LA traffic ain't it",
        },
      },
    ],
  };
}
