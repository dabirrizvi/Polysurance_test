<template>
  <div class="container-fluid background-answers">
    <div class="row">
      <div class="text-center">
        <!-- animation zoom in -->
        <div class="mt-4 data-intro" data-aos="zoom-in">
          <!-- Display the dynamic heading -->
          <h2>{{ testName }}</h2>
          <p>Displaying all the data</p>
        </div>
      </div>
    </div>
    <!-- display for answers in accordion -->
    <div class="row">
      <!-- animation fade right -->
      <div class="col-xxl-6 col-md-12 mt-4 mb-4" data-aos="fade-right">
        <!-- Column for Product Details accordion component -->
        <accordion-item :accordionId="'accordionProducts_' + uniqueId" :accordionItems="productsAccordionItems" />
      </div>
      <!-- animation fade left -->
      <div class="col-xxl-6 col-md-12 mt-4 mb-4" data-aos="fade-left">
        <!-- Column for Discount Details accordion component -->
        <accordion-item :accordionId="'accordionDiscount_' + uniqueId" :accordionItems="discountAccordionItems" />
      </div>
    </div>
    <div class="row ">
      <!-- animation fade in -->
      <div class="col-12 mt-4 mb-4" data-aos="fade-in">
        <!-- Column for Order Calculations accordion component -->
        <accordion-item :accordionId="'accordionOrder_' + uniqueId" :accordionItems="orderAccordionItems" />
      </div>
    </div>
  </div>
</template>

<script>
// Initialising a counter for generating unique IDs for the accordion
let uniqueIdCounter = 0;
export default {
  props: {
    // Test data received as prop
    testData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Test name placeholder
      testName: '',
      // Accordion content
      productsAccordionItems: [],
      discountAccordionItems: [],
      orderAccordionItems: []
    };
  },
  mounted() {
    // Setting the test name and initialising accordion items
    this.testName = this.testData.name;
    this.setupAccordionItems();
  },
  methods: {
    // Setting up accordion items and adding a unique collapse ID for each.
    setupAccordionItems() {
      this.productsAccordionItems = [{
        title: 'Product Details',
        collapseId: 'collapseProducts' + uniqueIdCounter++,
        ariaExpanded: 'true',
        ariaControls: 'collapseProducts',
        contents: this.testData.products.map(item => `Price of Product SKU:${item.sku} is ${item.price}£`)
      }];

      this.discountAccordionItems = [{
        title: 'Discount Details',
        collapseId: 'collapseDiscount' + uniqueIdCounter++,
        ariaExpanded: 'true',
        ariaControls: 'collapseDiscount',
        contents: this.testData.discounts.map(item => `${item.key} represents ${item.value * 100}% sale on the selected product`)
      }];

      this.orderAccordionItems = this.calculateOrderDetails();

    },
    // Function to calculate order details
    calculateOrderDetails() {
      const orderTotals = this.testData.orders.map(order => {
        let orderTotal = 0;
        let discountValue = 0;
        let discountPercentage = 0;

        // Calculating total order value
        order.items.forEach(item => {
          //  Searching for any products in the order
          const product = this.testData.products.find(prod => prod.sku === item.sku);
          //  If SKU was found for the product. 
          if (product) {
            // calculating order total
            orderTotal += product.price * item.quantity;
          }
        });

        // Calculating discount values and percentages
        // Checking if order has a discount code
        if (order.discount) {
          // Splitting discount codes into array of individual discounts and removing whitespace characters
          const discountCodes = order.discount.split(',').map(code => code.trim());
          // Calculating discount value
          discountValue = this.testData.discounts
            // filtering the discount array and matching with key of discount codes
            .filter(discount => discountCodes.includes(discount.key))
            // Calculating total discount by iterating over filtered discount array
            // Combining discount values for any additional discounts
            // Utilising reduce method to sum up all the discounts in the iteration
            .reduce((acc, discount) => acc + (orderTotal * discount.value), 0);
          // Calculating discount percentage
          discountPercentage = (discountValue / orderTotal) * 100;
        }

        // Calculating discounted total after applying discounts
        const discountedTotal = orderTotal - discountValue;

        // Returning order information to 2 decimal places.
        return {
          orderId: order.orderId,
          orderTotal: orderTotal.toFixed(2),
          discountedTotal: discountedTotal.toFixed(2),
          discountValue: discountValue.toFixed(2),
          discountPercentage: discountPercentage.toFixed(2)
        };
      });

      // Overall order statistics

      // Calculating the total order amounts before any discounts
      const totalOrderTotalsBeforeDiscount = orderTotals.reduce((acc, total) => acc + parseFloat(total.orderTotal), 0).toFixed(2);

      // Calculating the total order amounts after applying discounts
      const totalOrderTotalsAfterDiscount = orderTotals.reduce((acc, total) => acc + parseFloat(total.discountedTotal), 0).toFixed(2);

      // Calculating the total discount value after applying discounts
      const totalDiscountValue = orderTotals.reduce((acc, total) => acc + parseFloat(total.discountValue), 0).toFixed(2);

      //  Checking the number of orders
      const numberOfOrders = orderTotals.length;

      // Calculating the average discount value per order
      const averageDiscountValue = ((totalOrderTotalsBeforeDiscount - totalOrderTotalsAfterDiscount) / numberOfOrders).toFixed(2);

      // Calculating the average discount percentage per order
      const averageDiscountPercentage = ((totalDiscountValue / totalOrderTotalsBeforeDiscount) * 100).toFixed(2);

      // Formatting and returning order details for display
      return [{
        title: 'Order Calculation',
        // Unique collapseId for order accordion 
        collapseId: 'collapseOrder' + uniqueIdCounter++,
        ariaExpanded: 'true',
        ariaControls: 'collapseOrder',
        contents: [
          `Total Sale Before Discount: ${totalOrderTotalsBeforeDiscount}£`,
          `Total Sale After Discount: ${totalOrderTotalsAfterDiscount}£`,
          `Total Money Lost Via Discount: ${totalDiscountValue}£`,
          `Average Discount Value for Each Customer: ${averageDiscountValue}£`,
          `Average Discount Percentage per Order in a Day: ${averageDiscountPercentage}%`,
          //  Using spread operator to separate elements in the array.
          ...orderTotals.map(total => `Order ID: ${total.orderId}, Order Total Before Discount: ${total.orderTotal}£, Discount Value: ${total.discountValue}£, Total Discount: ${total.discountPercentage}%, Order Total After Discount: ${total.discountedTotal}£`)
        ]
      }];
    }

  }
};
</script>

<style scoped>
/* Background for answers page */
.background-answers {
  background-color: hsl(0, 3%, 14%);
  min-height: 100vh;
}


.data-intro {
  padding: 30px 0px;
  color: #fff;
}
</style>
