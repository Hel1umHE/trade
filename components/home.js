// 首页组件
const HomeComponent = {
    template: `
        <div>
            <h4>首页</h4>
            <p>欢迎来到校园交易平台首页！</p>
            <div class="row mt-4">
            <!-- 无商品提示 -->
            <div v-if="products.length === 0 && !searchKeyword" class="col-12 text-center py-5">
                <p class="text-muted">暂无商品</p>
            </div>
                <!-- 商品卡片 -->
                <div class="col-md-4" v-for="product in filteredProducts" :key="product.id">
                    <div class="product-card">
                        <img :src="product.image" alt="商品图片" @click="goToProduct(product)">
                        <div class="product-info">
                            <h5 @click="goToProduct(product)" style="cursor: pointer;">{{ product.title }}</h5>
                            <p class="text-muted">{{ product.description }}</p>
                            <p class="product-price">{{ product.price }}</p>
                            <div class="d-flex justify-content-between">
                                <span>发布者：{{ product.sellerName }}</span>
                                <button class="btn btn-sm btn-primary" @click="goToProduct(product)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 无搜索结果提示 -->
                <div v-if="filteredProducts.length === 0 && searchKeyword" class="col-12 text-center py-5">
                    <p class="text-muted">未找到相关商品</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            products: [],
            searchKeyword: ''
        };
    },
    computed: {
        // 根据搜索关键字过滤商品
        filteredProducts() {
            if (!this.searchKeyword) {
                return this.products;
            }
            const keyword = this.searchKeyword.toLowerCase();
            return this.products.filter(product => {
                return product.title.toLowerCase().includes(keyword) ||
                    product.description.toLowerCase().includes(keyword) ||
                    product.sellerName.toLowerCase().includes(keyword);
            });
        }
    },
    mounted() {
        this.loadProducts();
        // 监听根组件的搜索事件
        this.$root.$on('search', (keyword) => {
            this.searchKeyword = keyword;
        });
    },
    beforeDestroy() {
        // 组件销毁前移除事件监听，避免内存泄漏
        this.$root.$off('search');
    },
    methods: {
        loadProducts() {
            // 从 localStorage 获取商品数据
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
            } else {
                // 初始化示例商品数据
                const initialProducts = [
                    {
                        id: 1,
                        title: '磁轴键盘',
                        description: '磁轴键盘，泰山轴GT，高精准度助你停的更稳',
                        price: '¥99.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 1,
                        sellerName: '卖家昵称1'
                    },
                    {
                        id: 2,
                        title: '游戏鼠标',
                        description: '高精度游戏鼠标，RGB灯光，舒适握感',
                        price: '¥129.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 2,
                        sellerName: '卖家昵称2'
                    },
                    {
                        id: 3,
                        title: '机械键盘',
                        description: '青轴机械键盘，打字手感舒适，RGB背光',
                        price: '¥159.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 1,
                        sellerName: '卖家昵称1'
                    }
                ];
                // 保存到 localStorage
                localStorage.setItem('products', JSON.stringify(initialProducts));
                this.products = initialProducts;
            }
        },
        goToProduct(product) {
            // 只保存商品ID到localStorage，避免localStorage容量超限
            localStorage.setItem('currentProductId', product.id.toString());
            // 跳转到商品详情页
            this.$router.push(`/product/${product.id}`);
        }
    }
};