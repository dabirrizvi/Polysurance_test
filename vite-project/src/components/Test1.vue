<template>
  <div class="container-fluid background-test-1">
    <div class="row">
      <div class="text-center">
        <!-- animation zoom in -->
        <div class="mt-4 data-intro" data-aos="zoom-in">
          <h2>Placement Test no.1</h2>
          <p>Displaying all the data</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xxl-6 col-md-12 mt-4 mb-4">
        <!-- Column for Product Details accordion component -->
        <!-- animation fade right -->
        <accordion-item data-aos="fade-right" :accordionId="'accordionProducts'"
          :accordionItems="productsAccordionItems" />
      </div>
      <div class="col-xxl-6 col-md-12 mt-4 mb-4">
        <!-- Column for Discount Details accordion component -->
        <!-- animation fade left -->
        <accordion-item data-aos="fade-left" :accordionId="'accordionDiscount'"
          :accordionItems="discountAccordionItems" />
      </div>
    </div>
    <div class="row ">
      <div class="col-12 mt-4 mb-4" data-aos="fade-up">
        <!-- Column for Order Details accordion component -->
        <!-- animation fade up -->
        <accordion-item :accordionId="'accordionOrder'" :accordionItems="orderAccordionItems" />
      </div>

    </div>
  </div>
</template>
<script>
// Importing given json data
import discountData from '../assets/data_part1/discounts.json';
import productData from '../assets/data_part1/products.json';
import orderData from '../assets/data_part1/orders.json';

export default {
  // Initial data for accordion items (from AccordionItem.vue component)
  data() {
    return {
      productsAccordionItems: [
        {
          title: 'Product Details',
          collapseId: 'collapseProducts',
          ariaExpanded: 'true',
          ariaControls: 'collapseProducts',
          contents: [],
        },
      ],
      discountAccordionItems: [
        {
          title: 'Discount Details',
          collapseId: 'collapseDiscount',
          ariaExpanded: 'true',
          ariaControls: 'collapseDiscount',
          contents: [],
        },
      ],
      orderAccordionItems: [
        {
          title: 'Order Calculation',
          collapseId: 'collapseOrder',
          ariaExpanded: 'true',
          ariaControls: 'collapseOrder',
          contents: [],
        },
      ],
    };
  },
  // Executed when the component is mounted
  mounted() {
    // Contents for Product Details accordion items
    this.productsAccordionItems[0].contents = productData.map(item => `Price of Product SKU:${item.sku} is ${item.price}£`);
    // Contents for Discount Details accordion items
    this.discountAccordionItems[0].contents = discountData.map(item => `${item.key} represents ${item.value * 100}% sale on the selected product`);

    // Order Statistics
    const orderTotals = this.calculateAllOrderTotals();
    // Calculate the total order amounts before any discounts
    const totalOrderTotalsBeforeDiscount = orderTotals.reduce((acc, total) => acc + parseFloat(total.orderTotal), 0).toFixed(2);
    // Calculate the total order amounts after applying discounts
    const totalOrderTotalsAfterDiscount = orderTotals.reduce((acc, total) => acc + parseFloat(total.discountedTotal), 0).toFixed(2);
    // Calculate the total discount value after applying discounts
    const totalDiscountValue = orderTotals.reduce((acc, total) => acc + parseFloat(total.discountValue), 0).toFixed(2);
    //  Check the number of orders
    const numberOfOrders = orderTotals.length;
    // Calculate the average discount value per order
    const averageDiscountValue = ((totalOrderTotalsBeforeDiscount - totalOrderTotalsAfterDiscount) / numberOfOrders).toFixed(2);
    // Calculate the average discount percentage per order
    const averageDiscountPercentage = ((totalDiscountValue / totalOrderTotalsBeforeDiscount) * 100).toFixed(2);

    // Contents for Order Details accordion items
    this.orderAccordionItems[0].contents = [
      `Total Sale Before Discount: ${totalOrderTotalsBeforeDiscount}£`,
      `Total Sale After Discount: ${totalOrderTotalsAfterDiscount}£`,
      `Total Money Lost via Discount Codes: ${totalDiscountValue}£`,
      `Average Discount Value for Each Customer: ${averageDiscountValue}£`,
      `Average Discount Percentage per Order in a Day: ${averageDiscountPercentage}%`,
      //  Using spread operator to separate elements in the array.
      ...orderTotals.map(total => `For Order ID ${total.orderId}: Order Total Before Discount: ${total.orderTotal}£, Order Total After Discount: ${total.discountedTotal}£, Discount Value: ${total.discountValue}£`)
    ];
  },

  methods: {
    // Function to caluclate order details
    calculateOrderTotals(order) {
      // Initialize variables to track total amounts
      let orderTotal = 0;
      let discountedTotal = 0;

      // Iterating through each item in the order
      order.items.forEach(item => {
        // Find the corresponding product information for the item
        const product = productData.find(prod => prod.sku === item.sku);
        // Check if product is present
        if (product) {
          orderTotal += product.price * item.quantity;
          // Find the corresponding discount information for the order
          const discount = discountData.find(discount => discount.key === order.discount);
          // Check if order has a discount
          if (discount) {
            // Calculate the discounted total 
            discountedTotal += (product.price * (1 - discount.value)) * item.quantity;
          }
          // If order has no discount set after discount price to order price
          else {
            discountedTotal = orderTotal;
          }
        }
      });

      // Calculate the total discount value
      const discountValue = orderTotal - discountedTotal;

      // Return an object with calculated order totals
      return {
        orderId: order.orderId,
        orderTotal: orderTotal.toFixed(2),
        discountedTotal: discountedTotal.toFixed(2),
        discountValue: discountValue.toFixed(2),
      };
    },
    calculateAllOrderTotals() {
      // Map over each order in orderData and calculate order totals
      return orderData.map(order => this.calculateOrderTotals(order));
    },
  },
};
</script>



<style scoped>
.background-test-1 {
  background-color: #252323;
  min-height: 100vh;
}

.container-fluid {
  color: #fff;
}

.data-intro {
  padding: 30px 0px;
}
</style>