<template>
    <!-- Display the Intro component -->
    <Intro />
    <!-- Display the components only when data is loaded -->
    <!-- Display the Answers for test 1 -->
    <Answers  v-if="dataLoaded" :testData="testData" />
    <!-- Display the Answers  for test 2 -->
    <Answers v-if="dataLoaded" :testData="testData2" />
</template>

<script>
// Importing components for the App
import Intro from "./components/Polysurance_intro.vue"
import Answers from "./components/Answers.vue"

export default {
    components: {
        Answers,
        Intro,
    },
    data() {
        return {
            // Test data for the first test
            testData: {
                name: 'Placement Test no.1',
                products: [],
                discounts: [],
                orders: []
            },
            // Test data for the second test
            testData2: {
                name: 'Placement Test no.2',
                products: [],
                discounts: [],
                orders: []
            },
            // Flag to track if data is loaded
            dataLoaded: false
        };
    },
    mounted() {
        // Load test data for the first test
        this.loadTestData();
        // Load test data for the second test
        this.loadTestData2();
    },
    methods: {
        loadTestData() {
            // Load product data for the first test
            import('./assets/data_part1/products.json')
                .then(productData => {
                    this.testData.products = productData.default;
                    // Load discount data for the first test
                    return import('./assets/data_part1/discounts.json');
                })
                .then(discountData => {
                    this.testData.discounts = discountData.default;
                    // Load order data for the first test
                    return import('./assets/data_part1/orders.json');
                })
                .then(orderData => {
                    this.testData.orders = orderData.default;
                })
                .catch(error => {
                    console.error('Error loading test data for test 1:', error);
                });
        },
        loadTestData2() {
            // Load product data for the second test
            import('./assets/data_part2/products.json')
                .then(productData2 => {
                    this.testData2.products = productData2.default;
                    // Load discount data for the second test
                    return import('./assets/data_part2/discounts.json');
                })
                .then(discountData2 => {
                    this.testData2.discounts = discountData2.default;
                    // Load order data for the second test
                    return import('./assets/data_part2/orders.json');
                })
                .then(orderData2 => {
                    this.testData2.orders = orderData2.default;
                    // Set dataLoaded to true when data is loaded
                    this.dataLoaded = true;
                })
                .catch(error => {
                    console.error('Error loading test data for test 2:', error);
                });
        },
    }
};
</script>
